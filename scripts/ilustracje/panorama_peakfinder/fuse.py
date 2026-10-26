"""Grań z wycinków PeakFindera: ślad czarnej linii horyzontu ze zrzutów, przeliczony na azymut i kąt,
dopasowany do modelu terenu w niskich częstotliwościach (DEM trzyma geometrię, PeakFinder daje drobny rysunek)."""
import numpy as np, json, math
z=np.load('ang.npz'); ang=z['ang']; azs=z['azs']; d=z['d']
sky=ang.max(1)
raw=json.load(open('trace_raw.json'))
F=1693.6; CX=701.5
CENT={2:112,3:134,4:156,5:178,6:200,7:222,8:244}
CYS={2:433,3:422,4:420.5,5:417,6:420.5,7:426,8:433}
def gsmooth(v,sig):
    n=int(sig*3); k=np.exp(-0.5*(np.arange(-n,n+1)/sig)**2); k/=k.sum()
    return np.convolve(np.pad(v,n,mode='edge'),k,mode='valid')
acc=np.zeros_like(sky,dtype=float); wsum=np.zeros_like(acc)
for i,c in CENT.items():
    ys=np.array(raw[str(i)],float); x=np.arange(len(ys)); ok=~np.isnan(ys)
    th=np.arctan((x-CX)/F); az=c+np.degrees(th)
    e=np.degrees(np.arctan((CYS[i]-ys)*np.cos(th)/F))
    # na siatkę azymutów
    m=(azs>=az[ok].min())&(azs<=az[ok].max())
    ev=np.full_like(sky,np.nan,dtype=float); ev[m]=np.interp(azs[m],az[ok],e[ok])
    xv=np.full_like(sky,np.nan,dtype=float); xv[m]=np.interp(azs[m],az,x)
    m&=np.abs(xv-CX)<600
    r=np.where(m,ev-sky,0.0)
    # wolna składowa różnicy (wygładzenie tylko w obrębie zrzutu)
    wm=gsmooth(m.astype(float),40); low=gsmooth(r,40)/np.maximum(wm,1e-6)
    corr=ev-low
    w=np.where(m,np.cos(np.clip((xv-CX)/600,-1,1)*math.pi/2)**2,0)
    acc+=np.nan_to_num(corr)*w; wsum+=w
fused=np.where(wsum>0,acc/np.maximum(wsum,1e-9),sky)
# ostre szczyty: drobna korekta nie może zejść poniżej modelu o więcej niż 0.15° (śmieci w śladzie)
np.save('fused.npy',fused)
print('max |fused-sky|',np.abs(fused-sky).max(), 'rms',np.sqrt(np.mean((fused-sky)**2)))
