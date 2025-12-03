<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let canvasContainer: HTMLDivElement;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let cubes: THREE.Mesh[] = [];
	let animationFrameId: number;

	interface CubeData {
		baseX: number;
		baseY: number;
		baseZ: number;
		offsetX: number;
		offsetY: number;
		rotationSpeedX: number;
		rotationSpeedY: number;
		phaseOffset: number;
	}

	const cubeData: CubeData[] = [];

	onMount(() => {
		// Scene setup
		scene = new THREE.Scene();

		// Camera setup
		camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.z = 5;

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		canvasContainer.appendChild(renderer.domElement);

		// Create cubes clustered in center
		const cubeCount = 20;
		const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);

		for (let i = 0; i < cubeCount; i++) {
			// Create gradient material with theme colors
			const hue = 0.7 + Math.random() * 0.15; // Purple to pink range
			const material = new THREE.MeshBasicMaterial({
				color: new THREE.Color().setHSL(hue, 0.8, 0.6),
				transparent: true,
				opacity: 0,
				wireframe: true
			});

			const cube = new THREE.Mesh(geometry, material);

			// Cluster cubes near center with smaller radius
			const angle = (i / cubeCount) * Math.PI * 2;
			const radius = 0.3 + Math.random() * 1.0; // Tighter cluster
			const baseX = Math.cos(angle) * radius;
			const baseY = Math.sin(angle) * radius;
			const baseZ = (Math.random() - 0.5) * 1.5;

			cube.position.x = baseX;
			cube.position.y = baseY;
			cube.position.z = baseZ;

			// Store base positions and animation data
			cubeData.push({
				baseX,
				baseY,
				baseZ,
				offsetX: (Math.random() - 0.5) * 2,
				offsetY: (Math.random() - 0.5) * 2,
				rotationSpeedX: 0.01 + Math.random() * 0.02,
				rotationSpeedY: 0.01 + Math.random() * 0.02,
				phaseOffset: Math.random() * Math.PI * 2
			});

			cube.rotation.x = Math.random() * Math.PI;
			cube.rotation.y = Math.random() * Math.PI;

			scene.add(cube);
			cubes.push(cube);
		}

		// Animation loop
		function animate() {
			animationFrameId = requestAnimationFrame(animate);

			cubes.forEach((cube) => {
				cube.rotation.x += 0.005;
				cube.rotation.y += 0.005;
			});

			renderer.render(scene, camera);
		}

		animate();

		// Handle window resize
		function handleResize() {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}

		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationFrameId);
			renderer.dispose();
			geometry.dispose();
			cubes.forEach((cube) => {
				if (cube.material instanceof THREE.Material) {
					cube.material.dispose();
				}
			});
			if (canvasContainer && renderer.domElement) {
				canvasContainer.removeChild(renderer.domElement);
			}
		};
	});

	// Export function to update cubes based on scroll progress (0 to 1)
	export function updateScrollProgress(progress: number) {
		// Clamp progress between 0 and 1
		progress = Math.max(0, Math.min(1, progress));

		// Spiral rotation for entire group
		const spiralRotation = progress * Math.PI * 4; // Multiple rotations

		cubes.forEach((cube, i) => {
			const material = cube.material as THREE.MeshBasicMaterial;
			const data = cubeData[i];

			// Opacity: fade in first 20%, fade out after 50% (much faster fade out)
			let opacity = 0;
			if (progress < 0.2) {
				opacity = progress / 0.2;
			} else if (progress > 0.5) {
				opacity = (1 - progress) / 0.5;
			} else {
				opacity = 1;
			}
			material.opacity = opacity * 0.7; // Max opacity 0.7 for subtle effect

			// Spiral motion: rotate entire cluster around center
			const angle = (i / cubes.length) * Math.PI * 2 + spiralRotation;
			const shuffleProgress = Math.sin(progress * Math.PI); // Bell curve effect
			const radius = (data.baseX * data.baseX + data.baseY * data.baseY) ** 0.5;

			// Base position follows spiral
			const spiralX = Math.cos(angle) * radius;
			const spiralY = Math.sin(angle) * radius;

			// Add shuffle offset
			cube.position.x = spiralX + data.offsetX * shuffleProgress * 0.5;
			cube.position.y = spiralY + data.offsetY * shuffleProgress * 0.5;
			cube.position.z = data.baseZ + Math.sin(data.phaseOffset + progress * Math.PI * 2) * 0.5;

			// Individual cube rotation (in addition to spiral)
			cube.rotation.x += data.rotationSpeedX * (1 + shuffleProgress * 2);
			cube.rotation.y += data.rotationSpeedY * (1 + shuffleProgress * 2);

			// Scale: subtle pulse effect
			const scale = 1 + Math.sin(progress * Math.PI) * 0.2;
			cube.scale.set(scale, scale, scale);
		});
	}
</script>

<div class="scroll-cubes" bind:this={canvasContainer}></div>

<style>
	.scroll-cubes {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.scroll-cubes :global(canvas) {
		display: block;
	}
</style>
