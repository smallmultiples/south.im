/**
 * This file defines a common "base" point
 * from which all of the other shaders are built
 * on top of.
 *
 * It includes functionality that's always needed,
 * i.e. bootstrap for lighting and fog calculations.
 */
precision highp float;

uniform float t;

/**
 * Basic Projection
 */
uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

/**
 * Lighting Variables
 */
uniform vec4 uSkyColor;
uniform float uEggBrightness;

uniform vec3 uAmbientLight;

uniform vec3 uDLightDir_0;
uniform vec3 uDLightDir_1;
uniform vec3 uDLightCol_0;
uniform vec3 uDLightCol_1;

uniform vec3 uPLightPos_0;
uniform vec3 uPLightPos_1;
uniform vec3 uPLightCol_0;
uniform vec3 uPLightCol_1;

varying vec3 vLightWeighting;

/**
 * Attributes
 */
#ifdef VERTEX_SHADER
  attribute vec3 aPosition;
  attribute vec3 aNormal;
#endif

/**
 * Constants
 */
const vec4 COLOR_WHITE = vec4(1.0);
const vec4 COLOR_BLACK = vec4(0.0, 0.0, 0.0, 1.0);
const vec4 COLOR_RED = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 COLOR_GREEN = vec4(0.0, 1.0, 0.0, 1.0);
const vec4 COLOR_BLUE = vec4(0.0, 0.0, 1.0, 1.0);

#define FOG_COLOR uSkyColor

/**
 * Imports/requires
 */
#pragma import: ./includes/lighting

#ifdef FRAGMENT_SHADER
#pragma import: ./includes/fog
#endif

#ifdef VERTEX_SHADER
#pragma import: ./includes/normal
#endif

