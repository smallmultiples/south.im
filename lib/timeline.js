/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var EventEmitter = require('events').EventEmitter
var inherits = require('inherits')
var talkie = require('talkie')

module.exports = Timeline

/**
 * Edit this area to add parameter sequences
 * between time frames (in milliseconds)
 *
 * Current parameters:
 *
 * - 'fov': Field of view
 * - 'sky color': Sky color in RGB
 * - 'directional color 1': Sun lighting color 1 in RGB
 * - 'directional color 2': Sun lighting color 2 in RGB
 * - 'directional dir 1': Sun lighting direction 1 as a normal vector
 * - 'directional dir 2': Sun lighting direction 2 as a normal vector
 * - 'egg brightness': brightness of the egg (and light emission)
 *
 * See 'lib/sequences/camera-test.js' for an example sequence
 * you can use.
 */
Timeline.prototype.define = function(shell, params, time) {
  require('./sequences/camera-test')(shell, params, time)(0, 30000)
  require('./sequences/logos')(shell, params, time)()
}

function Timeline(shell) {
  if (!(this instanceof Timeline)) return new Timeline(shell)
  EventEmitter.call(this)

  this.define(
      this.shell = shell
    , this.shell.params.curr
    , this.times = talkie()
  )

  this.ui = require('./timeline-ui')(this)
}
