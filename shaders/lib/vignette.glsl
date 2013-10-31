vec3 vignette(vec3 texel, vec3 color, vec2 uv, float scale) {
  uv -= 0.5;
  uv *= scale;
  return mix(texel, color, max(0.0, dot(uv, uv)));
}

#pragma glslify: export(vignette)
