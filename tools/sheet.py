import sys,glob
from PIL import Image
pat,out,cols,w=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
fs=sorted(glob.glob(pat)); ims=[Image.open(f) for f in fs]
h=int(ims[0].height*w/ims[0].width); rows=(len(ims)+cols-1)//cols
s=Image.new('RGB',(cols*w,rows*h),'white')
for i,im in enumerate(ims): s.paste(im.resize((w,h)),((i%cols)*w,(i//cols)*h))
s.save(out,quality=80)
