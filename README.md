# The Musical Turk

An Animusic-inspired machine that plays classical music with marbles.

[![Screenshot](http://i.imgur.com/jUGLlQ5.png)](http://ulyssecarion.github.io/turk)

Inspired by the viral Animusic video "Pipe Dream" ([watch it on YouTube](http://www.youtube.com/watch?v=hyCIpKAIFyo)) and [Euphony](https://github.com/qiao/euphony) by Xueqiao Xu ([qiao](https://github.com/qiao)).

Improved by [Mygod](https://mygod.tk)

## Dependencies

* [three.js](https://github.com/mrdoob/three.js)
* [MIDI.js](http://mudcu.be/midi-js)
* [jasmid](https://github.com/gasman/jasmid)
* [jQuery](http://jquery.com)
* [bootstrap](http://twitter.github.com/bootstrap)

A lot of the code and _all_ of the pieces are from [Euphony](https://github.com/qiao/euphony). So you should seriously check that out if haven't done so already.

The TubeGeometry used is by Muhamamd Mobeen Movania. Thanks to Eric Haines and Yann Granjon for recommending that I use a TubeGeometry from Udacity.

Sadly, because it requires high-precision MIDI playing, this demo only works in Chrome. In addition, it requires WebGL and doesn't seem to work on older computers.

Install the missing ones with:

    bower install --save Mygod/mygod-image

If you don't have [Bower](http://bower.io/) yet, you can install that via:

    npm install -g bower
