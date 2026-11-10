import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AIOrb({ size = 260, interactive = true }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // Geometry: Icosahedron with particle points
    const geometry = new THREE.IcosahedronGeometry(0.85, 4);
    const count = geometry.attributes.position.count;
    
    // Store original positions for harmonic wave ripple
    const originalPositions = new Float32Array(geometry.attributes.position.array);
    
    // Custom Point Colors: electric blue (#00BAF2) to cyan (#00E5FF)
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color(0x00BAF2);
    const color2 = new THREE.Color(0x00E5FF);
    const color3 = new THREE.Color(0x38BDF8);

    for (let i = 0; i < count; i++) {
      const mixed = color1.clone().lerp(color2, Math.random() * 0.7);
      if (Math.random() > 0.8) mixed.lerp(color3, 0.5);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Points Material
    const material = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Inner glowing core
    const coreGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x002E6E,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      if (!interactive) return;
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / size - 0.5) * 1.5;
      mouseY = ((e.clientY - rect.top) / size - 0.5) * 1.5;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Deform positions with sinusoidal waves
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];

        const wave = Math.sin(elapsedTime * 2.2 + ox * 3.5 + oy * 3.0) * 0.07;
        positions[i3] = ox * (1 + wave);
        positions[i3 + 1] = oy * (1 + wave);
        positions[i3 + 2] = oz * (1 + wave);
      }
      geometry.attributes.position.needsUpdate = true;

      // Rotation
      particles.rotation.y = elapsedTime * 0.25 + mouseX * 0.4;
      particles.rotation.x = elapsedTime * 0.15 + mouseY * 0.4;
      coreMesh.rotation.y = -elapsedTime * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, [size, interactive]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient background glow ring */}
      <div 
        className="absolute rounded-full pointer-events-none filter blur-2xl opacity-40 bg-gradient-to-tr from-paytm-cyan via-paytm-blue to-blue-900"
        style={{ width: size * 0.8, height: size * 0.8 }}
      />
      <div ref={mountRef} style={{ width: size, height: size }} className="relative z-10 cursor-grab active:cursor-grabbing" />
    </div>
  );
}
