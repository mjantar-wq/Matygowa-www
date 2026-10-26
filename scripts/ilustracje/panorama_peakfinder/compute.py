import numpy as np, math, json
from dem_hi import elev, SITE
R=6371000.0
EYE=6.0
H0=float(elev(*SITE))+EYE
AZ0,AZ1,STEP=124.0,240.0,0.02
azs=np.arange(AZ0,AZ1+1e-9,STEP)
d=np.concatenate([np.arange(80,2500,10),np.arange(2500,9000,20),np.arange(9000,45000,25)]).astype(float)
la0,lo0=map(math.radians,SITE)
ang=np.empty((len(azs),len(d)),dtype=np.float32)
for k,az in enumerate(azs):
    a=math.radians(az); dr=d/R
    la=np.arcsin(math.sin(la0)*np.cos(dr)+math.cos(la0)*np.sin(dr)*math.cos(a))
    lo=lo0+np.arctan2(math.sin(a)*np.sin(dr)*math.cos(la0),np.cos(dr)-math.sin(la0)*np.sin(la))
    h=elev(np.degrees(la),np.degrees(lo))
    ang[k]=np.degrees(np.arctan2(h-H0-d*d/(2*R)*0.87,d))
np.savez_compressed('ang.npz',ang=ang,azs=azs,d=d,H0=H0)
print('H0',H0, ang.shape)
