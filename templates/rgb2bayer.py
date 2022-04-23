import gmic
import sys

if sys.argv[2] == 'mp4':
    gmic.run(sys.argv[1] + '/static.png ' + sys.argv[1] +
             '/static2.png rgb2bayer 0,1 ' + sys.argv[1] + '/frames/frame.png')
elif sys.argv[2] == 'png':
    gmic.run(sys.argv[1] + '/static.png ' + sys.argv[1] +
             '/static2.png rgb2bayer 0,1 ' + sys.argv[1] + '/frames/frame.png')
