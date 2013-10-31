#pragma import: ./common

uniform float uOffset;

vec3 getColor() {
  return vec3(1.0);
}

void main() {
  //
  // Animating the shark in the shader, just making
  // it swim along a sine wave :)
  //
  vec3 pos = aPosition + vec3(0.5, 0.0, 0.0) * sin((t + uOffset) * 0.3 + aPosition.z * 0.5);
  gl_Position = uProjection * uView * uModel * vec4(pos, 1.0);

  vLightWeighting = getLighting(getNormal()
    , (uModel * vec4(pos, 1.0)).xyz
  ) * getColor();
}

