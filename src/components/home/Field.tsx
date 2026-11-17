'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { fieldState } from './state';


const W = 18;
const H = 11;

const vertexShader = /* glsl */ `
  uniform float uTime, uSettle, uScroll, uPR, uMouseOn;
  uniform vec2 uMouse;
  attribute vec3 aScatter;
  attribute float aRand;
  varying float vGlow, vScan, vAlpha, vRand;

  void main() {
    vec3 g = position;
    float t = uTime;

    // Slow ocean swell running through the ledger lines.
    float swell = sin(g.x * 0.42 + t * 0.55) * 0.20 + sin(g.y * 0.85 - t * 0.38 + g.x * 0.18) * 0.13;

    // Ripple that follows the cursor.
    float d = distance(g.xy, uMouse);
    float ripple = sin(d * 4.2 - t * 4.5) * exp(-d * 0.85) * 0.42 * uMouseOn;
    g.z += swell + ripple;

    // A review pass sweeping row by row, leaving a fading trail behind it.
    float scanY = mix(${(H / 2).toFixed(1)}, ${(-H / 2).toFixed(1)}, fract(t * 0.055));
    float behind = g.y - scanY;
    float scan = exp(-abs(behind) * 7.0);
    float trail = behind > 0.0 ? exp(-behind * 0.55) * 0.45 : 0.0;

    // Drifting particles that settle into the lattice.
    vec3 sc = aScatter + vec3(sin(t * 0.21 + aRand * 40.0), cos(t * 0.17 + aRand * 23.0), sin(t * 0.13 + aRand * 11.0)) * 0.35;
    float k = clamp(uSettle * 1.7 - aRand * 0.7, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);
    k *= 1.0 - uScroll;
    vec3 p = mix(sc, g, k);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = mix(2.6, 1.9, k) + scan * 2.6 * k + abs(ripple) * 3.5;
    gl_PointSize = size * uPR * (12.0 / -mv.z);

    vGlow = abs(ripple) * 1.6;
    vScan = (scan + trail) * k;
    vRand = aRand;
    vAlpha = mix(0.5, 1.0, k) * smoothstep(24.0, 4.0, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uCobalt, uTide, uIce, uAccent;
  uniform float uDim;
  varying float vGlow, vScan, vAlpha, vRand;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r);
    vec3 col = mix(uCobalt, uTide, vRand);
    col = mix(col, uIce, clamp(vGlow, 0.0, 1.0));
    col = mix(col, uAccent, clamp(vScan * 1.3, 0.0, 1.0));
    gl_FragColor = vec4(col, a * vAlpha * (0.8 + (vGlow + vScan) * 1.4) * uDim);
  }
`;

function Ledger({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null!);
  const width = useThree((s) => s.size.width);
  const small = width < 700;
  const cols = small ? 150 : 280;
  const rows = small ? 34 : 50;

  const geometry = useMemo(() => {
    const n = cols * rows;
    const grid = new Float32Array(n * 3);
    const scatter = new Float32Array(n * 3);
    const rand = new Float32Array(n);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        grid[i * 3] = (c / (cols - 1) - 0.5) * W;
        grid[i * 3 + 1] = (r / (rows - 1) - 0.5) * H;
        scatter[i * 3] = (Math.random() - 0.5) * 24;
        scatter[i * 3 + 1] = (Math.random() - 0.5) * 16;
        scatter[i * 3 + 2] = (Math.random() - 0.5) * 12;
        rand[i] = Math.random();
        i++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(grid, 3));
    g.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    return g;
  }, [cols, rows]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: reduced ? 8 : 0 },
          uSettle: { value: 0 },
          uScroll: { value: 0 },
          uDim: { value: 1 },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseOn: { value: 0 },
          uPR: { value: Math.min(window.devicePixelRatio, 2) },
          uCobalt: { value: new THREE.Color('#2450FF') },
          uTide: { value: new THREE.Color('#5B8CFF') },
          uIce: { value: new THREE.Color('#E3ECFF') },
          uAccent: { value: new THREE.Color(fieldState.accent) },
        },
      }),
    [reduced],
  );

  const tmp = useMemo(
    () => ({ plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), inv: new THREE.Matrix4(), ray: new THREE.Ray(), hit: new THREE.Vector3() }),
    [],
  );

  useFrame((state, dt) => {
    const u = material.uniforms;
    if (!reduced) u.uTime.value += Math.min(dt, 0.05);
    u.uSettle.value = fieldState.settle;
    u.uScroll.value = fieldState.scroll;
    u.uDim.value = fieldState.dim;
    (u.uAccent.value as THREE.Color).set(fieldState.accent);

    // Project the cursor onto the tilted lattice, in the lattice's own coordinates.
    state.raycaster.setFromCamera(state.pointer, state.camera);
    tmp.inv.copy(ref.current.matrixWorld).invert();
    tmp.ray.copy(state.raycaster.ray).applyMatrix4(tmp.inv);
    const onPlane = tmp.ray.intersectPlane(tmp.plane, tmp.hit);
    if (onPlane) (u.uMouse.value as THREE.Vector2).lerp(new THREE.Vector2(tmp.hit.x, tmp.hit.y), 0.12);
    u.uMouseOn.value += ((onPlane && !reduced ? 1 : 0) - u.uMouseOn.value) * 0.05;
  });

  return <points ref={ref} geometry={geometry} material={material} rotation={[-1.1, 0, 0]} position={[0, 0.9, 0]} />;
}

export default function Field({ reduced }: { reduced: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 7.5], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      eventSource={document.body}
      eventPrefix="client"
      frameloop={reduced ? 'demand' : 'always'}
    >
      <Ledger reduced={reduced} />
    </Canvas>
  );
}
