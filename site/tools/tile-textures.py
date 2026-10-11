"""Crops each generated texture square, makes it tileable (offset + feathered blend) and writes
public/textures/<name>.jpg at 1024 and <name>-512.jpg for the lite profile."""
import numpy as np
from PIL import Image, ImageFilter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'art/textures/raw'; OUT=ROOT/'public/textures'; OUT.mkdir(parents=True,exist_ok=True)
def tileable(img,feather=.32):
    a=np.asarray(img).astype(np.float32);h,w=a.shape[:2]
    off=np.roll(np.roll(a,h//2,0),w//2,1)
    y,x=np.mgrid[0:h,0:w];dx=np.abs(x-(w-1)/2)/((w-1)/2);dy=np.abs(y-(h-1)/2)/((h-1)/2)
    d=np.maximum(dx,dy);m=np.clip((d-(1-feather))/feather,0,1);m=m*m*(3-2*m)
    return Image.fromarray((a*(1-m[...,None])+off*m[...,None]).clip(0,255).astype(np.uint8))
for p in sorted(RAW.glob('*.png')):
    im=Image.open(p).convert('RGB');w,h=im.size;s=min(w,h)
    im=im.crop(((w-s)//2,(h-s)//2,(w-s)//2+s,(h-s)//2+s)).resize((1024,1024),Image.LANCZOS)
    if p.stem!='solar':im=tileable(im)
    im.save(OUT/f'{p.stem}.jpg',quality=88);im.resize((512,512),Image.LANCZOS).save(OUT/f'{p.stem}-512.jpg',quality=86)
    print(p.stem,'ok')
