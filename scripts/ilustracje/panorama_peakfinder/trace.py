import numpy as np, json, math
from PIL import Image
from scipy import ndimage
import os
D=os.environ.get("PEAKFINDER_DIR","peakfinder/")  # zrzuty 01–09.png z folderu „WWW Matygowa/peakfinder” Michała
F=1693.6; CX=701.5
CENT={1:90,2:112,3:134,4:156,5:178,6:200,7:222,8:244,9:266}
out={}
for i,c in CENT.items():
    a=np.asarray(Image.open(D+'%02d.png'%i).convert('L')).astype(int)
    m=a<95; m[:150]=False; m[:, :60]=m[:, :60]; m[780:]=False
    m[60:150,:]=False
    lab,n=ndimage.label(m,structure=np.ones((3,3)))
    sl=ndimage.find_objects(lab)
    widths=[(s[1].stop-s[1].start, k+1) for k,s in enumerate(sl)]
    widths.sort(reverse=True)
    keep=[k for w,k in widths if w>150]
    mm=np.isin(lab,keep)
    ys=np.full(a.shape[1],np.nan)
    for x in range(a.shape[1]):
        col=np.nonzero(mm[:,x])[0]
        if len(col): ys[x]=col[0]
    out[i]=ys.tolist()
    print(i, [w for w,k in widths[:5]], np.nanmin(ys), np.nanmax(ys), np.isnan(ys).sum())
json.dump(out,open('trace_raw.json','w'))
