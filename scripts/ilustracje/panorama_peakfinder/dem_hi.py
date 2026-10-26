"""Model terenu w wyższej rozdzielczości: mozaika kafli Terrarium Z=13 jako jedna tablica."""
import math, pathlib, urllib.request, numpy as np
from PIL import Image
Z=13
CACHE=pathlib.Path("/tmp/terrarium"); CACHE.mkdir(exist_ok=True)
SITE=(49.34471, 20.05793)
def txy(lat,lon,z=Z):
    n=2**z; return (lon+180)/360*n, (1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n
def tile(z,x,y):
    f=CACHE/f"{z}_{x}_{y}.png"
    if not f.exists(): f.write_bytes(urllib.request.urlopen(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",timeout=60).read())
    a=np.asarray(Image.open(f).convert("RGB")).astype(np.float64)
    return a[...,0]*256+a[...,1]+a[...,2]/256-32768
# obszar: od 49.05 do 49.40 N, 19.70 do 20.40 E
x0,y0=map(int,txy(49.40,19.70)); x1,y1=map(int,txy(49.05,20.40))
MOS=np.vstack([np.hstack([tile(Z,x,y) for x in range(x0,x1+1)]) for y in range(y0,y1+1)])
OX,OY=x0*256,y0*256
def elev(lat,lon):
    lat=np.asarray(lat); lon=np.asarray(lon)
    n=2**Z
    px=(lon+180)/360*n*256-OX
    py=(1-np.arcsinh(np.tan(np.radians(lat)))/np.pi)/2*n*256-OY
    j=np.clip(np.floor(px).astype(int),0,MOS.shape[1]-2); i=np.clip(np.floor(py).astype(int),0,MOS.shape[0]-2)
    fx=np.clip(px-j,0,1); fy=np.clip(py-i,0,1)
    return MOS[i,j]*(1-fx)*(1-fy)+MOS[i,j+1]*fx*(1-fy)+MOS[i+1,j]*(1-fx)*fy+MOS[i+1,j+1]*fx*fy
