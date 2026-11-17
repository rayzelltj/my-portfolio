'use client';

import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { portraitState } from './state';

/**
 * The real photo, untouched at rest. Particles carry it in as you scroll (the photo resolves out
 * of them), then only the silhouette keeps shedding a few strands that drift away like dust.
 */

const SRC = '/media/portrait-cutout.webp';
const WIDTH = 4;

const NOISE = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
`;

const photoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const photoFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal, uTime, uMouseOn;
  uniform vec2 uMouse, uTexel;
  uniform vec3 uRim;
  varying vec2 vUv;
  ${NOISE}
  void main() {
    vec4 c = texture2D(uMap, vUv);

    // Rim light: bright where the silhouette meets the background.
    vec2 o = uTexel * 16.0;
    float minA = min(min(texture2D(uMap, vUv + vec2(o.x, 0.0)).a, texture2D(uMap, vUv - vec2(o.x, 0.0)).a),
                     min(texture2D(uMap, vUv + vec2(0.0, o.y)).a, texture2D(uMap, vUv - vec2(0.0, o.y)).a));
    float rim = c.a * (1.0 - minA);

    // Reveal: the photo resolves in a noisy pattern, top first, as the particles arrive.
    float n = noise(vUv * 22.0) * 0.65 + noise(vUv * 70.0) * 0.35;
    float t = uReveal * 1.25 - (1.0 - vUv.y) * 0.2;
    float reveal = smoothstep(n - 0.06, n + 0.02, t);

    // Only the soft outer fringe flickers away; the face itself is never touched.
    float fringe = 1.0 - smoothstep(0.35, 0.9, c.a);
    float flicker = smoothstep(0.25, 0.6, noise(vUv * 55.0 + vec2(0.0, -uTime * 0.25)));
    // Fade out where the photo crop cuts the shoulders, so nothing ends in a hard line.
    float frame = smoothstep(0.0, 0.22, vUv.y) * smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
    float alpha = c.a * reveal * mix(1.0, flicker, fringe) * frame;

    vec3 col = c.rgb + uRim * smoothstep(0.0, 0.9, rim) * 0.16;
    // A soft glint where the cursor is, no movement.
    vec2 d = (vUv - uMouse) * vec2(1.0, 1.35);
    col += vec3(0.9, 0.95, 1.0) * exp(-dot(d, d) * 60.0) * 0.07 * uMouseOn;
    gl_FragColor = vec4(col, alpha);
  }
`;

const pointsVertex = /* glsl */ `
  uniform float uTime, uReveal, uPR;
  attribute vec3 aScatter, aDir, aColor;
  attribute vec2 aInfo; // random, kind (0 = carries the photo in, 1 = edge strand)
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float rnd = aInfo.x, kind = aInfo.y;
    vec3 p = position;
    float alpha;
    if (kind < 0.5) {
      float k = clamp(uReveal * 1.5 - rnd * 0.5, 0.0, 1.0);
      k = k * k * (3.0 - 2.0 * k);
      vec3 drift = aScatter + vec3(sin(uTime * 0.3 + rnd * 9.0), cos(uTime * 0.25 + rnd * 7.0), 0.0) * 0.25;
      p = mix(drift, position, k);
      alpha = smoothstep(0.0, 0.12, uReveal) * (1.0 - smoothstep(0.55, 0.95, uReveal)) * 0.9;
    } else {
      float life = fract(uTime * (0.04 + rnd * 0.06) + rnd);
      vec3 wobble = vec3(sin(uTime * 1.2 + rnd * 40.0), cos(uTime * 1.0 + rnd * 30.0), 0.0) * 0.04 * life;
      p = position + aDir * life * (0.3 + rnd * 0.8) + wobble;
      alpha = smoothstep(0.6, 1.0, uReveal) * smoothstep(0.0, 0.15, life) * (1.0 - life) * 0.8;
    }
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (kind < 0.5 ? 1.8 : 1.4) * uPR * (7.2 / -mv.z);
    vColor = aColor;
    vAlpha = alpha;
  }
`;

const pointsFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

function buildParticles(img: HTMLImageElement, height: number, carriers: number, strands: number) {
  const w = 240;
  const h = Math.round((w * img.height) / img.width);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;
  const A = (x: number, y: number) => px[(Math.min(h - 1, Math.max(0, y)) * w + Math.min(w - 1, Math.max(0, x))) * 4 + 3] / 255;

  const total = carriers + strands;
  const pos = new Float32Array(total * 3);
  const scatter = new Float32Array(total * 3);
  const dir = new Float32Array(total * 3);
  const color = new Float32Array(total * 3);
  const info = new Float32Array(total * 2);
  const ice = [0.85, 0.91, 1.0];

  const put = (i: number, x: number, y: number, kind: number) => {
    const o = (y * w + x) * 4;
    pos[i * 3] = ((x + Math.random()) / w - 0.5) * WIDTH;
    pos[i * 3 + 1] = -((y + Math.random()) / h - 0.5) * height;
    pos[i * 3 + 2] = 0.02;
    scatter[i * 3] = (Math.random() - 0.5) * 10;
    scatter[i * 3 + 1] = (Math.random() - 0.5) * 8;
    scatter[i * 3 + 2] = (Math.random() - 0.5) * 4;
    // Carriers take the photo's colour; strands are lightened so they read on the dark page.
    const lift = kind < 0.5 ? 1.15 : 0.45;
    for (let ch = 0; ch < 3; ch++) {
      const v = Math.min(1, (px[o + ch] / 255) * (kind < 0.5 ? 1.2 : 1.6));
      color[i * 3 + ch] = kind < 0.5 ? v * lift : v * lift + ice[ch] * 0.55;
    }
    info[i * 2] = Math.random();
    info[i * 2 + 1] = kind;
  };

  let n = 0;
  for (let tries = 0; n < carriers && tries < carriers * 30; tries++) {
    const x = (Math.random() * w) | 0;
    const y = (Math.random() * h) | 0;
    if (A(x, y) > 0.6) put(n++, x, y, 0);
  }

  let s = 0;
  for (let tries = 0; s < strands && tries < strands * 400; tries++) {
    const x = (Math.random() * w) | 0;
    const y = (Math.random() * h) | 0;
    const a = A(x, y);
    const nearEdge = a > 0.3 && Math.min(A(x - 3, y), A(x + 3, y), A(x, y - 3)) < 0.25;
    if (!nearEdge || y > h * 0.97) continue;
    if (Math.random() > Math.pow(1 - y / h, 1.2) + 0.15) continue; // mostly hair, some shoulders
    const i = n + s++;
    put(i, x, y, 1);
    const gx = A(x - 2, y) - A(x + 2, y);
    const gy = A(x, y + 2) - A(x, y - 2);
    const len = Math.hypot(gx, gy) || 1;
    dir[i * 3] = gx / len;
    dir[i * 3 + 1] = gy / len + 0.2;
    dir[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }

  const count = n + s;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, count * 3), 3));
  g.setAttribute('aScatter', new THREE.BufferAttribute(scatter.subarray(0, count * 3), 3));
  g.setAttribute('aDir', new THREE.BufferAttribute(dir.subarray(0, count * 3), 3));
  g.setAttribute('aColor', new THREE.BufferAttribute(color.subarray(0, count * 3), 3));
  g.setAttribute('aInfo', new THREE.BufferAttribute(info.subarray(0, count * 2), 2));
  return g;
}

function Scene({ reduced }: { reduced: boolean }) {
  const texture = useLoader(THREE.TextureLoader, SRC);
  const img = texture.image as HTMLImageElement;
  const height = (WIDTH * img.height) / img.width;
  const small = window.innerWidth < 700;
  const plane = useRef<THREE.Mesh>(null!);

  useMemo(() => {
    texture.colorSpace = THREE.NoColorSpace; // pass the photo's colours through untouched
    texture.anisotropy = 4;
  }, [texture]);

  const photoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: photoVertex,
        fragmentShader: photoFragment,
        transparent: true,
        depthTest: false,
        uniforms: {
          uMap: { value: texture },
          uReveal: { value: 0 },
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(-1, -1) },
          uMouseOn: { value: 0 },
          uTexel: { value: new THREE.Vector2(1 / img.width, 1 / img.height) },
          uRim: { value: new THREE.Vector3(0.75, 0.85, 1.0) },
        },
      }),
    [texture, img],
  );

  const geometry = useMemo(() => buildParticles(img, height, small ? 7000 : 14000, small ? 2500 : 5000), [img, height, small]);
  const pointsMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: pointsVertex,
        fragmentShader: pointsFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uReveal: { value: 0 }, uPR: { value: Math.min(window.devicePixelRatio, 2) } },
      }),
    [],
  );

  const hit = useMemo(() => ({ plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), v: new THREE.Vector3() }), []);

  useFrame((state, dt) => {
    const step = reduced ? 0 : Math.min(dt, 0.05);
    const reveal = reduced ? 1 : portraitState.progress;
    photoMat.uniforms.uTime.value += step;
    pointsMat.uniforms.uTime.value += step;
    photoMat.uniforms.uReveal.value = reveal;
    pointsMat.uniforms.uReveal.value = reveal;

    state.raycaster.setFromCamera(state.pointer, state.camera);
    const on = state.raycaster.ray.intersectPlane(hit.plane, hit.v) && Math.abs(state.pointer.x) < 1 && Math.abs(state.pointer.y) < 1;
    if (on) {
      const uv = new THREE.Vector2(hit.v.x / WIDTH + 0.5, hit.v.y / height + 0.5);
      (photoMat.uniforms.uMouse.value as THREE.Vector2).lerp(uv, 0.15);
    }
    photoMat.uniforms.uMouseOn.value += ((on && !reduced ? 1 : 0) - photoMat.uniforms.uMouseOn.value) * 0.08;
  });

  return (
    <>
      <mesh ref={plane} material={photoMat} renderOrder={0}>
        <planeGeometry args={[WIDTH, height]} />
      </mesh>
      <points geometry={geometry} material={pointsMat} renderOrder={1} />
    </>
  );
}

export default function PortraitDissolve({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    if (wrap.current) io.observe(wrap.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        eventSource={document.body}
        eventPrefix="client"
        frameloop={reduced ? 'demand' : visible ? 'always' : 'never'}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
