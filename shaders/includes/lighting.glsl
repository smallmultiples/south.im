/**
 * Can currently use up to 1 point and
 * 2 directional lights simultaneously.
 */
#ifdef USE_LIGHTING
#pragma glslify: point_light = require(glsl-point-light)
#pragma glslify: directional_light = require(./lib/directional)

  const vec3 attenuation = vec3(1.0, 0.5, 15.0);

  vec3 getLighting(vec3 normal, vec3 position) {
    return (
        directional_light(uDLightCol_0, uDLightDir_0, normal)
      + directional_light(uDLightCol_1, uDLightDir_1, normal)
      + point_light(uPLightCol_0, position, uPLightPos_0, normal, attenuation) * 1.5
      + uAmbientLight
    );
  }
#else
  vec3 getLighting(vec3 normal, vec3 position) {
    return vec3(1.0);
  }
#endif
