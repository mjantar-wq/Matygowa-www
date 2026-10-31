"""G2: panorama Tatr na stronie (wariant B, zaakceptowany przez Michała 26.10).

Kolejność (uruchamiać w tym katalogu): compute.py (kąty z DEM Terrarium z13) → trace.py (linia grani ze zrzutów
PeakFindera; wynik trace_raw.json jest już zapisany) → fuse.py (grań PeakFindera dopasowana do DEM) → edges.py
(linie grzbietów wewnątrz masywu) → gen.py. Giewont (jako jedyny poza linią grani Tatr, niższy i bliższy niż Czerwone Wierchy) ma własną warstwę „warstwa-giewont”.
Łamane są upraszczane (RDP, 0,3 px), żeby SVG ważył kilkadziesiąt KB. Wynik: G2_panorama_wariant_B.svg i G2_panorama.json, kopiowane do
public/ilustracje/G2_panorama.*. Poprzednia, gładka wersja: public/ilustracje/G2_panorama_poprzednia.svg (../panorama.py).
"""
import sys, math, json, pickle, numpy as np
sys.path.insert(0,str(__import__('pathlib').Path(__file__).resolve().parents[1]))
from tokeny import z_zapasem
from dem_hi import elev, SITE
z=np.load('ang.npz'); ang=z['ang'].astype(float); azs=z['azs']; d=z['d']; H0=float(z['H0'])
fused=np.load('fused.npy'); lines=pickle.load(open('edges.pkl','rb'))
AZ0,AZ1,STEP=124.0,240.0,0.02
R=6371000.0
sky=ang.max(1)
def band(d0,d1):
    m=(d>=d0)&(d<d1); return ang[:,m].max(1)
far,mid,near=band(9000,1e9),band(2500,9000),band(80,2500)
def sm(row,n):
    k=np.ones(n)/n; return np.convolve(np.pad(row,n//2,mode='edge'),k,mode='valid')[:len(row)]
delta=fused-sky
far_d=np.where(far>=sky-0.02,far+delta,far)
mid_d=np.where((mid>=sky-0.02),mid+delta,mid)
mid_d=sm(mid_d,5); near_d=sm(near,31)

# Giewont: jako jedyny nie leży w linii grani Tatr. Z osady (ok. 13,8 km) jest niższy i bliższy niż Czerwone Wierchy
# (15,6 km) i zasłania ich podnóże, więc dostaje własną warstwę: najwyższy kąt terenu w odległości 9–14,2 km,
# w oknie azymutów wokół masywu, z łagodnym zejściem na brzegach okna.
GW_D=(9000,14200); GW_AZ=(214.5,227.0); GW_TAPER=2.4; GW_DROP=2.0
gw_raw=sm(ang[:,(d>=GW_D[0])&(d<GW_D[1])].max(1),9)
def smooth01(t): t=np.clip(t,0,1); return t*t*(3-2*t)
gw_w=smooth01((azs-GW_AZ[0])/GW_TAPER)*smooth01((GW_AZ[1]-azs)/GW_TAPER)   # 1 w środku okna, 0 poza nim
gw_d=np.minimum(gw_raw-GW_DROP*(1-gw_w), far_d-0.02)
gw_on=gw_w>0.002                                                              # tam rysujemy warstwę

PEAKS=[("kominiarski-wierch","Kominiarski Wierch",1829,49.24081,19.83554),("ciemniak","Ciemniak",2096,49.23101,19.90341),
("czerwone-wierchy","Czerwone Wierchy",2122,49.23166,19.90949),("giewont","Giewont",1894,49.25095,19.93410),
("swinica","Świnica",2301,49.21942,20.00931),("woloszyn","Wołoszyn",2155,49.22833,20.05000),("gerlach","Gerlach",2655,49.16403,20.13406),
("lodowy","Lodowy Szczyt",2627,49.19855,20.18277),("lomnica","Łomnica",2634,49.19514,20.21303),("hawran","Hawrań",2152,49.24847,20.19769)]
def bearing_dist(lat1,lon1,lat2,lon2):
    p1,p2=math.radians(lat1),math.radians(lat2); dl=math.radians(lon2-lon1)
    b=math.degrees(math.atan2(math.sin(dl)*math.cos(p2),math.cos(p1)*math.sin(p2)-math.sin(p1)*math.cos(p2)*math.cos(dl)))%360
    dd=2*R*math.asin(math.sqrt(math.sin((p2-p1)/2)**2+math.cos(p1)*math.cos(p2)*math.sin(dl/2)**2)); return b,dd
def snap(lat,lon,r=150):
    best=(float(elev(lat,lon)),lat,lon)
    for dy in range(-r,r+1,15):
        for dx in range(-r,r+1,15):
            la=lat+dy/111320; lo=lon+dx/(111320*math.cos(math.radians(lat))); e=float(elev(la,lo))
            if e>best[0]: best=(e,la,lo)
    return best
peaks=[]
for slug,name,h,lat,lon in PEAKS:
    e,la,lo=snap(lat,lon); az,dd=bearing_dist(*SITE,la,lo)
    k=int(round((az-AZ0)/STEP))
    if slug=='giewont': k=k-15+int(np.argmax(gw_d[k-15:k+16]))                 # wierzchołek na własnej warstwie Giewontu
    else: k=k-6+int(np.argmax(far_d[k-6:k+7]))  # wierzchołek na rysowanej grani (±0,12°)
    peaks.append(dict(slug=slug,name=name,height=h,az=round(az,2),dist_km=round(dd/1000,1),k=k))

W=3200; PX=W/(AZ1-AZ0); xs=(azs-AZ0)*PX; amin=-0.8
H=407  # jak poprzednia wersja (układ sceny na głównej liczy na 3200×407)
def y(a): return H-(a-amin)*PX
EPS=0.3  # tolerancja uproszczenia łamanych w px (SVG ma 3200 px szerokości)
def rdp(pts,eps=EPS):
    if len(pts)<3: return pts
    (x0,y0),(x1,y1)=pts[0],pts[-1]; dx,dy=x1-x0,y1-y0; n=math.hypot(dx,dy) or 1e-9
    dm,im=0,0
    for i in range(1,len(pts)-1):
        dd=abs(dy*(pts[i][0]-x0)-dx*(pts[i][1]-y0))/n
        if dd>dm: dm,im=dd,i
    if dm<=eps: return [pts[0],pts[-1]]
    return rdp(pts[:im+1],eps)[:-1]+rdp(pts[im:],eps)
def fmt(pts): return " ".join(f"{x:.1f}".rstrip('0').rstrip('.')+","+f"{yy:.1f}".rstrip('0').rstrip('.') for x,yy in pts)
def path(row,xs_=None,mask=None):
    pts=[(x,y(a)) for x,a in zip(xs,np.maximum(row,amin))]
    if mask is not None: pts=[q for q,m in zip(pts,mask) if m]
    pts=rdp(pts)
    return f"M{fmt([(pts[0][0],H)])} {fmt(pts)} {fmt([(pts[-1][0],H)])}Z" if mask is not None else f"M0,{H} {fmt(pts)} {W},{H}Z"
def poly(pts): return "M"+fmt(rdp(pts))

def svg(variant):
    st=('.niebo{fill:var(--color-tlo)}.fill-far{fill:var(--color-tlo-2);stroke:var(--color-atrament);stroke-width:1.1;stroke-linejoin:round;vector-effect:non-scaling-stroke}'
        '.fill-giewont{fill:var(--color-tlo-2);stroke:none}.line-giewont{fill:none;stroke:var(--color-atrament);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}'
        '.grzbiet-g{stroke-width:.8;opacity:.6}.fill-mid{fill:var(--color-poziomica);opacity:.35}.fill-near{fill:var(--color-poziomica);opacity:.7}'
        '.line{stroke:var(--color-atrament);stroke-width:1;fill:none;vector-effect:non-scaling-stroke}.accent{fill:var(--color-bursztyn)}'
        '.grzbiet{stroke:var(--color-atrament);fill:none;stroke-linejoin:round;stroke-linecap:round;vector-effect:non-scaling-stroke}'
        '.grzbiet-t{stroke-width:.8;opacity:.55}.grzbiet-p{stroke-width:.7;opacity:.3}'
        '.peak-name{font:700 22px var(--font-tabliczka,Georgia,serif);letter-spacing:.1em;text-transform:uppercase;fill:var(--color-atrament)}'
        '.peak-h{font:500 18px var(--font-ui,sans-serif);letter-spacing:.06em;fill:var(--color-wyciszony)}')
    L=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="g2-title" class="mo-ilustracja mo-panorama-svg">',
       '<title id="g2-title">Panorama Tatr z Matygowej Osady: dziesięć szczytów, od których domy i apartamenty biorą nazwy</title>',
       f'<style>{st}</style>', f'<rect id="niebo" class="niebo" width="{W}" height="{H}"/>',
       f'<g id="warstwa-tatry"><path class="fill-far" d="{path(far_d)}"/>']
    if variant=='B':
        cover_t=np.maximum(mid_d,near_d)  # Tatry: rysuj tylko nad Podhalem
        cover_f=np.where(gw_on,np.maximum(cover_t,gw_d),cover_t)  # dalsze grzbiety chowają się za Giewontem
        segs_t=[]; segs_g=[]; segs_p=[]
        for pts in lines:
            dist=np.median([p[2] for p in pts]); tatry=dist>=9000; gw=tatry and dist<GW_D[1] and gw_on[pts[len(pts)//2][0]]
            tgt=segs_g if gw else segs_t if tatry else segs_p
            cur=[]
            for kk,a,dd in pts:
                top=gw_d[kk] if gw else far_d[kk] if tatry else mid_d[kk]
                lim=cover_t[kk] if gw else cover_f[kk] if tatry else near_d[kk]
                ok=(a<top-0.04) and (a>lim+0.01)
                if ok: cur.append((xs[kk],y(a)))
                elif cur:
                    if len(cur)>=10: tgt.append(cur)
                    cur=[]
            if len(cur)>=10: tgt.append(cur)
        L.append('<g id="grzbiety-tatry" class="grzbiet grzbiet-t">'+''.join(f'<path d="{poly(s[::2]+[s[-1]])}"/>' for s in segs_t)+'</g>')
        L.append('</g>')
        L.append(f'<g id="warstwa-giewont"><path class="fill-giewont" d="{path(gw_d,mask=gw_on)}"/>'
                 f'<g class="grzbiet grzbiet-g">'+''.join(f'<path d="{poly(s[::2]+[s[-1]])}"/>' for s in segs_g)+'</g>'
                 f'<path class="line-giewont" d="{poly([(x,y(a)) for x,a,m in zip(xs,gw_d,gw_on&(gw_d>cover_t+0.05)) if m])}"/></g>')
        L.append(f'<g id="warstwa-podhale"><path class="fill-mid" d="{path(mid_d)}"/></g>')
    else:
        L.append('</g>'); L.append(f'<g id="warstwa-podhale"><path class="fill-mid" d="{path(mid_d)}"/></g>')
    L.append(f'<g id="warstwa-osada"><path class="fill-near" d="{path(near_d)}"/></g>')
    L.append('<g id="szczyty">')
    boxes=[]
    def free(x0,x1,y0,y1,lx,ly1):
        for b0,b1,c0,c1 in boxes:
            if x0<b1+12 and x1>b0-12 and y0<c1+6 and y1>c0-6: return False
            if b0-6<lx<b1+6 and c1>y1 and c0<ly1: return False
        return True
    vis=sorted(peaks,key=lambda q:q['k']); groups=[]
    for p in vis:
        if groups and xs[p['k']]-xs[groups[-1][-1]['k']]<120: groups[-1].append(p)
        else: groups.append([p])
    for g in sorted(groups,key=lambda g:-max(p['height'] for p in g)):
        halfs=[len(p['name'])*9.5+8 for p in g]; total=sum(2*h for h in halfs)+32*(len(g)-1)
        pxs=[xs[p['k']] for p in g]; pys=[y((gw_d if p['slug']=='giewont' else far_d)[p['k']]) for p in g]
        x0=max(8,min(W-8-total,sum(pxs)/len(pxs)-total/2)); top=min(pys)-130-(40 if len(g)>1 else 0)
        while top>20 and not free(x0,x0+total,top,top+52,pxs[0],max(pys)): top-=6
        boxes.append((x0,x0+total,top,top+52)); cx=x0
        for p,half,x,yy in zip(g,halfs,pxs,pys):
            r,lx=top-yy,cx+half-x; knee=f"0,{r+100:.0f} " if len(g)>1 else ""
            L.append(f'<g id="p-{p["slug"]}" data-height="{p["height"]}" data-azimuth="{p["az"]}" data-distance-km="{p["dist_km"]}" transform="translate({x:.1f} {yy:.1f})">'
                     f'<polyline class="line" points="0,-14 {knee}{lx:.0f},{r+60:.0f}"/><circle class="accent" r="6"/>'
                     f'<text class="peak-name" x="{lx:.0f}" y="{r+22:.0f}" text-anchor="middle">{p["name"]}</text><text class="peak-h" x="{lx:.0f}" y="{r+46:.0f}" text-anchor="middle">{p["height"]} m</text></g>')
            cx+=2*half+32
    L.append('</g></svg>')
    return z_zapasem("\n".join(L))
for v in 'AB': open(f'G2_panorama_wariant_{v}.svg','w').write(svg(v))
json.dump({"site":SITE,"eyeM":round(H0),"azimuthFrom":AZ0,"azimuthTo":AZ1,"verticalExaggeration":1.0,"source":"grań ze zrzutów PeakFindera dopasowana do DEM Terrarium z13",
  "peaks":[{k:v for k,v in p.items() if k!='k'} for p in peaks]},open('G2_panorama.json','w'),ensure_ascii=False,indent=1)
print('H',H, [ (p['slug'],p['az']) for p in peaks])
