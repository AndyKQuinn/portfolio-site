<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let { children } = $props();
	let scrollY = 0;
	let windowHeight = 0;
	let isVisible: Record<string, boolean> = {};
	let parallaxElements: Record<string, HTMLElement | undefined> = {};

	// Carousel state
	let currentPillarIndex = $state(0);
	let carouselContainer: HTMLElement;

	// Carousel navigation functions
	function nextPillar() {
		currentPillarIndex = (currentPillarIndex + 1) % skillPillars.length;
	}

	function prevPillar() {
		currentPillarIndex = currentPillarIndex === 0 ? skillPillars.length - 1 : currentPillarIndex - 1;
	}

	function goToPillar(index: number) {
		currentPillarIndex = index;
	}

	// Skills pillars data
	const skillPillars = [
		{
			title: 'Design & UX',
			description: 'Creating intuitive and beautiful user experiences',
			icon: '🎨',
			skills: [
				'User Interface Design',
				'User Experience Research',
				'Prototyping & Wireframing',
				'Design Systems',
				'Accessibility Design',
				'Visual Design'
			]
		},
		{
			title: 'Development Operations',
			description: 'Building scalable and maintainable applications',
			icon: '⚙️',
			skills: [
				'Full-Stack Development',
				'TypeScript & JavaScript',
				'React & Svelte',
				'Node.js & Python',
				'API Design & Integration',
				'Database Design'
			]
		},
		{
			title: 'Infrastructure & Operations',
			description: 'Deploying and managing robust systems',
			icon: '☁️',
			skills: [
				'Cloud Architecture',
				'CI/CD Pipelines',
				'Containerization',
				'Monitoring & Analytics',
				'Security Implementation',
				'Performance Optimization'
			]
		}
	];

	// Experience data
	const experience = [
		{
			title: 'Senior Full Stack Developer',
			company: 'Tech Innovations Inc.',
			period: '2022 - Present',
			description: 'Leading development of scalable web applications using modern frameworks and cloud technologies.'
		},
		{
			title: 'Frontend Developer',
			company: 'Creative Solutions Ltd.',
			period: '2020 - 2022',
			description: 'Built responsive user interfaces and collaborated with design teams to create exceptional user experiences.'
		},
		{
			title: 'Junior Developer',
			company: 'Startup Ventures',
			period: '2019 - 2020',
			description: 'Developed and maintained web applications while learning modern development practices and tools.'
		}
	];

	// Education data
	const education = [
		{
			degree: 'Bachelor of Computer Science',
			school: 'University of Technology',
			year: '2019',
			description: 'Specialized in software engineering and human-computer interaction'
		}
	];

	onMount(() => {
		windowHeight = window.innerHeight;

		const handleScroll = () => {
			scrollY = window.scrollY;
			// Update parallax elements
			Object.keys(parallaxElements).forEach(key => {
				const element = parallaxElements[key];
				if (element) {
					const speed = key === 'hero' ? 0.5 : 0.3;
					element.style.transform = `translateY(${scrollY * speed}px)`;
				}
			});
		};

		const handleResize = () => {
			windowHeight = window.innerHeight;
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					const section = (entry.target as HTMLElement).dataset.section;
					if (section) {
						isVisible[section] = entry.isIntersecting;
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observe sections after component mounts
		setTimeout(() => {
			document.querySelectorAll('[data-section]').forEach(el => {
				observer.observe(el);
			});
		}, 100);

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			observer.disconnect();
		};
	});

</script>

<svelte:head>
	<title>About Me - Portfolio</title>
	<meta name="description" content="Learn more about my journey as a developer and my passion for creating exceptional digital experiences." />
</svelte:head>

<!-- Hero Section with Parallax -->
<section class="hero-section" bind:this={parallaxElements.hero}>
	<div class="hero-content">
		<div class="hero-text" data-section="hero" in:fly={{ y: 100, duration: 1000, easing: quintOut }}>
			<h1>About Me</h1>
			<p class="hero-subtitle">Passionate Developer & Digital Creator</p>
		</div>
		<div class="hero-image" in:scale={{ duration: 1200, delay: 300, easing: quintOut }}>
			<div class="profile-placeholder">
				<img src="/andy_headshot_01.png" alt="Andy Quinn" />
			</div>
		</div>
	</div>
	<div class="scroll-indicator">
		<div class="scroll-arrow"></div>
	</div>
</section>

<!-- About Section -->
<section class="about-section" data-section="about">
	<div class="container">
		<div class="section-header" in:fly={{ y: 50, duration: 800, delay: 200 }}>
			<h2>My Story</h2>
			<div class="section-divider"></div>
		</div>
		<div class="about-content" in:fade={{ duration: 1000, delay: 400 }}>
			<div class="about-text">
				<p>
					I'm a passionate full-stack developer and educator that favors TypeScript but also enjoys Python and Golang. My focus is building performant, scalable experiences with emphasis on documentation and welcoming user experiences.
				</p>
				<p>
					I believe in the power of technology to transform ideas into reality. Whether it's building
					scalable web applications, designing intuitive user interfaces, or exploring the latest in
					cloud technologies, I'm always eager to learn and grow and actively pursue new learning opportunities.
				</p>
				<p>
					I am also the founder of Uplift Collective, a community of individuals who are passionate about using technology to uplift and empower others. I am also a proud supporter of the LGBTQIA+ community and a staunch advocate for diversity and inclusion.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Skills Section -->
<section class="skills-section" data-section="skills">
	<div class="container">
		<div class="section-header" in:fly={{ y: 50, duration: 800 }}>
			<h2>Skills & Expertise</h2>
			<div class="section-divider"></div>
		</div>
		<div class="carousel-container">
			<div class="carousel-wrapper" bind:this={carouselContainer}>
				<div class="carousel-track" style="transform: translateX(-{currentPillarIndex * 100}%)">
					{#each skillPillars as pillar, index}
						<div class="pillar-card">
							<div class="pillar-header">
								<div class="pillar-icon">{pillar.icon}</div>
								<h3>{pillar.title}</h3>
								<p class="pillar-description">{pillar.description}</p>
							</div>
							<div class="pillar-skills">
								{#each pillar.skills as skill, skillIndex}
									<div class="skill-item" style="animation-delay: {skillIndex * 0.1}s">
										<span class="skill-text">{skill}</span>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Navigation Controls -->
			<div class="carousel-controls">
				<button class="carousel-btn prev-btn" onclick={prevPillar} aria-label="Previous skill pillar">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>

				<div class="carousel-indicators">
					{#each skillPillars as _, index}
						<button
							class="indicator {currentPillarIndex === index ? 'active' : ''}"
							onclick={() => goToPillar(index)}
							aria-label="Go to {skillPillars[index].title}"
						></button>
					{/each}
				</div>

				<button class="carousel-btn next-btn" onclick={nextPillar} aria-label="Next skill pillar">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</section>

<!-- Experience Section -->
<section class="experience-section" data-section="experience">
	<div class="container">
		<div class="section-header" in:fly={{ y: 50, duration: 800 }}>
			<h2>Professional Experience</h2>
			<div class="section-divider"></div>
		</div>
		<div class="timeline">
			{#each experience as job, index}
				<div class="timeline-item"
					in:fly={{ x: index % 2 === 0 ? -100 : 100, duration: 800, delay: index * 200 }}>
					<div class="timeline-marker"></div>
					<div class="timeline-content">
						<div class="job-period">{job.period}</div>
						<h3>{job.title}</h3>
						<h4>{job.company}</h4>
						<p>{job.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Education Section -->
<section class="education-section" data-section="education">
	<div class="container">
		<div class="section-header" in:fly={{ y: 50, duration: 800 }}>
			<h2>Education</h2>
			<div class="section-divider"></div>
		</div>
		<div class="education-grid">
			{#each education as edu, index}
				<div class="education-card"
					in:fly={{ y: 50, duration: 600, delay: index * 200 }}>
					<div class="education-year">{edu.year}</div>
					<h3>{edu.degree}</h3>
					<h4>{edu.school}</h4>
					<p>{edu.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Call to Action -->
<section class="cta-section" data-section="cta">
	<div class="container">
		<div class="cta-content" in:fade={{ duration: 800, delay: 200 }}>
			<h2>Let's Work Together</h2>
			<p>I'm always excited to take on new challenges and collaborate on interesting projects.</p>
			<div class="cta-buttons">
				<a href="/contact" class="btn btn-primary">Contact Me</a>
			</div>
		</div>
	</div>
</section>

<style>
	/* Hero Section */
	.hero-section {
		height: 100vh;
		background: transparent;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding-top: 80px; /* Account for fixed header */
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: transparent;
		animation: float 20s ease-in-out infinite;
	}

	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-20px) rotate(2deg); }
	}

	.hero-content {
		display: flex;
		align-items: center;
		gap: 4rem;
		max-width: 1200px;
		width: 100%;
		padding: 0 2rem;
		z-index: 2;
		position: relative;
	}

	.hero-text {
		flex: 1;
		color: white;
	}

	.hero-text h1 {
		font-size: 4rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		background: linear-gradient(45deg, #fff, #e0e7ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1.1;
	}

	.hero-subtitle {
		font-size: 1.5rem;
		opacity: 0.9;
		margin: 0;
		font-weight: 300;
	}

	.hero-image {
		flex: 1;
		display: flex;
		justify-content: center;
	}

	.profile-placeholder {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
		border: 3px solid rgba(255, 255, 255, 0.3);
		backdrop-filter: blur(10px);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.2rem;
		color: white;
		position: relative;
		overflow: hidden;
	}

	.profile-placeholder::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: conic-gradient(transparent, rgba(255, 255, 255, 0.1), transparent);
		animation: rotate 4s linear infinite;
	}

	@keyframes rotate {
		100% { transform: rotate(360deg); }
	}

	.scroll-indicator {
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		color: white;
		opacity: 0.7;
		animation: bounce 2s infinite;
	}

	.scroll-arrow {
		width: 24px;
		height: 24px;
		border-right: 2px solid white;
		border-bottom: 2px solid white;
		transform: rotate(45deg);
		margin: 0 auto;
	}

	@keyframes bounce {
		0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
		40% { transform: translateX(-50%) translateY(-10px); }
		60% { transform: translateX(-50%) translateY(-5px); }
	}

	/* Container */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	/* Section Styles */
	.about-section, .skills-section, .experience-section, .education-section, .cta-section {
		padding: 6rem 0;
		position: relative;
	}

	.about-section {
		background: transparent;
		color: var(--color-text-light);
	}

	.about-text p {
		color: var(--color-text-muted);
	}

	.skills-section {
		background: transparent;
	}

	.experience-section {
		background: transparent;
		color: white;
	}

	.education-section {
		background: transparent;
	}

	.cta-section {
		background: transparent;
		color: white;
		text-align: center;
	}

	/* Section Headers */
	.section-header {
		text-align: center;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		font-size: 3rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		position: relative;
	}

	.experience-section .section-header h2 {
		color: white;
	}

	.section-divider {
		width: 80px;
		height: 4px;
		background: linear-gradient(90deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		margin: 0 auto;
		border-radius: 2px;
	}

	/* About Content */
	.about-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.about-text p {
		font-size: 1.1rem;
		line-height: 1.8;
		margin-bottom: 1.5rem;
		color: #4a5568;
	}

	/* Skills Carousel */
	.carousel-container {
		max-width: 800px;
		margin: 0 auto;
		position: relative;
	}

	.carousel-wrapper {
		overflow: hidden;
		border-radius: 24px;
		position: relative;
	}

	.carousel-track {
		display: flex;
		transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform;
	}

	.pillar-card {
		background: linear-gradient(145deg, var(--color-dark-purple) 0%, var(--color-deep-purple) 100%);
		padding: 3rem 2rem;
		border-radius: 24px;
		box-shadow:
			0 20px 40px rgba(139, 92, 246, 0.2),
			0 4px 12px rgba(139, 92, 246, 0.1);
		border: 1px solid rgba(139, 92, 246, 0.3);
		position: relative;
		overflow: hidden;
		flex: 0 0 100%;
		width: 100%;
	}

	.pillar-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-pink));
		border-radius: 24px 24px 0 0;
	}

	/* Carousel Controls */
	.carousel-controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		margin-top: 3rem;
	}

	.carousel-btn {
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		border: none;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
	}

	.carousel-btn:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
	}

	.carousel-btn:active {
		transform: scale(0.95);
	}

	.carousel-indicators {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		background: rgba(102, 126, 234, 0.3);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.indicator.active {
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		transform: scale(1.3);
	}

	.indicator:hover {
		background: rgba(102, 126, 234, 0.6);
		transform: scale(1.1);
	}

	.pillar-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.pillar-icon {
		font-size: 3.5rem;
		margin-bottom: 1.5rem;
		display: block;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
	}

	.pillar-card h3 {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		line-height: 1.2;
	}

	.pillar-description {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		line-height: 1.6;
		margin: 0;
		font-weight: 400;
	}

	.pillar-skills {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.skill-item {
		position: relative;
		padding: 1.2rem 1rem;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border-radius: 12px;
		border: 1px solid rgba(139, 92, 246, 0.3);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		transform: translateY(0);
		animation: slideInUp 0.6s ease-out forwards;
		opacity: 0;
	}

	.skill-item:nth-child(odd) {
		transform: translateX(-20px);
	}

	.skill-item:nth-child(even) {
		transform: translateX(20px);
	}

	.skill-item:hover {
		transform: translateY(-8px) scale(1.02);
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
		border-color: var(--color-accent-purple);
		box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
	}

	.skill-item::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 3px;
		height: 100%;
		background: linear-gradient(180deg, var(--color-accent-purple), var(--color-accent-pink));
		border-radius: 0 2px 2px 0;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.skill-item:hover::before {
		opacity: 1;
	}

	.skill-text {
		font-size: 0.95rem;
		color: var(--color-text-light);
		font-weight: 600;
		line-height: 1.3;
		display: block;
		position: relative;
	}

	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Timeline */
	.timeline {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		background: rgba(255, 255, 255, 0.3);
		transform: translateX(-50%);
	}

	.timeline-item {
		position: relative;
		margin-bottom: 3rem;
		display: flex;
		align-items: center;
	}

	.timeline-item:nth-child(odd) {
		flex-direction: row;
	}

	.timeline-item:nth-child(even) {
		flex-direction: row-reverse;
	}

	.timeline-marker {
		width: 16px;
		height: 16px;
		background: white;
		border-radius: 50%;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		border: 3px solid #667eea;
	}

	.timeline-content {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 16px;
		width: calc(50% - 2rem);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.job-period {
		font-size: 0.9rem;
		color: #e0e7ff;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.timeline-content h3 {
		font-size: 1.3rem;
		margin: 0 0 0.5rem 0;
		color: white;
	}

	.timeline-content h4 {
		font-size: 1.1rem;
		margin: 0 0 1rem 0;
		color: #cbd5e0;
	}

	.timeline-content p {
		margin: 0;
		color: #e2e8f0;
		line-height: 1.6;
	}

	/* Education Grid */
	.education-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.education-card {
		background: var(--color-dark-purple);
		padding: 2.5rem;
		border-radius: 16px;
		box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		border: 1px solid rgba(139, 92, 246, 0.3);
		position: relative;
		overflow: hidden;
	}

	.education-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-pink));
	}

	.education-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(139, 92, 246, 0.4);
	}

	.education-year {
		font-size: 0.9rem;
		background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.education-card h3 {
		font-size: 1.4rem;
		margin: 0 0 0.5rem 0;
		color: white;
	}

	.education-card h4 {
		font-size: 1.1rem;
		margin: 0 0 1rem 0;
		color: var(--color-text-muted);
	}

	.education-card p {
		margin: 0;
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	/* CTA Section */
	.cta-content h2 {
		font-size: 3rem;
		margin: 0 0 1rem 0;
		color: white;
	}

	.cta-content p {
		font-size: 1.2rem;
		margin-bottom: 2rem;
		color: #e2e8f0;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	.cta-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn {
		padding: 1rem 2rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		border: 2px solid transparent;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		color: white;
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4);
	}


	/* Responsive Design */
	@media (max-width: 768px) {
		.hero-content {
			flex-direction: column;
			text-align: center;
			gap: 2rem;
		}

		.hero-text h1 {
			font-size: 2.5rem;
		}

		.hero-subtitle {
			font-size: 1.2rem;
		}

		.profile-placeholder {
			width: 200px;
			height: 200px;
		}

		.section-header h2 {
			font-size: 2rem;
		}

		.timeline::before {
			left: 1rem;
		}

		.timeline-item {
			flex-direction: column !important;
			align-items: flex-start;
			padding-left: 3rem;
		}

		.timeline-marker {
			left: 1rem;
			transform: translateX(-50%);
		}

		.timeline-content {
			width: 100%;
		}

		.carousel-container {
			max-width: 100%;
			padding: 0 1rem;
		}

		.pillar-card {
			padding: 2rem 1.5rem;
		}

		.pillar-icon {
			font-size: 2.5rem;
			margin-bottom: 1rem;
		}

		.pillar-card h3 {
			font-size: 1.5rem;
		}

		.pillar-skills {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.skill-item {
			padding: 1rem 0.8rem;
			transform: translateX(0) !important;
		}

		.skill-item:hover {
			transform: translateY(-4px) scale(1.01) !important;
		}

		.carousel-controls {
			gap: 1.5rem;
			margin-top: 2rem;
		}

		.carousel-btn {
			width: 45px;
			height: 45px;
		}

		.indicator {
			width: 10px;
			height: 10px;
		}

		.education-grid {
			grid-template-columns: 1fr;
		}

		.cta-buttons {
			flex-direction: column;
			align-items: center;
		}

		.btn {
			width: 200px;
		}
	}
</style>
