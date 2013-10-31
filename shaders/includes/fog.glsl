#ifdef USE_FOG
#pragma glslify: fog = require(../node_modules/glsl-fog/exp2)

  float fogAmount() {
    return fog(max(0.0, gl_FragCoord.z/gl_FragCoord.w - 1.0), FOG_DENSITY);
  }

#else
  float fogAmount() { return 0.0; }
#endif
