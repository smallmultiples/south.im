vec3 directional_light(vec3 color, vec3 dir, vec3 normal) {
  return max(0.0, dot(normal, normalize(dir))) * color;
}

#pragma glslify: export(directional_light)
