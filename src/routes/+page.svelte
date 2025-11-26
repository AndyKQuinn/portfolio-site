<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Lenis from 'lenis';
	import Button from '../components/Button.svelte';

	let heroSection: HTMLElement;
	let signatureText: HTMLElement;

	const projects = [
		{
			title: 'E-Commerce Admin Platform',
			company: 'Online Retail Company',
			role: 'Full-Stack Engineer',
			description: 'Built a comprehensive admin interface for managing products, inventory, and orders at scale using modern web technologies.',
			tech: ['React', 'TypeScript', 'GraphQL', 'Node.js'],
			iconSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="64" height="64" rx="12" fill="url(#grad1)"/>
				<path d="M20 24L26 18L38 18L44 24V44C44 45.1046 43.1046 46 42 46H22C20.8954 46 20 45.1046 20 44V24Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M26 18V16C26 14.8954 26.8954 14 28 14H36C37.1046 14 38 14.8954 38 16V18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<circle cx="32" cy="32" r="4" stroke="white" stroke-width="2"/>
				<defs>
					<linearGradient id="grad1" x1="0" y1="0" x2="64" y2="64">
						<stop offset="0%" stop-color="#9333ea"/>
						<stop offset="100%" stop-color="#ec4899"/>
					</linearGradient>
				</defs>
			</svg>`,
			gradient: 'from-purple-600 to-pink-600'
		},
		{
			title: 'Engineering Coach',
			company: 'Major Financial Institution',
			role: 'Software Engineering Coach',
			description: 'Mentored development teams across multiple languages and technologies, focusing on DevOps best practices and cloud infrastructure.',
			tech: ['Python', 'Node.js', 'Golang', 'Kubernetes', 'Helm'],
			iconSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="64" height="64" rx="12" fill="url(#grad2)"/>
				<rect x="16" y="20" width="32" height="28" rx="2" stroke="white" stroke-width="2"/>
				<path d="M16 26H48" stroke="white" stroke-width="2"/>
				<rect x="22" y="30" width="6" height="4" rx="1" fill="white"/>
				<rect x="22" y="38" width="6" height="4" rx="1" fill="white"/>
				<rect x="32" y="30" width="10" height="4" rx="1" fill="white"/>
				<rect x="32" y="38" width="10" height="4" rx="1" fill="white"/>
				<defs>
					<linearGradient id="grad2" x1="0" y1="0" x2="64" y2="64">
						<stop offset="0%" stop-color="#6366f1"/>
						<stop offset="100%" stop-color="#8b5cf6"/>
					</linearGradient>
				</defs>
			</svg>`,
			gradient: 'from-indigo-600 to-purple-600'
		},
		{
			title: 'Notification Platform',
			company: 'Brick & Mortar Retail',
			role: 'Senior DevOps Engineer',
			description: 'Architected and maintained a high-throughput notification platform serving millions of users daily with enterprise-grade reliability.',
			tech: ['Node.js', 'Golang', 'Kubernetes', 'Docker', 'CI/CD'],
			iconSvg: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="64" height="64" rx="12" fill="url(#grad3)"/>
				<path d="M32 18C32 18 26 22 26 28V38L22 42H42L38 38V28C38 22 32 18 32 18Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M29 42V44C29 45.6569 30.3431 47 32 47C33.6569 47 35 45.6569 35 44V42" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				<circle cx="42" cy="24" r="4" fill="white"/>
				<defs>
					<linearGradient id="grad3" x1="0" y1="0" x2="64" y2="64">
						<stop offset="0%" stop-color="#ec4899"/>
						<stop offset="100%" stop-color="#f43f5e"/>
					</linearGradient>
				</defs>
			</svg>`,
			gradient: 'from-pink-600 to-rose-600'
		}
	];

	const skills = [
		'JavaScript', 'TypeScript', 'Python', 'SvelteKit', 'React', 'Node.js',
		'PostgreSQL', 'Docker', 'AWS', 'Git', 'CI/CD', 'Agile'
	];

	onMount(() => {
		// Initialize Lenis Smooth Scroll
		const lenis = new Lenis({
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
		gsap.fromTo('.signature',
			{ opacity: 0, x: 100, scale: 0.9 },
			{ opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power2.out" }
		);

		gsap.fromTo('.tagline',
			{ opacity: 0, x: 80 },
			{ opacity: 1, x: 0, duration: 0.7, delay: 0.2, ease: "power2.out" }
		);

		gsap.fromTo('.cta-section',
			{ opacity: 0, x: 60 },
			{ opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: "power2.out" }
		);

		// Animate project cards on scroll
		gsap.fromTo('.project-card',
			{ opacity: 0, y: 50 },
			{
				opacity: 1,
				y: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out",
				scrollTrigger: {
					trigger: '.projects-grid',
					start: 'top 80%'
				}
			}
		);

		// Cleanup
		return () => {
			lenis.destroy();
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	});
</script>

<svelte:head>
	<title>Andy K Quinn - Professional Developer & Diversity Advocate</title>
	<meta name="description" content="Andy K Quinn - Professional Developer & Diversity Advocate" />
	<link rel="stylesheet" href="https://unpkg.com/lenis@1.0.45/dist/lenis.css">
</svelte:head>

<!-- Hero Section -->
<section class="hero" bind:this={heroSection}>
	<div class="hero-content">
		<h1 class="signature" bind:this={signatureText}>
			Andy K Quinn
		</h1>

		<p class="tagline">
			Redefining possibilities, building impactful solutions,<br />
			championing diversity in tech.
		</p>

		<div class="cta-section">
			<Button label="Learn More" href="/about" />
			<Button label="Get In Touch" href="/contact" />
		</div>
	</div>
</section>

<!-- Projects Showcase -->
<section class="projects-section">
	<div class="container">
		<h2 class="section-title">Featured Work</h2>

		<div class="projects-grid">
			{#each projects as project, i}
				<div class="project-card">
					<div class="card-icon">
						{@html project.iconSvg}
					</div>
					<div class="card-content">
						<div class="card-header">
							<h3 class="project-title">{project.title}</h3>
							<p class="project-company">{project.company}</p>
							<p class="project-role">{project.role}</p>
						</div>
						<p class="project-description">{project.description}</p>
						<div class="tech-stack">
							{#each project.tech as tech}
								<span class="tech-badge">{tech}</span>
							{/each}
						</div>
					</div>
					<div class="card-footer">
						<button class="view-project-btn">
							<span>View Details</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

		<div class="skills-grid">
			{#each skills as skill}
				<div class="skill-tag">
					{skill}
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Footer -->
<footer class="site-footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-social">
				<a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
				<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
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
		margin: 0 0 3.5rem 0;
		line-height: 1.2;
		letter-spacing: -2px;
		animation: shimmer 4s ease-in-out infinite;
		filter: drop-shadow(0 0 30px rgba(167, 139, 250, 0.3));
		padding-bottom: 0.5rem;
	}

	@keyframes shimmer {
		0%, 100% {
			background-position: 150% 0;
		}
		50% {
			background-position: -50% 0;
		}
	}

	.tagline {
		font-family: 'Inter', sans-serif;
		font-size: clamp(1.1rem, 2.5vw, 1.5rem);
		font-weight: 300;
		color: var(--color-text-muted);
		margin: 0 0 3rem 0;
		line-height: 1.6;
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
		transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
		background: linear-gradient(90deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
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

	/* Skills Section */
	.skills-section {
		padding: 6rem 0;
		background: var(--color-deep-purple);
	}

	.skills-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-top: 3rem;
	}

	.skill-tag {
		padding: 1rem 2rem;
		background: transparent;
		border: 2px solid rgba(139, 92, 246, 0.4);
		color: var(--color-text-light);
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		font-size: 0.95rem;
		letter-spacing: 0.5px;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.skill-tag:hover {
		border-color: transparent;
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		color: white;
		transform: translateY(-3px);
		box-shadow: 0 5px 15px rgba(139, 92, 246, 0.5);
	}

	/* Footer */
	.site-footer {
		background: var(--color-dark-bg);
		padding: 3rem 0;
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
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
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
	@media (max-width: 768px) {
		.container {
			padding: 0 1.5rem;
		}

		.hero-content {
			padding: 1rem;
		}

		.signature {
			font-size: clamp(2.5rem, 12vw, 4rem);
		}

		.tagline {
			font-size: clamp(1rem, 4vw, 1.3rem);
		}

		.cta-section {
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}

		.projects-section,
		.skills-section {
			padding: 4rem 0;
		}

		.section-title {
			font-size: clamp(2rem, 8vw, 3rem);
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}
	}

	/* Reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		.project-card,
		.skill-tag {
			transition: none;
			animation: none;
		}
	}
</style>