# v2: wiekszy raport (192x192 kratek), nieregularny uklad motywow, bez serca
import random, math
N=192; P=24; H=P//2; S=4
R=random.Random(2027)
g=set()
def put(x,y): g.add((x%N,y%N))
def bmp(cx,cy,rows):
    h=len(rows); w=len(rows[0])
    for j,r in enumerate(rows):
        for i,c in enumerate(r):
            if c=='X': put(cx-w//2+i, cy-h//2+j)
def ring(cx,cy,r,filled=False):
    for dx in range(-r,r+1):
        for dy in range(-r,r+1):
            d=abs(dx)+abs(dy)
            if d==r or (filled and d<r): put(cx+dx,cy+dy)
SWIERK=['....X....','...XXX...','....X....','..XXXXX..','....X....','.XXXXXXX.','....X....','XXXXXXXXX','....X....','...XXX...']
def gwiazda(cx,cy,big=False):
    ring(cx,cy,2,True); ring(cx,cy,5)
    for k in ((7,8,9,11,14) if big else (7,8,10)):
        for dx,dy in ((k,0),(-k,0),(0,k),(0,-k)): put(cx+dx,cy+dy)
    for dx,dy in ((4,4),(-4,4),(4,-4),(-4,-4)): put(cx+dx,cy+dy)
def kropki(cx,cy):
    ring(cx,cy,1)
    for dx,dy in ((5,0),(-5,0),(0,5),(0,-5)): put(cx+dx,cy+dy)
def podwojny(cx,cy): ring(cx,cy,6); ring(cx,cy,2)
def romb_pelny(cx,cy):      # nowy: pelny romb w obrysie schodkowym (zamiast serca)
    ring(cx,cy,1,True); ring(cx,cy,4)
    for dx,dy in ((6,0),(-6,0),(0,6),(0,-6)): put(cx+dx,cy+dy)
def romb_krzyz(cx,cy):      # obrys rombu przeciety krzyzem osiowym
    ring(cx,cy,4)
    for k in range(-6,7):
        if abs(k)!=4 and k!=0: put(cx+k,cy); put(cx,cy+k)
    put(cx,cy)
def katy(cx,cy):
    for sx,sy in ((1,1),(-1,1),(1,-1),(-1,-1)):
        put(cx+5*sx,cy+5*sy); put(cx+6*sx,cy+5*sy); put(cx+5*sx,cy+6*sy)
def katy2(cx,cy):           # haczyki tylko na dwoch narozach + kropka
    sx=R.choice((1,-1))
    for s in (1,-1):
        put(cx+5*sx*s,cy+5*s); put(cx+6*sx*s,cy+5*s); put(cx+5*sx*s,cy+6*s)
    put(cx,cy)
def schodki(cx,cy):         # dwa koncentryczne, maly pelny w srodku
    ring(cx,cy,7); ring(cx,cy,4); ring(cx,cy,0,True)
def podzial(cx,cy):         # romb podzielony na 4 mniejsze, w czesci kropki/pierscienie
    for k in range(-6,7):
        put(cx+k,cy+k); put(cx+k,cy-k)
    for sx,sy in ((6,0),(-6,0),(0,6),(0,-6)):
        c=R.random()
        if c<0.35: put(cx+sx,cy+sy)
        elif c<0.6: ring(cx+sx,cy+sy,1)
M={'Q':podzial,'S':lambda x,y:bmp(x,y,SWIERK),'K':kropki,'D':podwojny,'H':katy,'h':katy2,
   'R':lambda x,y:ring(x,y,2),'r':lambda x,y:ring(x,y,3),'F':romb_pelny,'X':romb_krzyz,
   'G':gwiazda,'Z':schodki,'.':lambda x,y:None}
G=N//H  # 16 punktow siatki
def tor(a,b):  # odleglosc L1 na torusie
    dx=min((a[0]-b[0])%N,(b[0]-a[0])%N); dy=min((a[1]-b[1])%N,(b[1]-a[1])%N); return dx+dy
# gestosc: bezszwowa, niskoczestotliwosciowa - pasma gesto/rzadko
def dens(x,y):
    t=2*math.pi/N
    return 0.5+0.28*math.sin(t*(x+y)+0.7)+0.22*math.sin(t*(2*x-y)+2.1)
# duze romby: wylosowane wezly, bez nakladania
BIG=[]
nodes=[(p,q) for p in range(G) for q in range(G) if (p+q)%2==0]
R.shuffle(nodes)
for p,q in nodes:
    c=(p*H,q*H)
    if all(tor(c,(b[0]*H,b[1]*H))>=3*P for b,_ in BIG): BIG.append(((p,q),R.choice('GG..Z')))
    if len(BIG)>=6: break
def inbig(x,y,margin=0):
    return any(tor((x,y),(p*H,q*H))<P+margin for (p,q),_ in BIG)
for x in range(N):
    for y in range(N):
        if ((x+y)%P==0 or (x-y)%P==0) and not inbig(x,y): put(x,y)
for (p,q),m in BIG:
    cx,cy=p*H,q*H
    if m=='G': gwiazda(cx,cy,True); ring(cx,cy,17)
    elif m=='Z': ring(cx,cy,17); ring(cx,cy,11); ring(cx,cy,5); ring(cx,cy,1,True)
    # '.' = pusty duzy romb
POOL='RRrKKDFFFXXHhSZGQQQ'
for p in range(G):
    for q in range(G):
        if (p+q)%2==1 and not inbig(p*H,q*H):
            if R.random()<dens(p*H,q*H)*1.05: M[R.choice(POOL)](p*H,q*H)
        if (p+q)%2==0 and not inbig(p*H,q*H,1):
            u=R.random()*(0.4+dens(p*H,q*H))
            if u>0.95: ring(p*H,q*H,1,True)
            elif u>0.75:
                for d in (4,):
                    put(p*H+d,q*H); put(p*H-d,q*H); put(p*H,q*H+d); put(p*H,q*H-d)
def svg(fg,bg,op=1.0,name='x'):
    d=[]
    for y in range(N):
        x=0
        while x<N:
            if (x,y) in g:
                s=x
                while x<N and (x,y) in g: x+=1
                d.append(f"M{s*S} {y*S}h{(x-s)*S}v{S}h-{(x-s)*S}z")
            else: x+=1
    W=N*S
    bgr=f'<rect width="{W}" height="{W}" fill="{bg}"/>' if bg else ''
    o=f' fill-opacity="{op}"' if op<1 else ''
    open(name,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{W}" viewBox="0 0 {W} {W}">{bgr}<path fill="{fg}"{o} d="{"".join(d)}"/></svg>')
svg('#1c2321','#f1f3f2',1,'desen-v2-kontrast.svg')
svg('#1c2321',None,0.07,'desen-v2-subtelny.svg')
svg('#ecede8',None,0.06,'desen-v2-subtelny-noc.svg')
print(len(g),[b for b in BIG])
