#pragma import: ./common
#pragma glslify: noise3 = require(../node_modules/glsl-noise/simplex/3d)

uniform vec3 uWaterColor;

vec3 getColor() {
  return vec3(0.0, 0.0, 1.0);
}

void main() {
  //
  // We're using perlin noise here to create small waves
  // that move over time. The more natural alternative would
  // be to use sine waves but this is less uniform.
  //
  float noise = noise3(aPosition * 30.0 + t * 0.05) * 0.001;
  vec3 pos = aPosition + vec3(noise*5.0, noise, noise*5.0);
  gl_Position = uProjection * uView * uModel * vec4(pos, 1.0);

  //
  // To make it stand out from the terrain (and given that
  // it's also emitting light), the water doesn't have lighting
  // applied to it.
  //
  vLightWeighting = uWaterColor * mix(
      vec3(1.0)
    , vec3(0.8)
    , max(0.0, dot(getNormal() + noise, vec3(0.0, 1.0, 0.0)))
  );
}

