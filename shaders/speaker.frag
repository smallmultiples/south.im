#pragma import: ./common

varying vec3 vPosition;
varying vec3 vNormal;

vec3 getColor() {
  return vec3(1.5);
}

void main() {
  //
  // Unlike the trees and terrain, we're doing per-pixel
  // lighting on the speaker names.
  //
  // It's more expensive but important given that they're
  // the objects most susceptible to changes in light
  // caused by the eggs movement.
  //
  vec3 light = getLighting(vNormal
    , (uModel * vec4(vPosition, 1.0)).xyz
  ) * getColor();

  light = mix(light, vec3(1.0), 0.3);
  gl_FragColor = mix(vec4(light, 1.0), FOG_COLOR, fogAmount());
}
