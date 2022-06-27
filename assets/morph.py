import gmic
import sys

gmic.run(sys.argv[1] + '/static.png ' + sys.argv[1] +
             '/static2.png morph 20 ' + sys.argv[1] + '/frames/frame.png')