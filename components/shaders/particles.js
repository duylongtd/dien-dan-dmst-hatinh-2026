// Custom GLSL for the signature particle field.
// Morphs between 3 position targets (text "HÀ TĨNH" -> sphere -> data-field),
// applies pointer repulsion and a smooth idle drift. Colour varies per
// particle with rare gold sparkles as the single accent.
//
// Point size is expressed in CSS pixels and attenuated by distance; it is
// clamped so no particle can ever balloon into a screen-filling quad (which
// is what makes additive particle fields grind a GPU to a halt).

export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;       // 0..3 (three morph segments, wraps around)
  uniform float uSize;        // base size in CSS px (before distance attenuation)
  uniform float uScale;       // viewport height / 2, in CSS px
  uniform float uPixelRatio;  // renderer pixel ratio
  uniform vec2  uMouse;       // pointer in world XY on the z=0 plane
  uniform float uMouseForce;
  uniform float uScatter;     // 0 idle .. 1 fully scattered (used on load)

  attribute vec3 aPos0;       // target A: text
  attribute vec3 aPos1;       // target B: sphere
  attribute vec3 aPos2;       // target C: data field
  attribute vec3 aColor;
  attribute float aRand;

  varying vec3 vColor;
  varying float vGlow;

  void main(){
    // pick the two targets for the current segment
    float m = mod(uMorph, 3.0);
    vec3 a, b; float seg;
    if (m < 1.0)      { a = aPos0; b = aPos1; seg = m; }
    else if (m < 2.0) { a = aPos1; b = aPos2; seg = m - 1.0; }
    else              { a = aPos2; b = aPos0; seg = m - 2.0; }
    float t = smoothstep(0.0, 1.0, seg);
    vec3 pos = mix(a, b, t);

    // smooth idle drift — continuous in time, unique phase per particle
    float ph = aRand * 6.2831;
    pos += vec3(
      sin(uTime * 0.45 + ph),
      cos(uTime * 0.38 + ph * 2.0),
      sin(uTime * 0.30 + ph * 3.0)
    ) * (0.025 + 0.05 * aRand);

    // load scatter (particles fly in from a shell)
    vec3 shell = normalize(pos + 0.001) * (6.0 + aRand * 4.0);
    pos = mix(pos, shell, uScatter);

    // pointer repulsion on the XY plane
    vec2 d = pos.xy - uMouse;
    float dist2 = dot(d, d);
    float force = uMouseForce * exp(-dist2 * 0.5);
    pos.xy += normalize(d + 0.0001) * force;
    pos.z += force * 0.4;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.7 + 0.3 * sin(uTime * 2.0 + aRand * 30.0);
    float size = uSize * (0.6 + 0.8 * aRand) * twinkle * (uScale / max(0.5, -mv.z));
    gl_PointSize = clamp(size * uPixelRatio, 1.0, 22.0 * uPixelRatio);

    vColor = aColor;
    vGlow = twinkle;
  }
`;

export const particleFragment = /* glsl */ `
  precision mediump float;
  uniform float uFade;              // 1 in the hero, dims once content scrolls over the field
  varying vec3 vColor;
  varying float vGlow;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float r2 = dot(uv, uv);            // 0.25 at the circle edge
    float alpha = smoothstep(0.25, 0.0, r2);
    alpha *= alpha;                    // soft core, no pow()
    vec3 col = vColor * (0.7 + 0.6 * vGlow) * uFade;
    gl_FragColor = vec4(col, alpha);   // additive: alpha 0 adds nothing, no discard needed
  }
`;
