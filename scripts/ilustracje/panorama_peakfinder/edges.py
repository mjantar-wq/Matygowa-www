"""Linie grzbietów wewnątrz panoramy (krawędzie zasłaniania, jak rysuje PeakFinder), połączone w łamane."""
import numpy as np
z=np.load('ang.npz'); ang=z['ang'].astype(float); azs=z['azs']; d=z['d']
GAPREL=0.03
rows=[]
for k in range(len(azs)):
    a=ang[k]; M=np.maximum.accumulate(a)
    newmax=np.r_[True,a[1:]>M[:-1]]
    ed=[]
    idx=np.nonzero(newmax)[0]
    # krawędź: ostatni punkt ciągu nowych maksimów, po którym teren chowa się na dłuższym odcinku
    for n,j in enumerate(idx):
        nxt=idx[n+1] if n+1<len(idx) else len(d)
        gap=(d[nxt]-d[j]) if nxt<len(d) else 1e9
        if nxt>j+1 and gap>max(200,GAPREL*d[j]) and d[j]>2500:
            ed.append((a[j],d[j]))
    rows.append(ed)
# łączenie w łamane
lines=[]; open_=[]
for k,ed in enumerate(rows):
    used=set(); new_open=[]
    for L in open_:
        a0,d0=L['pts'][-1][1],L['pts'][-1][2]
        best=None
        for n,(a,dd) in enumerate(ed):
            if n in used: continue
            if abs(a-a0)<0.035 and abs(dd-d0)<0.12*d0:
                s=abs(a-a0)/0.035+abs(dd-d0)/(0.12*d0)
                if best is None or s<best[0]: best=(s,n)
        if best: used.add(best[1]); a,dd=ed[best[1]]; L['pts'].append((k,a,dd)); new_open.append(L)
        else: lines.append(L)
    for n,(a,dd) in enumerate(ed):
        if n not in used: new_open.append({'pts':[(k,a,dd)]})
    open_=new_open
lines+=open_
lines=[L['pts'] for L in lines if len(L['pts'])>=12]
import pickle; pickle.dump(lines,open('edges.pkl','wb'))
print(len(lines), sum(len(l) for l in lines))
