#pragma import: ./common

//
// Originally the terrain was going to be
// colored differently for each scene, but
// we found we had better results when adjusting
// the lights. We've stuck to the original
// green/brown pastel colors as they make
// the terrain lighting ever slightly more
// contrasted.
//
const vec4 TOP = vec4(0.0, 1.0, 0.0, 1.0);
const vec3 TERRAIN_SIDE = vec3(1.0, 0.8, 0.6);
const vec3 TERRAIN_TOP = vec3(0.8, 1.0, 0.6);

vec3 getColor() {
  float lerper = max(0.0, dot(aNormal.xyz, TOP.xyz));
  return mix(TERRAIN_SIDE, TERRAIN_TOP, pow(lerper, 1.25));
}

//
// The water emits a soft glow onto the terrain which
// is more noticeable in dark environments. Totally
// fake lighting here however it has a nice effect.
//
uniform float uWaterLevel;
uniform vec3  uWaterColor;

vec3 getWaterLight(vec3 norm) {
  return (1.0 - clamp(dot(norm, vec3(0.0, 1.0, 0.0)), 0.0, 1.0))
    * uWaterColor
    * clamp((uWaterLevel - aPosition.y) * 12.5, 0.0, 1.0)
    ;
}

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);

  vec3 norm = getNormal();

  vLightWeighting = getLighting(norm
    , (uModel * vec4(aPosition, 1.0)).xyz
  ) * getColor() + getWaterLight(norm);
}

