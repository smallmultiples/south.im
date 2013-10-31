# WDS 2013 Opening Titles #

The opening titles for
[Web Direction South 2013](http://webdirections.org/wds13/):
a entirely browser-based animation powered by WebGL,
[browserify](http://browserify.org/) and
[npm](http://npmjs.org/).

Check out the finished product at [run.south.im](http://run.south.im/).

[![Screenshot](http://i.imgur.com/NrXbOIv.jpg)](http://run.south.im/)

## Setup ##

To get the code on your system and install the required dependencies:

``` bash
git clone git@github.com:smallmultiples/wds2013.git
cd wds2013
npm install
```

If you're just looking to get it running locally:

``` bash
npm start
```

Otherwise, you can run `make` to set off the following tasks:

``` bash
# Starts a local development server using beefy
make start
# Builds the production-ready assets
make build
# Removes any generated assets
make clean
# Visualise file size consumption using disc
make disc
open dist/disc.html
# Visualise the project's dependency tree using colony
make colony
open dist/colony/index.html
```

## Related Code ##

If you're wondering about specific bits of functionality, most of the final
code is actually contained in modules which are freely available on
[npm](http://npmjs.org/). These ones might be of particular interest:

* [browserify](http://browserify.org): handles building the final script, letting us use CommonJS modules from [npm](http://npmjs.org) and elsewhere.
* [glslify](http://github.com/chrisdickinson/glslify): a browserify-like bundler for GLSL shaders.
* [ndarray](http://github.com/mikolalysenko/ndarray): a very versatile/performant module for handling multidimensional arrays with a wealth of compatible modules.
* [level.js](http://github.com/maxogden/level.js): a [level*](http://github.com/level) API wrapper for IndexedDB. Used in combination with [continuous-storage](http://github.com/hughsk/continuous-storage) to cache generated terrain.
* [webworkify](http://github.com/substack/webworkify): Used in combination with [worker-wrap](http://github.com/hughsk/worker-wrap) for generating terrain meshes in a separate thread.
* [perlin](https://github.com/maxogden/js.perlin): a Javascript perlin noise implementation, used to generate the terrain.
* [ndarray-continuous](http://github.com/hughsk/ndarray-continuous): an API for handling dynamic grids of ndarrays, so we can easily load/unload chunks of terrain dynamically.
* [heightmap-mesher](http://github.com/hughsk/heightmap-mesher): takes a heightmap and converts it into 3D triangles.
* [orbit-camera](http://github.com/mikolalysenko/orbit-camera): a simple arcball camera built on top of gl-matrix.
* [talkie](http://github.com/hughsk/talkie): handles queueing events in a timeline such that they can be triggered at certain parts of the song.
* [lut](http://github.com/hughsk/lut): generates generic color tables as a starting point for color grading.
* [gl-matrix](http://glmatrix.net): a very performant JS matrix library.
* [gl-now](http://github.com/mikolalysenko/gl-now): a variant of [game-shell](http://github.com/game-shell) for WebGL demos to handle bootstrapping the 3D context.
* [glsl-point-light](http://github.com/hughsk/glsl-point-light): A reusable point light function for GLSL.
* [glsl-fog](http://github.com/hughsk/glsl-fog): A reusable set of fog functions for GLSL.
* [webgl-noise](https://github.com/ashima/webgl-noise): perlin/simplex/classic noise in GLSL.
* [web-audio-analyser](http://github.com/hughsk/web-audio-analyser): A drop-in module for getting audio analysis data from the Web Audio API.
* [beats](http://github.com/hughsk/beats): naive beat detection.
* [dot-obj](http://github.com/hughsk/dot-obj): A parser for the `.obj` geometry format. Used to include models exported from Blender.

## Authors ##

* [Hugh Kennedy](http://github.com/hughsk): design and development.
* [François Robichet](http://github.com/Calvein): sound and modeling.
* [Jack Zhao](http://github.com/jiak): concept and creative direction.

The song included in the credits is
[Clones](https://soundcloud.com/thomasbarrandon/clones) by
[Thomas Barrandon](http://125bis.bandcamp.com/), you should check out his
other work!

It's also worth taking a look at
[`hackers.txt`](https://github.com/jiak/wds2013/blob/master/hackers.txt)
for a full list of the authors whose modules were used in the project.

## License ##

Unless otherwise specified, all source code is licensed under the MIT license
included [in this repository](http://github.com/jiak/wds2013/blob/master/MIT-LICENSE.md).

Certain project-specific files have been licensed under the
[Mozilla Public License](http://www.mozilla.org/MPL/2.0/index.txt). These files are stated as such explicitly at the beginning of the file in question.

With the exception of the Web Directions South logo, images and 3D geometry
files are licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US): [![Creative Commons License](http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png)](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US)
