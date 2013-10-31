precision mediump float;

uniform sampler2D frame;
uniform sampler2D depth;
uniform vec2 frameSize;

uniform sampler2D uLUT1;
uniform sampler2D uLUT2;
uniform float uLUT_mix;

uniform float t;
uniform float r;
varying vec2 uv;

uniform float uMosaic;
uniform float uNoiseAmount;
uniform float uHazeAmount;
uniform float uRGBShift;
uniform vec4 uVignette;

#define NOISE_SCALE 0.41
#define NOISE_RATE 100.0
#define NOISE_OFFSET vec2(8.92492024, 13.342824)

#pragma glslify: noise = require(../node_modules/glsl-noise/simplex/2d)
#pragma glslify: vignette = require(./lib/vignette)
#pragma glslify: tex3D = require(./lib/tex3d)

const vec3 oneThird = vec3(1.0 / 3.0);

const float hxAmplitude = 0.045;
const float hxFrequency = 44.0;
const float hxSpeed = 0.6;

const float hyAmplitude = 0.005;
const float hyFrequency = 9.1;
const float hySpeed = 0.15;

void main() {

#ifdef USE_HAZE
  //
  // Creates the heat ripple distortion effect seen in
  // the desert/dusk scene.
  //
  // This is achieved by moving the pixel's sample
  // coordinate by a pair of sine waves. The strength
  // of the wave is determined by the pixel's distance
  // from the camera, which is retrieved from the depth
  // buffer.
  //
  float cDepth = max(0.0, (texture2D(depth, uv).x - 0.95));
  vec2 tuv = uv + uHazeAmount * vec2(
      cDepth * hxAmplitude * sin(hxFrequency * uv.x + hxSpeed * t)
    , cDepth * hyAmplitude * sin(hyFrequency * uv.y + hySpeed * t)
  );
#else
  vec2 tuv = uv;
#endif

#ifdef USE_MOSAIC
  //
  // A screen pixellation effect, which didn't make it
  // into the final titles. It's simply a matter of
  // rounding the sampled pixel coordinates.
  //
  if (uMosaic > 1.0) {
    vec2 dm = vec2(uMosaic) / frameSize;
    tuv = dm * ceil(tuv / dm);
  }
#endif

#ifdef USE_RGB_SHIFT
  //
  // Shifts the red channel of the screen to the left,
  // and the green channel to the right. The end result
  // is a pseudo-3D-for-glasses look, and it's used in
  // the very beginning and a tiny bit in the desert scene.
  //
  vec2 shiftDistance = vec2(0.0025, 0.0015) * uRGBShift;
  float cRed = texture2D(frame, tuv + shiftDistance).r;
  float cBlue = texture2D(frame, tuv - shiftDistance).b;
  float cGreen = texture2D(frame, tuv).g;
  vec4 cColor = vec4(cRed, cGreen, cBlue, 1.0);
#else
  //
  // It's at this point that the pixel color itself
  // is sampled, now that we've done all the required
  // coordinate mangling :) If the RGB shift is enabled
  // then it's done there instead.
  //
  vec4 cColor = texture2D(frame, tuv);
#endif

#ifdef USE_NOISE
  //
  // Noise/grain, which is always nice in moderation.
  // Placing noise before color grading also goes a
  // long way when it comes to reducing banding issues
  // with only a 33*33*33 color table.
  //
  cColor += (1.0 - dot(cColor.rgb, oneThird)) * uNoiseAmount * (
    noise((gl_FragCoord.xy + NOISE_OFFSET) * NOISE_SCALE + r * NOISE_RATE)
  );
#endif

#ifdef USE_GRADING
  //
  // Color grading - often goes overlooked but definitely
  // worth it. Uses two 33*33*33 color lookup tables (LUTs)
  // to map the original color to two resulting colors. The
  // results are then blended together depending on the
  // `uLUT_mix` variable - making it possible to interpolate
  // between different palettes.
  //
  // We could have reduced banding issues by manually
  // interpolating colors in the red and green channels
  // as well, but time was short. See tex3d.glsl for
  // the code needed to emulate 3D textures.
  //
  vec3 cSampler = clamp(cColor.rgb, vec3(0.0), vec3(1.0));
  vec4 cMapped1 = tex3D(uLUT1, cSampler, 33.0);
  vec4 cMapped2 = tex3D(uLUT2, cSampler, 33.0);
  cColor = mix(cMapped1, cMapped2, clamp(uLUT_mix, 0.0, 1.0));
#endif

#ifdef USE_VIGNETTE
  //
  // Much like noise, the vignette is a traditional
  // cinematic/photographic effect which is always worth including.
  // It also helps mask some of the banding issues caused by
  // color grading, though less so than noise.
  //
  cColor = vec4(vignette(cColor.rgb, uVignette.rgb, uv.xy, uVignette.a), 1.0);
#endif

  gl_FragColor = cColor;
}
