vec3 getNormal() {
  return normalize(mat3(uModel) * aNormal.xyz);
}
