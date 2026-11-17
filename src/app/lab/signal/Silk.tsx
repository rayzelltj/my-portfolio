'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { silkState } from './state';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Folded silk: a domain-warped height field, lit by a light that follows the cursor.
const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  uniform float uTime, uIntro;
  uniform vec3 uNight, uDeep, uUltra, uElectric, uPale;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
               mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }
  float silk(vec2 p) {
    float t = uTime * 0.07;
    vec2 q = vec2(fbm(p * 0.35 + vec2(0.0, t)), fbm(p * 0.35 + vec2(3.1, -t * 0.8)));
    float f = p.x * 0.8 + p.y * 0.5 + 1.1 * q.x + 0.6 * q.y;
    return 0.7 * sin(f * 3.2 + t * 2.0) + 0.3 * sin(f * 1.6 - t * 1.3 + q.y * 2.5);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
    vec2 p = uv * 2.4;
    float e = 0.01;
    float h = silk(p);
    float hx = silk(p + vec2(e, 0.0));
    float hy = silk(p + vec2(0.0, e));
    vec3 n = normalize(vec3((h - hx) / e * 0.3, (h - hy) / e * 0.3, 1.0));

    vec3 L = normalize(vec3(uMouse * 0.7 + vec2(0.2, 0.35), 0.75));
    vec3 V = vec3(0.0, 0.0, 1.0);
    float diff = clamp(dot(n, L), 0.0, 1.0);
    float spec = pow(clamp(dot(n, normalize(L + V)), 0.0, 1.0), 70.0);
    float fres = pow(1.0 - n.z, 1.5);

    float shade = smoothstep(0.2, 1.0, diff);
    vec3 col = mix(uNight, uDeep, shade);
    col = mix(col, uUltra, smoothstep(0.7, 1.0, diff) * 0.9);
    col += uElectric * fres * 0.5;
    col += uPale * spec * 0.7;

    float vig = 1.0 - 0.45 * dot(uv * vec2(0.8, 1.0), uv * vec2(0.8, 1.0));
    col *= vig;
    col = mix(uNight * 0.4, col, uIntro);
    col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.035;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Plane({ reduced }: { reduced: boolean }) {
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const invalidate = useThree((s) => s.invalidate);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        depthTest: false,
        uniforms: {
          uRes: { value: new THREE.Vector2() },
          uMouse: { value: new THREE.Vector2(0.4, 0.5) },
          uTime: { value: 14 },
          uIntro: { value: reduced ? 1 : 0 },
          uNight: { value: new THREE.Color('#03081A') },
          uDeep: { value: new THREE.Color('#0A1E7A') },
          uUltra: { value: new THREE.Color('#1F3BFF') },
          uElectric: { value: new THREE.Color('#3D7BFF') },
          uPale: { value: new THREE.Color('#D6E4FF') },
        },
      }),
    [reduced],
  );

  useEffect(() => {
    (material.uniforms.uRes.value as THREE.Vector2).set(size.width * dpr, size.height * dpr);
    invalidate();
  }, [size, dpr, material, invalidate]);

  useFrame((state, dt) => {
    const u = material.uniforms;
    if (!reduced) u.uTime.value += Math.min(dt, 0.05);
    u.uIntro.value = reduced ? 1 : silkState.intro;
    (u.uMouse.value as THREE.Vector2).lerp(state.pointer, 0.04);
  });

  return (
    <mesh material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

export default function Silk({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      eventSource={document.body}
      eventPrefix="client"
      frameloop={reduced ? 'demand' : 'always'}
    >
      <Plane reduced={reduced} />
    </Canvas>
  );
}
