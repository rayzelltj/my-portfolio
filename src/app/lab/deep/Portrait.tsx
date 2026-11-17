'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { fieldState } from './state';
import { portraitState } from '@/components/home/state';

const WIDTH = 4; // world units across the portrait
const STRIDE = 7; // x, y, brightness, edge, r, g, b (see scripts/media/portrait-points.py)

type Points = { w: number; h: number; data: Uint8Array; count: number };

async function loadPoints(url: string): Promise<Points> {
  const buf = await (await fetch(url)).arrayBuffer();
  const view = new DataView(buf);
  const w = view.getUint16(0, true);
  const h = view.getUint16(2, true);
  const count = view.getUint32(4, true);
  return { w, h, count, data: new Uint8Array(buf, 8, count * STRIDE) };
}

const vertexShader = /* glsl */ `
  uniform float uTime, uProgress, uPR, uMouseOn, uTop, uBottom;
  uniform vec2 uMouse;
  attribute vec3 aScatter;
  attribute vec3 aInfo;  // brightness, edge, random
  attribute vec3 aColor; // original photo colour
  varying float vBright, vEdge, vScan, vSpot, vAlpha;
  varying vec3 vColor;

  void main() {
    float bright = pow(aInfo.x, 0.6), edge = aInfo.y, rnd = aInfo.z;

    // Assemble top to bottom with a little randomness, like the water settling.
    float rowT = (uTop - position.y) / (uTop - uBottom);
    float k = clamp(uProgress * 1.8 - rowT * 0.6 - rnd * 0.2, 0.0, 1.0);
    k = k * k * (3.0 - 2.0 * k);

    vec3 target = position;
    target.z += bright * 0.12; // a hint of depth, not enough to distort the face
    target.xy += vec2(sin(uTime * 0.8 + rnd * 30.0), cos(uTime * 0.7 + rnd * 20.0)) * 0.004;

    vec3 drift = aScatter + vec3(sin(uTime * 0.3 + rnd * 9.0), cos(uTime * 0.25 + rnd * 7.0), 0.0) * 0.3;
    vec3 p = mix(drift, target, k);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // The cursor is a soft spotlight: nearby particles glow, nothing moves.
    float d = distance(position.xy, uMouse);
    vSpot = exp(-d * d * 5.0) * uMouseOn * k;

    // The same review pass as the water sweeps down the portrait.
    float scanY = mix(uTop + 0.3, uBottom - 0.3, fract(uTime * 0.12));
    vScan = exp(-abs(position.y - scanY) * 14.0) * k;

    float size = 0.9 + bright * 2.6 + edge * 1.2 + vScan * 2.0 + vSpot * 0.8;
    gl_PointSize = size * uPR * (5.5 / -mv.z);
    vBright = bright;
    vEdge = edge;
    vColor = aColor;
    vAlpha = mix(0.25, 1.0, k);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uCobalt, uTide, uIce, uAccent;
  uniform float uTrueColor;
  varying float vBright, vEdge, vScan, vSpot, vAlpha;
  varying vec3 vColor;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, r);

    // Brand blues, optionally blended with the photo's real colours.
    vec3 col = mix(uCobalt, uTide, smoothstep(0.0, 0.45, vBright));
    col = mix(col, uIce, smoothstep(0.45, 1.0, vBright) + vEdge * 0.25);
    vec3 photo = pow(vColor, vec3(0.8)) * 1.15; // lift the photo colours slightly for a dark page
    col = mix(col, photo, uTrueColor);

    col = mix(col, uIce, vSpot * 0.35);
    col = mix(col, uAccent, clamp(vScan * 1.4, 0.0, 1.0));
    float strength = 0.35 + vBright * 0.75 + vEdge * 0.3 + vScan + vSpot * 0.6;
    gl_FragColor = vec4(col, a * vAlpha * strength);
  }
`;

function Cloud({ points, reduced }: { points: Points; reduced: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const height = (WIDTH * points.h) / points.w;

  const geometry = useMemo(() => {
    const { w, h, data, count } = points;
    const pos = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const info = new Float32Array(count * 3);
    const color = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const o = i * STRIDE;
      pos[i * 3] = (data[o] / (w - 1) - 0.5) * WIDTH;
      pos[i * 3 + 1] = -(data[o + 1] / (h - 1) - 0.5) * ((WIDTH * h) / w);
      scatter[i * 3] = (Math.random() - 0.5) * 9;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 7;
      scatter[i * 3 + 2] = (Math.random() - 0.5) * 4;
      info[i * 3] = data[o + 2] / 255;
      info[i * 3 + 1] = data[o + 3] / 255;
      info[i * 3 + 2] = Math.random();
      color[i * 3] = data[o + 4] / 255;
      color[i * 3 + 1] = data[o + 5] / 255;
      color[i * 3 + 2] = data[o + 6] / 255;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3));
    g.setAttribute('aInfo', new THREE.BufferAttribute(info, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    return g;
  }, [points]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: reduced ? 3 : 0 },
          uProgress: { value: 0 },
          uTrueColor: { value: portraitState.trueColor },
          uMouse: { value: new THREE.Vector2(99, 99) },
          uMouseOn: { value: 0 },
          uPR: { value: Math.min(window.devicePixelRatio, 2) },
          uTop: { value: height / 2 },
          uBottom: { value: -height / 2 },
          uCobalt: { value: new THREE.Color('#2450FF') },
          uTide: { value: new THREE.Color('#5B8CFF') },
          uIce: { value: new THREE.Color('#E3ECFF') },
          uAccent: { value: new THREE.Color(fieldState.accent) },
        },
      }),
    [reduced, height],
  );

  const hit = useMemo(() => ({ plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), v: new THREE.Vector3(), m: new THREE.Matrix4(), ray: new THREE.Ray() }), []);

  useFrame((state, dt) => {
    const u = material.uniforms;
    if (!reduced) u.uTime.value += Math.min(dt, 0.05);
    u.uProgress.value = portraitState.progress;
    u.uTrueColor.value = portraitState.trueColor;
    (u.uAccent.value as THREE.Color).set(fieldState.accent);

    // A very gentle turn toward the cursor, just enough to feel alive.
    const g = group.current;
    const tx = reduced ? 0 : state.pointer.x * 0.08;
    const ty = reduced ? 0 : -state.pointer.y * 0.04;
    g.rotation.y += (tx - g.rotation.y) * 0.05;
    g.rotation.x += (ty - g.rotation.x) * 0.05;

    // Cursor position on the portrait plane, for the spotlight.
    state.raycaster.setFromCamera(state.pointer, state.camera);
    hit.m.copy(g.matrixWorld).invert();
    hit.ray.copy(state.raycaster.ray).applyMatrix4(hit.m);
    const on = hit.ray.intersectPlane(hit.plane, hit.v) && Math.abs(state.pointer.x) < 1 && Math.abs(state.pointer.y) < 1;
    if (on) (u.uMouse.value as THREE.Vector2).lerp(new THREE.Vector2(hit.v.x, hit.v.y), 0.15);
    u.uMouseOn.value += ((on && !reduced ? 1 : 0) - u.uMouseOn.value) * 0.08;
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} />
    </group>
  );
}

export default function Portrait({ reduced }: { reduced: boolean }) {
  const [points, setPoints] = useState<Points | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadPoints('/media/portrait.bin').then(setPoints);
    // Only render while on screen, to save battery.
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5.3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
        eventSource={document.body}
        eventPrefix="client"
        frameloop={reduced ? 'demand' : visible ? 'always' : 'never'}
      >
        {points && <Cloud points={points} reduced={reduced} />}
      </Canvas>
    </div>
  );
}
