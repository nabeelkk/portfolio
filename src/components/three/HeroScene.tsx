'use client';

import { shaderMaterial } from '@react-three/drei';
import { Canvas, extend, useFrame, useThree, type ThreeElement } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/** Points on a sphere with a noise-driven morph and a soft pull toward the cursor. */
const MorphMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector3(0, 0, 0),
    uColorA: new THREE.Color('#C6F432'),
    uColorB: new THREE.Color('#7C5CFF'),
    uSize: 2.2,
    uPixelRatio: 1,
  },
  /* glsl */ `
    uniform float uTime;
    uniform vec3 uMouse;
    uniform float uSize;
    uniform float uPixelRatio;
    attribute float aRandom;
    varying float vMix;
    varying float vAlpha;

    // Simplex-ish 3D noise (Ashima Arts, MIT)
    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main(){
      vec3 p = position;
      float n = snoise(p * 0.9 + vec3(uTime * 0.12));
      p += normalize(p) * n * 0.32;
      // Cursor pull
      float d = distance(p, uMouse);
      p += normalize(uMouse - p + 0.0001) * smoothstep(1.4, 0.0, d) * 0.22;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      gl_Position = projectionMatrix * mv;
      gl_PointSize = uSize * uPixelRatio * (0.6 + aRandom) * (6.0 / -mv.z);
      vMix = smoothstep(-0.4, 0.6, n);
      vAlpha = 0.35 + 0.65 * smoothstep(-6.0, -3.0, mv.z);
    }
  `,
  /* glsl */ `
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying float vMix;
    varying float vAlpha;
    void main(){
      float r = length(gl_PointCoord - 0.5);
      if (r > 0.5) discard;
      float soft = smoothstep(0.5, 0.0, r);
      vec3 col = mix(uColorB, uColorA, vMix);
      gl_FragColor = vec4(col, soft * vAlpha * 0.85);
    }
  `,
);

extend({ MorphMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    morphMaterial: ThreeElement<typeof MorphMaterial>;
  }
}

type MorphMaterialImpl = THREE.ShaderMaterial & {
  uTime: number;
  uMouse: THREE.Vector3;
  uPixelRatio: number;
};

/** Deterministic pseudo-random in [0, 1) so renders stay pure. */
const hash = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function Sphere({ count = 4200, compact = false }: { count?: number; compact?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<MorphMaterialImpl>(null);
  const { viewport, gl } = useThree();
  const target = useRef(new THREE.Vector3());
  const lastMove = useRef(-10);

  // Remember when the pointer/finger last moved; when idle (always, on touch screens
  // between swipes) the "cursor" drifts on its own so the sphere keeps morphing.
  useEffect(() => {
    const onMove = () => (lastMove.current = performance.now() / 1000);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const [positions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      const radius = 2.1;
      pos[i * 3] = Math.cos(t) * r * radius;
      pos[i * 3 + 1] = y * radius;
      pos[i * 3 + 2] = Math.sin(t) * r * radius;
      rnd[i] = hash(i);
    }
    return [pos, rnd];
  }, [count]);

  useFrame((state, delta) => {
    if (!mat.current || !points.current) return;
    mat.current.uTime += delta;
    mat.current.uPixelRatio = gl.getPixelRatio();
    const t = state.clock.elapsedTime;
    const idle = performance.now() / 1000 - lastMove.current > 2.5;
    const x = idle ? Math.sin(t * 0.35) * 0.6 : state.pointer.x;
    const y = idle ? Math.cos(t * 0.27) * 0.5 : state.pointer.y;
    target.current.set((x * viewport.width) / 2 - points.current.position.x, (y * viewport.height) / 2, 1.6);
    mat.current.uMouse.lerp(target.current, 0.06);
    points.current.rotation.y += delta * 0.06;
    points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, y * 0.25, 0.04);
    points.current.rotation.z = THREE.MathUtils.lerp(points.current.rotation.z, -x * 0.12, 0.04);
  });

  const offsetX = viewport.width > 9 ? viewport.width * 0.22 : compact ? viewport.width * 0.12 : 0;

  return (
    <points ref={points} position={[offsetX, compact ? 0.9 : 0, 0]} scale={compact ? 0.72 : 1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 1]} />
      </bufferGeometry>
      <morphMaterial ref={mat} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function HeroScene({ compact = false }: { compact?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={compact ? [1, 1.5] : [1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      eventSource={typeof document !== 'undefined' ? document.body : undefined}
      eventPrefix="client"
      aria-hidden
    >
      <Sphere count={compact ? 2000 : 4200} compact={compact} />
    </Canvas>
  );
}
