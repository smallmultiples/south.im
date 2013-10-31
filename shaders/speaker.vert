#pragma import: ./common

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
  vPosition = aPosition.xyz;
  vNormal = getNormal();
}

