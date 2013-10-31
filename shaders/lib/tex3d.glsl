/**
 * Copright 2011, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  - Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright notice, this
 *    list of conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *  - Neither the name of Google Inc. nor the names of its contributors may be used
 *    to endorse or promote products derived from this software without specific
 *    prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
vec4 tex3d(sampler2D tex, vec3 texCoord, float size) {
  float sliceSize = 1.0 / size;                         // space of 1 slice
  float slicePixelSize = sliceSize / size;              // space of 1 pixel
  float sliceInnerSize = slicePixelSize * (size - 1.0); // space of size pixels
  float zSlice0 = min(floor(texCoord.z * size), size - 1.0);
  float zSlice1 = min(zSlice0 + 1.0, size - 1.0);
  float xOffset = slicePixelSize * 0.5 + texCoord.x * sliceInnerSize;
  float s0 = xOffset + (zSlice0 * sliceSize);
  float s1 = xOffset + (zSlice1 * sliceSize);
  vec4 slice0Color = texture2D(tex, vec2(s0, texCoord.y));
  vec4 slice1Color = texture2D(tex, vec2(s1, texCoord.y));
  float zSize = texCoord.z * size;
  float zOffset = mod(zSize, 1.0);
  return mix(slice0Color, slice1Color, zOffset);
}

#pragma glslify: export(tex3d)
