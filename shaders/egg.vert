// Sorry for all the magic numbers!

#pragma import: ./common
#pragma glslify: noise = require(../node_modules/glsl-noise/simplex/3d)

uniform vec3 uEggColor;
uniform float uAmplitude;


void main() {
  // Adds a small amount of noise to the egg's vertices.
  vec3 pos = aPosition + noise(aPosition * 23.248 + vec3(t * 0.007)) * (0.002 + uAmplitude * 0.008);
  gl_Position = uProjection * uView * uModel * vec4(pos, 1.0);

  // This mixes the final egg shading with a desaturated egg color light
  // and a white light - both directional and virtual.
  vLightWeighting = vec3(mix(uEggColor, vec3(1.0), 0.8)) * max(0.0, dot(getNormal(), normalize(vec3(0.0, 0.0, 1.0))))
    + (
      max(vec3(0.0), vec3(uEggColor * uEggBrightness * 0.6))
    + min(vec3(0.0), vec3(uEggBrightness * 0.6))
  ) * (0.25 + max(0.0, dot(getNormal(), normalize(vec3(0.0, 0.0, -1.0)))) * 0.75);
}

