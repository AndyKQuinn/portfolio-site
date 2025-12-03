<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Lenis from 'lenis';
	import Button from '$lib/components/Button.svelte';
	import RollingText from '$lib/components/RollingText.svelte';

	let heroSection: HTMLElement;
	let signatureText: HTMLElement;
	let lenis: any;

	const projects = [
		{
			title: 'Software Engineering Coach',
			company: 'Major Financial Institution',
			role: 'Lead Software Engineer',
			description:
				'Coach teams on secure and modern development practices, automating DevOps pipelines, and fostering a culture of continuous improvement.',
			tech: ['Python', 'React', 'Golang', 'Kubernetes', 'Helm', 'Azure'],
			years: '3',
			isCurrent: true,
			missionBriefing: [
				'I work closely with development teams to identify pain points in their workflows and help them build better solutions. My focus is on streamlining processes, automating repetitive tasks, and improving application resilience. I research industry best practices and collaborate with teams to implement efficient, maintainable, secure, and scalable code patterns that make their lives easier.',
				"I'm passionate about technical documentation and user experience. I believe good documentation is just as important as a stable, performant application. I'm always looking for creative ways to present technical content—whether it's a documentation site or a complete platform experience—that makes information accessible and easy to understand.",
				"I help teams build transparent feedback mechanisms so they can gather actionable insights from their users. I've developed several feedback collection strategies, including anonymous channels, and I share these approaches with teams to help them improve how they listen to and learn from their users."
			]
		},
		{
			title: 'Full Stack Developer',
			company: 'Major Retail Outlet',
			role: 'Senior Software Engineer',
			description:
				'Maintain and enhance a high-throughput notification platform supporting vital systems for thousands of engineers.',
			tech: ['React', 'Golang', 'Kubernetes', 'Docker', 'GCP', 'OpenStack'],
			years: '14',
			missionBriefing: [
				'I maintained and enhanced a production notification platform used by thousands of engineers every week. My day-to-day included monitoring health dashboards, analyzing logs, and providing break/fix support. During my time on this project, I:',
				' - Rewrote the Golang API to work with an updated MongoDB driver, which significantly improved performance and maintainability.',
				' - Built out the frontend with better alert suppression options, simpler rule creation, and more intuitive ways to manage alerts.',
				' - Streamlined our DevOps processes and tooling to make deployments smoother and more reliable.',
				' - Worked with teams across the organization to integrate new features seamlessly.'
			]
		},
		{
			title: 'Full Stack Developer',
			company: 'Online Retail Company',
			role: 'Software Engineer',
			description:
				'Build an admin interface for managing products, inventory and orders for an online point of sale company.',
			tech: ['React', 'TypeScript', 'GraphQL', 'Keycloak'],
			years: '1',
			missionBriefing: [
				'My peer and I built an admin interface using TypeScript and React, with GraphQL for efficient data fetching and Keycloak handling authentication and authorization.',
				'The interface included tools for managing products, processing refunds, and integrating with external services for analytics and operations support.'
			]
		}
	];

	// Frontend technologies with descriptions
	const frontendTech = [
		{
			name: 'React',
			description: 'Component-based UI library for building dynamic interfaces with virtual DOM',
			icon: '⚛️'
		},
		{
			name: 'SvelteKit',
			description: 'Lightweight framework with compile-time reactivity and server-side rendering',
			icon: '🔥'
		},
		{
			name: 'TypeScript',
			description: 'Typed superset of JavaScript for safer, more maintainable code',
			icon: '📘'
		},
		{
			name: 'JavaScript',
			description: 'Core language for web development with modern ES6+ features',
			icon: '⚡'
		},
		{
			name: 'HTML5',
			description: 'Semantic markup for accessible, structured web content',
			icon: '🏗️'
		},
		{
			name: 'CSS3',
			description: 'Advanced styling with animations, grid, and flexbox layouts',
			icon: '🎨'
		}
	];

	// Backend technologies with descriptions
	const backendTech = [
		{
			name: 'Node.js',
			description: 'JavaScript runtime for scalable server-side applications',
			icon: '🟢'
		},
		{
			name: 'Python',
			description: 'Versatile language for backend services, data processing, and automation',
			icon: '🐍'
		},
		{
			name: 'PostgreSQL',
			description: 'Advanced relational database with ACID compliance and JSON support',
			icon: '🐘'
		},
		{
			name: 'Golang',
			description: 'High-performance language for concurrent systems and microservices',
			icon: '🔷'
		},
		{
			name: 'AWS',
			description: 'Cloud platform for hosting, storage, and serverless computing',
			icon: '☁️'
		},
		{
			name: 'Docker',
			description: 'Containerization platform for consistent deployment environments',
			icon: '🐳'
		},
		{
			name: 'Kubernetes',
			description: 'Container orchestration for automated deployment and scaling',
			icon: '⎈'
		},
		{
			name: 'GraphQL',
			description: 'Query language for APIs with precise data fetching',
			icon: '📊'
		}
	];

	let tooltipData = $state<{ name: string; description: string; x: number; y: number } | null>(
		null
	);

	let isModalOpen = $state(false);
	let selectedProject = $state<(typeof projects)[0] | null>(null);

	function openModal(project: (typeof projects)[0]) {
		selectedProject = project;
		isModalOpen = true;
		document.body.style.overflow = 'hidden';
		if (lenis) {
			lenis.stop();
		}
	}

	function closeModal() {
		isModalOpen = false;
		document.body.style.overflow = '';
		if (lenis) {
			lenis.start();
		}
	}

	function handleModalClick(e: MouseEvent) {
		e.stopPropagation();
	}

	function handleModalWheel(e: WheelEvent) {
		e.stopPropagation();
	}

	function handleModalTouch(e: TouchEvent) {
		e.stopPropagation();
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			closeModal();
		}
	}

	function handleModalKeydown(e: KeyboardEvent) {
		e.stopPropagation();
	}

	function scrollToProjects() {
		const projectsSection = document.querySelector('.projects-section');
		if (projectsSection) {
			projectsSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	onMount(() => {
		// Initialize Lenis Smooth Scroll
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Register ScrollTrigger plugin and integrate with Lenis
		gsap.registerPlugin(ScrollTrigger);

		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.lagSmoothing(0);

		// GSAP Animations - Float in from right with smooth fade
		gsap.fromTo(
			'.signature',
			{ opacity: 0, x: 100, scale: 0.9 },
			{ opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power2.out' }
		);

		gsap.fromTo(
			'.cta-section',
			{ opacity: 0, x: 60 },
			{ opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' }
		);

		// Animate project cards on scroll
		gsap.fromTo(
			'.project-card',
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				duration: 0.5,
				stagger: 0.08,
				ease: 'power2.out',
				scrollTrigger: {
					trigger: '.projects-grid',
					start: 'top 80%'
				}
			}
		);

		// Cleanup
		return () => {
			lenis.destroy();
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<svelte:head>
	<title>Andy K Quinn - Professional Developer & Diversity Advocate</title>
	<meta name="description" content="Andy K Quinn - Professional Developer & Diversity Advocate" />
	<link rel="stylesheet" href="https://unpkg.com/lenis@1.0.45/dist/lenis.css" />
</svelte:head>

<!-- Hero Section -->
<section class="hero" bind:this={heroSection}>
	<div class="hero-content">
		<h1 class="signature" bind:this={signatureText}>Andy K Quinn</h1>

		<RollingText />

		<div class="cta-section">
			<Button label="Learn More" href="/about" />
			<Button label="Get In Touch" href="/contact" />
		</div>
	</div>

	<!-- Scroll Indicator -->
	<button class="scroll-indicator" onclick={scrollToProjects} aria-label="Scroll to projects">
		<div class="chevron-stack">
			<svg class="chevron chevron-1" viewBox="0 0 24 24" fill="none">
				<path
					d="M6 9L12 15L18 9"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<svg class="chevron chevron-2" viewBox="0 0 24 24" fill="none">
				<path
					d="M6 9L12 15L18 9"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<svg class="chevron chevron-3" viewBox="0 0 24 24" fill="none">
				<path
					d="M6 9L12 15L18 9"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	</button>
</section>

<!-- Projects Showcase -->
<section class="projects-section">
	<div class="container">
		<h2 class="section-title">Experience</h2>

		<div class="projects-grid">
			{#each projects as project, i (project.title + project.company)}
				<div class="project-card">
					{#if project.isCurrent}
						<div class="current-badge">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="10"></circle>
								<polyline points="12 6 12 12 16 14"></polyline>
							</svg>
							<span>Current Role</span>
						</div>
					{/if}
					<div class="card-icon">
						<!-- Icon placeholder -->
					</div>
					<div class="card-content">
						<div class="card-header">
							<h3 class="project-title">{project.title}</h3>
							<p class="project-company">{project.company}</p>
							<p class="project-role">{project.role}</p>
						</div>
						<p class="project-description">{project.description}</p>
						<div class="tech-stack">
							{#each project.tech as tech (tech)}
								<span class="tech-badge">{tech}</span>
							{/each}
						</div>
					</div>
					<div class="card-footer">
						<button class="view-project-btn" onclick={() => openModal(project)}>
							<span>View Details</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="12 5 19 12 12 19"></polyline>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Skills Section -->
<section class="skills-section">
	<div class="container">
		<h2 class="section-title">Technologies & Skills</h2>

		<div class="carousels-container">
			<!-- Frontend Carousel -->
			<div class="carousel-section">
				<h3 class="carousel-title">Frontend</h3>
				<div class="carousel-3d">
					<div class="carousel-track frontend-track" class:paused={tooltipData !== null}>
						{#each [...frontendTech, ...frontendTech, ...frontendTech, ...frontendTech] as tech, i (tech.name + '-' + i)}
							<div
								class="tech-card"
								role="img"
								aria-label={tech.name}
								onmouseenter={(e) => {
									const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
									tooltipData = {
										name: tech.name,
										description: tech.description,
										x: rect.left + rect.width / 2,
										y: rect.top
									};
								}}
								onmouseleave={() => {
									tooltipData = null;
								}}
							>
								<div class="tech-icon">{tech.icon}</div>
								<div class="tech-name">{tech.name}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Backend Carousel -->
			<div class="carousel-section">
				<h3 class="carousel-title">Backend & DevOps</h3>
				<div class="carousel-3d">
					<div class="carousel-track backend-track" class:paused={tooltipData !== null}>
						{#each [...backendTech, ...backendTech, ...backendTech, ...backendTech] as tech, i (tech.name + '-' + i)}
							<div
								class="tech-card"
								role="img"
								aria-label={tech.name}
								onmouseenter={(e) => {
									const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
									tooltipData = {
										name: tech.name,
										description: tech.description,
										x: rect.left + rect.width / 2,
										y: rect.top
									};
								}}
								onmouseleave={() => {
									tooltipData = null;
								}}
							>
								<div class="tech-icon">{tech.icon}</div>
								<div class="tech-name">{tech.name}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Tooltip -->
	{#if tooltipData}
		<div class="tooltip" style="left: {tooltipData.x}px; top: {tooltipData.y}px;">
			<div class="tooltip-content">
				<strong>{tooltipData.name}</strong>
				<p>{tooltipData.description}</p>
			</div>
		</div>
	{/if}
</section>

<!-- Retro Futuristic Modal -->
{#if isModalOpen && selectedProject}
	<div
		class="modal-overlay"
		onclick={closeModal}
		onkeydown={handleOverlayKeydown}
		role="button"
		tabindex="0"
	>
		<div
			class="modal-container"
			onclick={handleModalClick}
			onwheel={handleModalWheel}
			ontouchstart={handleModalTouch}
			ontouchmove={handleModalTouch}
			ontouchend={handleModalTouch}
			onkeydown={handleModalKeydown}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- CRT Screen Effect -->
			<div class="crt-effect"></div>

			<!-- Scanlines -->
			<div class="scanlines"></div>

			<!-- Modal Header with Retro Terminal Style -->
			<div class="modal-header">
				<div class="terminal-bar">
					<div class="terminal-buttons">
						<span class="terminal-btn red"></span>
						<span class="terminal-btn yellow"></span>
						<span class="terminal-btn green"></span>
					</div>
					<div class="terminal-title">EXPERIENCE_VIEWER.EXE</div>
					<button class="close-btn" onclick={closeModal} aria-label="Close modal">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				</div>
			</div>

			<!-- Modal Body -->
			<div class="modal-body">
				<!-- Achievement Badge Style Header -->
				<div class="achievement-header">
					<div class="achievement-icon">
						<!-- Icon placeholder -->
					</div>
					<div class="achievement-unlocked">
						<span class="achievement-label">JOB TITLE</span>
						<h2 class="achievement-title">{selectedProject.title}</h2>
					</div>
				</div>

				<!-- Stats Panel -->
				<div class="stats-panel">
					<div class="stat-item">
						<div class="stat-label">COMPANY</div>
						<div class="stat-value">{selectedProject.company}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">ROLE</div>
						<div class="stat-value">{selectedProject.role}</div>
					</div>
					<div class="stat-item">
						<div class="stat-label">DURATION</div>
						<div class="stat-value">{selectedProject.years} years</div>
					</div>
				</div>

				<!-- Project Details -->
				<div class="mission-briefing">
					<h3 class="briefing-title">▶ PROJECT DETAILS</h3>
					{#each selectedProject.missionBriefing as briefingParagraph, index (index)}
						<p class="briefing-text">
							{briefingParagraph}
						</p>
					{/each}
				</div>

				<!-- Tech Stack as Power-Ups -->
				<div class="powerups-section">
					<h3 class="powerups-title">⚡ TECH ARSENAL</h3>
					<div class="powerups-grid">
						{#each selectedProject.tech as tech, i (tech)}
							<div class="powerup-item" style="animation-delay: {i * 0.1}s">
								<div class="powerup-icon">
									<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path
											d="M12 2L2 7L12 12L22 7L12 2Z"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M2 17L12 22L22 17"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M2 12L12 17L22 12"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
								<span class="powerup-name">{tech}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Footer -->
<footer class="site-footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-social">
				<a href="https://github.com/AndyKQuinn" target="_blank" rel="noopener noreferrer">GitHub</a>
				<a href="https://www.linkedin.com/in/andy-guice/" target="_blank" rel="noopener noreferrer"
					>LinkedIn</a
				>
			</div>
			<p class="footer-text">© {new Date().getFullYear()} Andy K Quinn. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	/* Container */
	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	/* Hero Section */
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: transparent;
	}

	.hero-content {
		text-align: center;
		z-index: 2;
		max-width: 900px;
		padding: 2rem;
	}

	.signature {
		font-family: 'Dancing Script', cursive;
		font-size: clamp(3rem, 10vw, 7rem);
		font-weight: 700;
		background: linear-gradient(
			120deg,
			#ffffff 0%,
			#ffffff 30%,
			#a78bfa 45%,
			#ec4899 55%,
			#ffffff 70%,
			#ffffff 100%
		);
		background-size: 200% 100%;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		line-height: 1.2;
		letter-spacing: -2px;
		animation: shimmer 4s ease-in-out infinite;
		filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.3));
	}

	@keyframes shimmer {
		0%,
		100% {
			background-position: 150% 0;
		}
		50% {
			background-position: -50% 0;
		}
	}
	.cta-section {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	/* Projects Section */
	.projects-section {
		padding: 8rem 0;
		background: var(--color-dark-bg);
	}

	.section-title {
		font-family: 'Inter', sans-serif;
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 700;
		color: white;
		margin: 0 0 4rem 0;
		text-align: center;
		letter-spacing: -1px;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2.5rem;
		margin-top: 3rem;
	}

	.project-card {
		position: relative;
		background: linear-gradient(145deg, rgba(30, 15, 60, 0.95), rgba(20, 10, 40, 0.95));
		padding: 0;
		border: 1px solid rgba(139, 92, 246, 0.25);
		border-radius: 16px;
		cursor: pointer;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		backdrop-filter: blur(10px);
	}

	.project-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(
			90deg,
			var(--color-accent-purple) 0%,
			var(--color-accent-pink) 100%
		);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.project-card::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at top right, rgba(139, 92, 246, 0.1), transparent 50%);
		opacity: 0;
		transition: opacity 0.5s ease;
		pointer-events: none;
	}

	.project-card:hover::before {
		transform: scaleX(1);
	}

	.project-card:hover::after {
		opacity: 1;
	}

	.project-card:hover {
		transform: translateY(-12px);
		border-color: rgba(139, 92, 246, 0.5);
		box-shadow:
			0 25px 50px rgba(139, 92, 246, 0.25),
			0 10px 30px rgba(236, 72, 153, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.card-icon {
		width: 100%;
		padding: 2rem 2rem 1.5rem 2rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card-icon :global(svg) {
		width: 80px;
		height: 80px;
		filter: drop-shadow(0 10px 20px rgba(139, 92, 246, 0.3));
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.project-card:hover .card-icon :global(svg) {
		transform: scale(1.1) rotate(5deg);
	}

	.current-badge {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
		border: 1px solid rgba(34, 197, 94, 0.4);
		border-radius: 20px;
		color: rgb(34, 197, 94);
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		z-index: 10;
		backdrop-filter: blur(10px);
		animation: pulse 2s ease-in-out infinite;
	}

	.current-badge svg {
		animation: spin 3s linear infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
		}
		50% {
			box-shadow: 0 0 20px 5px rgba(34, 197, 94, 0.2);
		}
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.card-content {
		padding: 0 2rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.card-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.project-title {
		font-family: 'Inter', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: white;
		margin: 0;
		line-height: 1.3;
		letter-spacing: -0.5px;
		padding-top: 1rem;
	}

	.project-company {
		font-family: 'Inter', sans-serif;
		font-size: 0.95rem;
		font-weight: 500;
		color: var(--color-accent-purple);
		margin: 0;
		letter-spacing: 0.3px;
	}

	.project-role {
		font-family: 'Inter', sans-serif;
		font-size: 0.85rem;
		font-weight: 400;
		color: rgba(167, 139, 250, 0.7);
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.project-description {
		font-family: 'Inter', sans-serif;
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--color-text-muted);
		margin: 0;
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.tech-badge {
		font-family: 'Inter', sans-serif;
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.4rem 0.8rem;
		background: rgba(139, 92, 246, 0.15);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 6px;
		color: rgba(167, 139, 250, 0.9);
		letter-spacing: 0.3px;
		transition: all 0.3s ease;
	}

	.project-card:hover .tech-badge {
		background: rgba(139, 92, 246, 0.25);
		border-color: rgba(139, 92, 246, 0.5);
		color: white;
	}

	.card-footer {
		padding: 2rem;
		border-top: 1px solid rgba(139, 92, 246, 0.15);
		margin-top: auto;
	}

	.view-project-btn {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
		border: 1px solid rgba(139, 92, 246, 0.4);
		border-radius: 8px;
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: 0.5px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.view-project-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			var(--color-accent-purple) 0%,
			var(--color-accent-pink) 100%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.view-project-btn span,
	.view-project-btn svg {
		position: relative;
		z-index: 1;
	}

	.view-project-btn:hover {
		transform: translateY(-2px);
		border-color: rgba(139, 92, 246, 0.8);
		box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
	}

	.view-project-btn:hover::before {
		opacity: 1;
	}

	.view-project-btn svg {
		transition: transform 0.3s ease;
	}

	.view-project-btn:hover svg {
		transform: translateX(4px);
	}

	/* Skills Section - 3D Infinite Carousels */
	.skills-section {
		padding: 8rem 0;
		background: linear-gradient(180deg, var(--color-deep-purple) 0%, #0a0015 100%);
		overflow: hidden;
	}

	.carousels-container {
		display: flex;
		flex-direction: column;
		gap: 6rem;
		margin-top: 4rem;
	}

	.carousel-section {
		width: 100%;
	}

	.carousel-title {
		font-family: 'Courier New', monospace;
		font-size: 2rem;
		font-weight: 900;
		color: white;
		text-transform: uppercase;
		letter-spacing: 4px;
		text-align: center;
		margin-bottom: 3rem;
		text-shadow:
			0 0 20px rgba(139, 92, 246, 0.8),
			0 0 40px rgba(236, 72, 153, 0.6),
			3px 3px 0 rgba(139, 92, 246, 0.4);
		background: linear-gradient(
			135deg,
			#ffffff 0%,
			var(--color-accent-purple) 50%,
			var(--color-accent-pink) 100%
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		position: relative;
	}

	.carousel-title::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 4px;
		background: linear-gradient(
			90deg,
			var(--color-accent-purple) 0%,
			var(--color-accent-pink) 100%
		);
		box-shadow:
			0 0 10px rgba(139, 92, 246, 0.8),
			0 0 20px rgba(236, 72, 153, 0.6);
	}

	.carousel-3d {
		position: relative;
		width: 100%;
		min-height: 200px;
		overflow: visible;
		padding: 150px 0 0 0;
		margin: -150px 0 0 0;
	}

	.carousel-track {
		display: flex;
		gap: 2rem;
		width: max-content;
		animation: scrollLeftSmooth 40s linear infinite;
		will-change: transform;
		position: relative;
		z-index: 1;
	}

	.backend-track {
		animation: scrollLeftSmooth 50s linear infinite;
	}

	.carousel-track.paused {
		animation-play-state: paused;
	}

	@keyframes scrollLeftSmooth {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-25%);
		}
	}

	.tech-card {
		position: relative;
		min-width: 200px;
		height: 160px;
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
		border: 2px solid rgba(139, 92, 246, 0.4);
		border-radius: 20px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		cursor: pointer;
		backdrop-filter: blur(10px);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.3),
			inset 0 0 20px rgba(139, 92, 246, 0.1);
		overflow: visible;
		z-index: 2;
		font-family: inherit;
		outline: none;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
		pointer-events: auto;
		transition: all 0.3s ease;
	}

	.tech-card:hover,
	.tech-card:focus-visible {
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%);
		border-color: rgba(139, 92, 246, 0.8);
		z-index: 1000;
		transform: scale(1.05);
	}

	.tech-icon {
		font-size: 3.5rem;
		filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
	}

	.tech-name {
		font-family: 'Inter', sans-serif;
		font-size: 1.2rem;
		font-weight: 700;
		color: white;
		text-align: center;
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
		letter-spacing: 0.5px;
	}

	.tooltip {
		position: fixed;
		transform: translate(-50%, calc(-100% - 1rem));
		z-index: 10000;
		pointer-events: none;
		animation: tooltipFadeIn 0.2s ease-out;
	}

	@keyframes tooltipFadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-100% - 0.5rem));
		}
		to {
			opacity: 1;
			transform: translate(-50%, calc(-100% - 1rem));
		}
	}

	.tooltip-content {
		background: linear-gradient(145deg, #1a0a2e 0%, #2d1b4e 100%);
		border: 2px solid rgba(139, 92, 246, 0.6);
		border-radius: 12px;
		padding: 1.25rem 1.5rem;
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.6),
			0 0 20px rgba(139, 92, 246, 0.4),
			inset 0 0 20px rgba(139, 92, 246, 0.1);
		min-width: 280px;
		max-width: 350px;
		position: relative;
		backdrop-filter: blur(20px);
	}

	.tooltip-content::before {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 10px solid transparent;
		border-top-color: rgba(139, 92, 246, 0.6);
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	.tooltip-content::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-pink));
		border-radius: 12px 12px 0 0;
	}

	.tooltip-content strong {
		display: block;
		font-size: 1.1rem;
		font-weight: 700;
		color: white;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: none;
	}

	.tooltip-content p {
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
	}

	/* Footer */
	/* Scroll Indicator */
	.scroll-indicator {
		position: absolute;
		bottom: 2.5rem;
		left: 50%;
		transform: translateX(-50%);
		background: none;
		border: none;
		cursor: pointer;
		padding: 1rem;
		transition: all 0.3s ease;
	}

	.scroll-indicator:hover .chevron-stack {
		transform: translateY(-3px);
	}

	.scroll-indicator:hover .chevron {
		filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.8));
	}

	.chevron-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: -8px;
		transition: all 0.3s ease;
	}

	.chevron {
		width: 32px;
		height: 32px;
		color: rgba(139, 92, 246, 0.7);
		transition: all 0.3s ease;
		animation: chevronFlow 2s ease-in-out infinite;
	}

	.chevron-1 {
		animation-delay: 0s;
	}

	.chevron-2 {
		animation-delay: 0.3s;
		color: rgba(139, 92, 246, 0.5);
	}

	.chevron-3 {
		animation-delay: 0.6s;
		color: rgba(139, 92, 246, 0.3);
	}

	@keyframes chevronFlow {
		0%,
		100% {
			opacity: 0.3;
			transform: translateY(0px);
		}
		50% {
			opacity: 1;
			transform: translateY(8px);
		}
	}

	.site-footer {
		background: rgba(10, 10, 10, 0.95);
		padding: 2rem 0;
		border-top: 1px solid rgba(139, 92, 246, 0.2);
	}

	.footer-content {
		text-align: center;
	}

	.footer-social {
		display: flex;
		gap: 2rem;
		justify-content: center;
		margin-bottom: 1.5rem;
	}

	.footer-social a {
		color: var(--color-text-muted);
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: 0.85rem;
		transition: color 0.3s ease;
	}

	.footer-social a:hover {
		background: linear-gradient(
			135deg,
			var(--color-accent-purple) 0%,
			var(--color-accent-pink) 100%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.footer-text {
		color: var(--color-text-muted);
		font-size: 0.85rem;
		margin: 0;
	}

	/* Mobile Responsiveness */
	@media (max-width: 1024px) {
		.projects-grid {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
			gap: 2rem;
		}
	}

	@media (max-width: 768px) {
		.container {
			padding: 0 1rem;
		}

		.scroll-indicator {
			bottom: 1rem;
			padding: 0.5rem;
		}

		.chevron {
			width: 24px;
			height: 24px;
		}

		.hero {
			min-height: 100vh;
			padding: 1rem;
		}

		.hero-content {
			padding: 1.5rem;
			max-width: 100%;
		}

		.signature {
			font-size: clamp(3.5rem, 16vw, 6rem);
			margin: 0 0 2.5rem 0;
		}

		.cta-section {
			flex-direction: column;
			align-items: center;
			gap: 1.5rem;
			width: 100%;
		}

		.cta-section :global(.button) {
			width: 100%;
			max-width: 350px;
			font-size: 1.1rem;
			padding: 1.2rem 2rem;
		}

		.projects-section,
		.skills-section {
			padding: 5rem 0;
		}

		.section-title {
			font-size: clamp(3rem, 10vw, 4rem);
			margin: 0 0 3rem 0;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 2.5rem;
			padding: 0 1rem;
		}

		.project-card {
			min-width: 0;
		}

		.card-icon :global(svg) {
			width: 90px;
			height: 90px;
		}

		.card-icon {
			padding: 2.5rem 2rem 2rem 2rem;
		}

		.card-content {
			padding: 0 2rem;
			gap: 1.5rem;
		}

		.card-footer {
			padding: 2rem;
		}

		.project-title {
			font-size: 1.75rem;
		}

		.project-company {
			font-size: 1.15rem;
		}

		.project-role {
			font-size: 1rem;
		}

		.project-description {
			font-size: 1.15rem;
			line-height: 1.7;
		}

		.tech-badge {
			font-size: 0.9rem;
			padding: 0.5rem 1rem;
		}

		.view-project-btn {
			font-size: 1.1rem;
			padding: 1.2rem 1.75rem;
		}

		.site-footer {
			padding: 3rem 0;
		}

		.footer-social {
			flex-wrap: wrap;
			gap: 2rem;
		}

		.footer-social a {
			font-size: 1.05rem;
		}

		.footer-text {
			font-size: 1rem;
		}
	}

	@media (max-width: 480px) {
		.hero {
			min-height: 80vh;
		}

		.scroll-indicator {
			bottom: 0.5rem;
			padding: 0.5rem;
		}

		.chevron {
			width: 20px;
			height: 20px;
		}

		.hero-content {
			padding: 1rem;
		}

		.signature {
			font-size: clamp(3rem, 14vw, 5rem);
			margin: 0 0 2rem 0;
			letter-spacing: -1px;
		}

		.cta-section :global(.button) {
			font-size: 1.05rem;
			padding: 1.1rem 1.75rem;
		}

		.container {
			padding: 0 1rem;
		}

		.projects-section,
		.skills-section {
			padding: 4rem 0;
		}

		.section-title {
			font-size: clamp(2.5rem, 9vw, 3.5rem);
			margin: 0 0 2.5rem 0;
		}

		.projects-grid {
			gap: 2rem;
			padding: 0 0.75rem;
		}

		.project-card {
			border-radius: 12px;
		}

		.card-icon {
			padding: 2rem 2rem 1.5rem 2rem;
		}

		.card-icon :global(svg) {
			width: 80px;
			height: 80px;
		}

		.card-content {
			padding: 0 1.5rem;
			gap: 1.25rem;
		}

		.card-footer {
			padding: 1.75rem;
		}

		.project-title {
			font-size: 1.5rem;
		}

		.project-company {
			font-size: 1.05rem;
		}

		.project-role {
			font-size: 0.95rem;
		}

		.project-description {
			font-size: 1.05rem;
			line-height: 1.65;
		}

		.tech-stack {
			gap: 0.5rem;
		}

		.tech-badge {
			font-size: 0.85rem;
			padding: 0.45rem 0.85rem;
		}

		.view-project-btn {
			padding: 1.1rem 1.5rem;
			font-size: 1.05rem;
		}

		.footer-social {
			flex-direction: column;
			align-items: center;
			gap: 1.25rem;
		}

		.footer-social a {
			font-size: 1rem;
		}

		.footer-text {
			font-size: 0.95rem;
		}
	}

	/* Reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		.project-card {
			transition: none;
			animation: none;
		}
	}

	/* ============================================ */
	/* RETRO FUTURISTIC MODAL STYLES */
	/* ============================================ */

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.92);
		backdrop-filter: blur(8px);
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		animation: fadeIn 0.3s ease-out;
		overflow: hidden;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		position: relative;
		width: 100%;
		max-width: 900px;
		max-height: 90vh;
		background: linear-gradient(145deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%);
		border: 3px solid #8b5cf6;
		border-radius: 0;
		box-shadow:
			0 0 60px rgba(139, 92, 246, 0.4),
			0 0 120px rgba(236, 72, 153, 0.3),
			inset 0 0 100px rgba(139, 92, 246, 0.1);
		overflow: hidden;
		animation: modalSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		font-family: 'Courier New', monospace;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	@keyframes modalSlideIn {
		from {
			transform: scale(0.8) translateY(-50px);
			opacity: 0;
		}
		to {
			transform: scale(1) translateY(0);
			opacity: 1;
		}
	}

	/* CRT Screen Effect */
	.crt-effect {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			rgba(139, 92, 246, 0.03) 0px,
			transparent 1px,
			transparent 2px,
			rgba(139, 92, 246, 0.03) 3px
		);
		pointer-events: none;
		z-index: 10;
		animation: flicker 0.15s infinite;
	}

	@keyframes flicker {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.96;
		}
	}

	/* Scanlines */
	.scanlines {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, transparent 50%, rgba(139, 92, 246, 0.02) 50%);
		background-size: 100% 4px;
		pointer-events: none;
		z-index: 9;
		animation: scan 8s linear infinite;
	}

	@keyframes scan {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(4px);
		}
	}

	/* Terminal Header */
	.modal-header {
		border-bottom: 2px solid #8b5cf6;
		background: linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%);
		box-shadow: 0 2px 20px rgba(139, 92, 246, 0.3);
	}

	.terminal-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		position: relative;
	}

	.terminal-buttons {
		display: flex;
		gap: 0.5rem;
		z-index: 11;
	}

	.terminal-btn {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid rgba(0, 0, 0, 0.3);
	}

	.terminal-btn.red {
		background: #ff5f56;
		box-shadow: 0 0 10px rgba(255, 95, 86, 0.5);
	}

	.terminal-btn.yellow {
		background: #ffbd2e;
		box-shadow: 0 0 10px rgba(255, 189, 46, 0.5);
	}

	.terminal-btn.green {
		background: #27c93f;
		box-shadow: 0 0 10px rgba(39, 201, 63, 0.5);
	}

	.terminal-title {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Courier New', monospace;
		font-size: 0.85rem;
		font-weight: bold;
		color: #a78bfa;
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.7);
		letter-spacing: 2px;
		z-index: 11;
	}

	.close-btn {
		background: transparent;
		border: 1px solid #8b5cf6;
		color: #a78bfa;
		padding: 0.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		z-index: 11;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-btn:hover {
		background: #8b5cf6;
		color: #ffffff;
		box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
		transform: rotate(90deg);
	}

	/* Modal Body */
	.modal-body {
		padding: 2rem;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		z-index: 11;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		min-height: 0;
	}

	.modal-body::-webkit-scrollbar {
		width: 12px;
	}

	.modal-body::-webkit-scrollbar-track {
		background: #0a0a0a;
		border-left: 2px solid #8b5cf6;
	}

	.modal-body::-webkit-scrollbar-thumb {
		background: #8b5cf6;
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
	}

	/* Achievement Header */
	.achievement-header {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
		padding: 2rem;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%);
		border: 2px solid #8b5cf6;
	}

	.achievement-icon {
		flex-shrink: 0;
	}

	.achievement-icon :global(svg) {
		width: 100px;
		height: 100px;
		filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
		animation: rotate3d 4s ease-in-out infinite;
	}

	@keyframes rotate3d {
		0%,
		100% {
			transform: rotateY(0deg) scale(1);
		}
		50% {
			transform: rotateY(180deg) scale(1.1);
		}
	}

	.achievement-unlocked {
		flex: 1;
	}

	.achievement-label {
		display: block;
		font-size: 0.75rem;
		color: #a78bfa;
		font-weight: bold;
		letter-spacing: 3px;
		margin-bottom: 0.5rem;
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
	}

	.achievement-title {
		font-size: 2rem;
		color: #fff;
		font-weight: bold;
		margin: 0;
		text-shadow:
			0 0 20px rgba(139, 92, 246, 0.6),
			2px 2px 0 rgba(236, 72, 153, 0.4);
		font-family: 'Courier New', monospace;
	}

	/* Stats Panel */
	.stats-panel {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-item {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border: 2px solid rgba(139, 92, 246, 0.4);
		padding: 1.5rem;
		text-align: center;
		transition: all 0.3s ease;
	}

	.stat-item:hover {
		border-color: #8b5cf6;
		box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
		transform: translateY(-5px);
	}

	.stat-label {
		font-size: 0.7rem;
		color: #a78bfa;
		font-weight: bold;
		letter-spacing: 2px;
		margin-bottom: 0.75rem;
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.6);
	}

	.stat-value {
		font-size: 1.25rem;
		color: #fff;
		font-weight: bold;
		font-family: 'Courier New', monospace;
		text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	/* Mission Briefing */
	.mission-briefing {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: rgba(139, 92, 246, 0.05);
		border-left: 4px solid #8b5cf6;
	}

	.briefing-title {
		font-size: 1.25rem;
		color: #a78bfa;
		margin: 0 0 1rem 0;
		font-weight: bold;
		letter-spacing: 2px;
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
		font-family: 'Courier New', monospace;
	}

	.briefing-text {
		font-size: 1rem;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.8;
		margin: 0 0 1rem 0;
		font-family: 'Courier New', monospace;
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
	}

	/* Power-ups Section */
	.powerups-section {
		margin-bottom: 2rem;
	}

	.powerups-title {
		font-size: 1.25rem;
		color: #a78bfa;
		margin: 0 0 1.5rem 0;
		font-weight: bold;
		letter-spacing: 2px;
		text-shadow: 0 0 10px rgba(139, 92, 246, 0.8);
		font-family: 'Courier New', monospace;
	}

	.powerups-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	.powerup-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 1.25rem;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%);
		border: 2px solid rgba(139, 92, 246, 0.3);
		transition: all 0.3s ease;
	}

	.powerup-item:hover {
		border-color: #8b5cf6;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
		box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
		transform: translateY(-5px) scale(1.05);
	}

	.powerup-icon {
		width: 40px;
		height: 40px;
		color: #a78bfa;
		filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.6));
	}

	.powerup-name {
		font-size: 0.85rem;
		color: #fff;
		font-weight: bold;
		text-align: center;
		font-family: 'Courier New', monospace;
		letter-spacing: 1px;
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
	}

	@keyframes progressFill {
		from {
			width: 0%;
		}
		to {
			width: 100%;
		}
	}

	@keyframes progressShimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* Mobile Styles for Modal */
	@media (max-width: 768px) {
		.modal-overlay {
			padding: 1rem;
		}

		.modal-container {
			max-height: 95vh;
		}

		.modal-body {
			padding: 1.5rem;
		}

		.achievement-header {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
			padding: 1.5rem;
		}

		.achievement-icon :global(svg) {
			width: 80px;
			height: 80px;
		}

		.achievement-title {
			font-size: 1.5rem;
		}

		.stats-panel {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.powerups-grid {
			grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
			gap: 0.75rem;
		}

		.powerup-item {
			padding: 1rem;
		}

		.terminal-title {
			font-size: 0.65rem;
			letter-spacing: 1px;
		}
	}

	@media (max-width: 480px) {
		.modal-overlay {
			padding: 0.5rem;
			align-items: flex-start;
		}

		.modal-container {
			max-height: calc(100vh - 1rem);
			margin-top: 0.5rem;
		}

		.modal-body {
			padding: 1rem;
			max-height: calc(100vh - 8rem);
		}

		.achievement-header {
			padding: 1rem;
		}

		.achievement-icon :global(svg) {
			width: 60px;
			height: 60px;
		}

		.achievement-title {
			font-size: 1.25rem;
		}

		.briefing-title,
		.powerups-title {
			font-size: 1rem;
		}

		.powerups-grid {
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		}
	}
</style>
