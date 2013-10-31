#pragma import: ./common

uniform vec3 uTreeStumpColor;
uniform vec3 uTreeColor;
uniform float uTreePulse;

attribute float aStump;
attribute vec3 aCentroid;
attribute vec3 aCenter;

vec3 getColor() {
  return aStump < 0.5 ? uTreeColor : uTreeStumpColor;
}

vec3 burst(float Z) {
  return mix(aPosition + aNormal * Z * 0.1, aCentroid - aNormal * Z * 0.1, Z);
}

void main() {
  float Z = (sin(t * 0.25) + 1.0) * 0.5;
  vec3 pos = aStump < 0.5 ? mix(aCenter, aPosition, mix(1.0, Z * 0.5 + 1.0, uTreePulse)) : aPosition;
  gl_Position = uProjection * uView * uModel * vec4(pos, 1.0);

  vLightWeighting = getLighting(getNormal()
    , (uModel * vec4(aCentroid, 1.0)).xyz
  ) * getColor();
}

