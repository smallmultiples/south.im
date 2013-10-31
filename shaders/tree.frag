#pragma import: ./common

void main() {
  gl_FragColor = mix(vec4(vLightWeighting, 1.0), FOG_COLOR, fogAmount());
}
