import sys
N=96; P=24; S=4; H=P//2  # cells, lattice period, px per cell
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
# --- motifs (own designs) ---
PARZ=["..XXX.XXX..",
      ".X...X...X.",
      "X..X...X..X",
      "X.X.X.X.X.X",
      "X..X...X..X",
      ".X...X...X.",
      "..X.....X..",
      "...X...X...",
      "....X.X....",
      ".....X....."]
SWIERK=['....X....','...XXX...','....X....','..XXXXX..','....X....','.XXXXXXX.','....X....','XXXXXXXXX','....X....','...XXX...'];_=["...X...","..XXX..","...X...",".XXXXX.","...X...","XXXXXXX","...X...","..XXX.."]
SZCZYT=["...X.......","..X.X...X..",".X...X.X.X.","X.....X...X"]
def gwiazda(cx,cy):           # rozeta: pelny srodek, pierscien, promienie osiowe z kropka
    ring(cx,cy,2,True); ring(cx,cy,5)
    for k in (7,8,9,11,14):
        for dx,dy in ((k,0),(-k,0),(0,k),(0,-k)): put(cx+dx,cy+dy)
    for dx,dy in ((4,4),(-4,4),(4,-4),(-4,-4)): put(cx+dx,cy+dy)
def kropki(cx,cy):
    ring(cx,cy,1)
    for dx,dy in ((5,0),(-5,0),(0,5),(0,-5)): put(cx+dx,cy+dy)
def podwojny(cx,cy): ring(cx,cy,6); ring(cx,cy,2)
def katy(cx,cy):              # zagiete narozniki (haczyki) w czterech kierunkach
    for sx,sy in ((1,1),(-1,1),(1,-1),(-1,-1)):
        put(cx+5*sx,cy+5*sy); put(cx+6*sx,cy+5*sy); put(cx+5*sx,cy+6*sy)
M={'P':lambda x,y:bmp(x,y,PARZ),'S':lambda x,y:bmp(x,y,SWIERK),'T':lambda x,y:bmp(x,y,SZCZYT),
   'K':kropki,'D':podwojny,'H':katy,'R':lambda x,y:ring(x,y,2),'.':lambda x,y:None,'G':gwiazda}
# layout over 8x8 grid of 8-cell points; (p+q) odd = maly romb, even = wezel
SMALL={ (1,0):'R',(3,0):'.',(5,0):'H',(7,0):'K',
        (0,1):'.',(2,1):'P',(4,1):'.',(6,1):'.',
        (1,2):'D',(3,2):'.',(5,2):'.',(7,2):'R',
        (0,3):'K',(2,3):'.',(4,3):'.',(6,3):'S',
        (1,4):'.',(3,4):'H',(5,4):'R',(7,4):'.',
        (0,5):'.',(2,5):'.',(4,5):'P',(6,5):'.',
        (1,6):'S',(3,6):'K',(5,6):'.',(7,6):'D',
        (0,7):'H',(2,7):'.',(4,7):'.',(6,7):'K'}
BIG={(4,2):'G',(0,6):'.'}   # wezly zamienione w duze romby (2x2) – srodek motywu
def inbig(x,y):
    for (p,q) in BIG:
        cx,cy=p*H,q*H
        dx=min((x-cx)%N,(cx-x)%N); dy=min((y-cy)%N,(cy-y)%N)
        if dx+dy<P: return True
    return False
for x in range(N):
    for y in range(N):
        if ((x+y)%P==0 or (x-y)%P==0) and not inbig(x,y): put(x,y)
for (p,q),m in SMALL.items():
    if not inbig(p*H,q*H): M[m](p*H,q*H)
for (p,q),m in BIG.items():
    M[m](p*H,q*H)
    if m=='G': ring(p*H,q*H,17)
# node ornaments: short crossbars at some free nodes
for p in range(8):
    for q in range(8):
        if (p+q)%2==0 and (p,q) not in BIG and not inbig(p*H+0,q*H+0):
            for d in (3,):
                pass
            if (p*3+q)%8==2: ring(p*H,q*H,1,True)
            if (p*3+q)%4==0:
                put(p*H+d+1,q*H-0); put(p*H-d-1,q*H); put(p*H,q*H+d+1); put(p*H,q*H-d-1)
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
svg('#1c2321','#f1f3f2',1,'desen-kontrast.svg')
svg('#1c2321',None,0.07,'desen-subtelny.svg')
svg('#ecede8',None,0.06,'desen-subtelny-noc.svg')
print(len(g))
