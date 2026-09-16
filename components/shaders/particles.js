// Custom GLSL for the signature particle field.
// Morphs between 3 position targets (text "HÀ TĨNH" -> sphere -> data-field),
// applies pointer repulsion and gentle idle drift. Colour varies per particle
// with rare gold sparkles as the single accent.

export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;       // 0..3 (three morph segments, wraps around)
  uniform float uSize;
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

  // cheap 3d noise
  vec3 hash3(vec3 p){
    p = vec3(dot(p,vec3(127.1,311.7,74.7)),
             dot(p,vec3(269.5,183.3,246.1)),
             dot(p,vec3(113.5,271.9,124.6)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  void main(){
    // pick the two targets for the current segment
    float m = mod(uMorph, 3.0);
    vec3 a, b; float seg;
    if (m < 1.0)      { a = aPos0; b = aPos1; seg = m; }
    else if (m < 2.0) { a = aPos1; b = aPos2; seg = m - 1.0; }
    else              { a = aPos2; b = aPos0; seg = m - 2.0; }
    float t = smoothstep(0.0, 1.0, seg);
    vec3 pos = mix(a, b, t);

    // idle drift so the cloud always feels alive
    vec3 n = hash3(pos * 0.35 + uTime * 0.06);
    pos += n * (0.05 + 0.10 * aRand);

    // load scatter (particles fly in from a shell)
    vec3 shell = normalize(pos + 0.001) * (6.0 + aRand * 4.0);
    pos = mix(pos, shell, uScatter);

    // pointer repulsion on the XY plane
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    float force = uMouseForce * exp(-dist * dist * 0.5);
    pos.xy += normalize(d + 0.0001) * force;
    pos.z += force * 0.4;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + aRand * 30.0);
    gl_PointSize = uSize * twinkle * (1.0 + aRand) * (300.0 / -mv.z);

    vColor = aColor;
    vGlow = twinkle;
  }
`;

export const particleFragment = /* glsl */ `
  precision mediump float;
  varying vec3 vColor;
  varying float vGlow;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if (r > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, r);
    alpha = pow(alpha, 1.6);
    vec3 col = vColor * (0.75 + 0.6 * vGlow);
    gl_FragColor = vec4(col, alpha);
  }
`;
