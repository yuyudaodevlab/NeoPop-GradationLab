"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ModernBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const orbGeometry = new THREE.IcosahedronGeometry(1.1, 12);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FF477E"),
      emissive: new THREE.Color("#7A36FF"),
      emissiveIntensity: 0.5,
      roughness: 0.15,
      metalness: 0.45,
      transparent: true,
      opacity: 0.85,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.set(-1.2, 0.6, -0.2);
    group.add(orb);

    const ringGeometry = new THREE.TorusGeometry(1.3, 0.15, 24, 120);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#00E5FF"),
      emissive: new THREE.Color("#00E5FF"),
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.65,
      transparent: true,
      opacity: 0.8,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(1.4, -0.4, -1.2);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    const particleCount = 320;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: "#FFFFFF",
      size: 0.035,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(4, 3, 5);
    scene.add(ambientLight, directionalLight);

    const resize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const t = clock.getElapsedTime();

      orb.rotation.x = t * 0.2;
      orb.rotation.y = t * 0.35;

      ring.rotation.z = t * 0.32;
      ring.position.y = Math.sin(t * 0.8) * 0.3 - 0.45;

      group.rotation.y = t * 0.08;
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);

      orbGeometry.dispose();
      orbMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10" aria-hidden="true" />;
}
