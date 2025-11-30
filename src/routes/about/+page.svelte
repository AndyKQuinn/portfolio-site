<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import Button from '../../components/Button.svelte';
	import CardCarousel from '$lib/components/CardCarousel.svelte';

	let scrollY = 0;
	let isVisible: Record<string, boolean> = {};
	let parallaxElements: Record<string, HTMLElement | undefined> = {};

	// Tab state for proficiencies
	let activeTab = 0;
	let isPaused = false;
	let intervalId: NodeJS.Timeout;
	let tabContentVisible = true;
	let proficienciesContainer: HTMLElement;

	// Character Stats
	const stats = [
		{ name: 'Code Quality', value: 90, max: 100, color: '#8b5cf6' },
		{ name: 'Problem Solving', value: 95, max: 100, color: '#ec4899' },
		{ name: 'Communication', value: 90, max: 100, color: '#06b6d4' },
		{ name: 'Learning Speed', value: 85, max: 100, color: '#10b981' },
		{ name: 'Creativity', value: 80, max: 100, color: '#f59e0b' },
		{ name: 'Team Synergy', value: 100, max: 100, color: '#6366f1' }
	];

	// Skill proficiencies organized by ecosystem
	const languageEcosystems = [
		{
			language: 'JavaScript',
			related: [
				{ name: 'React' },
				{ name: 'Vue' },
				{ name: 'Nuxt' },
				{ name: 'Svelte' }
			]
		},
		{
			language: 'Golang',
			related: [
				{ name: 'Gin' },
				{ name: 'Fiber' }
			]
		},
		{
			language: 'Python',
			related: [
				{ name: 'Django' },
				{ name: 'FastAPI' }
			]
		}
	];

	const devOpsGroups = [
		{
			tool: 'Docker',
			related: [
				{ name: 'Kubernetes' },
				{ name: 'Helm' },
				{ name: 'DevContainers' }
			]
		},
		{
			tool: 'Git',
			related: [
				{ name: 'GitHub' },
				{ name: 'GitLab' },
				{ name: 'Bitbucket' }
			]
		},
		{
			tool: 'Databases',
			related: [
				{ name: 'PostgreSQL' },
				{ name: 'MongoDB' }
			]
		},
		{
			tool: 'Cloud',
			related: [
				{ name: 'Rancher' },
				{ name: 'Azure' }
			]
		}
	];

	const tabs = [
		{ id: 0, label: 'Languages', groups: languageEcosystems, type: 'languages' },
		{ id: 1, label: 'DevOps', groups: devOpsGroups, type: 'devops' }
	];

	// Current interests and projects
	const currentInterests = [
		{
			title: 'Uplift Collective',
			description: 'Passion project to help uplift and promote amazing local community members.',
			tags: ['Community', 'Open Source', 'Mentorship']
		},
		{
			title: 'Game Development',
			description:
				'Learning how to build games using Godot while leveraging AI to help with planning and execution along the way.',
			tags: ['Godot', 'ClaudeCode', 'AI']
		},
		{
			title: 'Content Creation',
			description:
				'Creating videos and documentation to help upskill the next generation of developers.',
			tags: ['Advocacy', 'Inclusion', 'Community']
		}
	];

	// Tab management functions
	const switchTab = async () => {
		if (isPaused) return;

		tabContentVisible = false;

		// Wait for fade out - reduced for smoother transition
		setTimeout(() => {
			activeTab = (activeTab + 1) % 2;
			tabContentVisible = true;
		}, 300);
	};

	const startAutoTransition = () => {
		intervalId = setInterval(switchTab, 5000);
	};

	const stopAutoTransition = () => {
		if (intervalId) {
			clearInterval(intervalId);
		}
	};

	const handleMouseEnter = () => {
		isPaused = true;
		stopAutoTransition();
	};

	const handleMouseLeave = () => {
		isPaused = false;
		startAutoTransition();
	};

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
			// Update parallax elements
			Object.keys(parallaxElements).forEach((key) => {
				const element = parallaxElements[key];
				if (element) {
					const speed = key === 'hero' ? 0.5 : 0.3;
					element.style.transform = `translateY(${scrollY * speed}px)`;
				}
			});
		};

		const handleResize = () => {
			// Handle resize if needed
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
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
			document.querySelectorAll('[data-section]').forEach((el) => {
				observer.observe(el);
			});
		}, 100);

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', handleResize);

		// Start auto transition
		startAutoTransition();

		// No need to calculate height anymore since we use fixed container height

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			observer.disconnect();
			stopAutoTransition();
		};
	});
</script>

<svelte:head>
	<title>About - Andy K Quinn</title>
	<meta
		name="description"
		content="Learn about Andy Quinn's skills, experience, and passion for full-stack development and community building"
	/>
</svelte:head>

<!-- Character Sheet Hero -->
<section class="character-sheet-hero" aria-label="Character sheet introduction">
	<div class="sheet-container">
		<div class="sheet-header" in:fly={{ y: -50, duration: 800, easing: quintOut }}>
			<div class="character-frame">
				<img src="andy_headshot_01.png" alt="Andy Quinn" class="character-portrait" />
			</div>
			<div class="character-info">
				<h1 class="character-name">Andy K Quinn</h1>
				<div class="character-class">Developer • Educator • Advocate</div>
				<div class="character-title">~ Builder of Digital and Documentation Experiences ~</div>
			</div>

			<!-- Stats with circular progress -->
			<div class="stats-badges" role="region" aria-label="Skill statistics">
				{#each stats as stat (stat.name)}
					<div class="stat-badge">
						<div class="stat-circle-container">
							<svg class="stat-circle" viewBox="0 0 36 36">
								<path
									class="stat-circle-bg"
									d="M18 2.0845
										a 15.9155 15.9155 0 0 1 0 31.831
										a 15.9155 15.9155 0 0 1 0 -31.831"
									fill="none"
									stroke="rgba(139, 92, 246, 0.2)"
									stroke-width="3"
								/>
								<path
									class="stat-circle-fill"
									d="M18 2.0845
										a 15.9155 15.9155 0 0 1 0 31.831
										a 15.9155 15.9155 0 0 1 0 -31.831"
									fill="none"
									stroke={stat.color}
									stroke-width="3"
									stroke-dasharray="{stat.value}, 100"
									stroke-linecap="round"
								/>
							</svg>
							<div class="stat-circle-value" style="color: {stat.color};">{stat.value}</div>
						</div>
						<div class="stat-badge-content">
							<span class="stat-badge-name">{stat.name}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Story & Proficiencies - Merged into Hero -->
		<div class="hero-content-grid" in:fade={{ duration: 1000, delay: 500 }}>
			<!-- My Story Panel -->
			<div class="story-panel panel">
				<div class="panel-header">
					<h2>📜 My Story</h2>
				</div>
				<div class="panel-content">
					<p>
						I am a lifelong technology enthusiast who is passionate about helping people and
						building awesome things together. I am a polyglot developer with affinity towards
						working in TypeScript, Python and Golang. I have experience with a variety of
						technologies and frameworks, including React, Angular, Vue, Node.js, Django, Flask, and
						many more.
					</p>
					<p>
						My transition from childhood to adulthood was - like for many - laden with hurdles and
						hardships. Through battling homelessness and unexpectedly becoming a young widow, I
						discovered I am nothing if not resilient. Through daily learning practices and chasing
						curiosity, I taught myself how to build applications in multiple languages and
						ultimately pivoted careers from technical writing into software engineering, and
						eventually landing a role as a software engineering coach at a major financial
						institution.
					</p>
					<p>
						With a few years of coaching experience, I decided to focus exclusively on building <i
							>compelling, accessible and consumable</i
						>
						user experiences. Despite it often feeling like "just pushing pixels around", proper user
						experiences and documentation are vital for user acceptance, with responsiveness and accessible
						designs being of equal importance. I focus my time and energy working to better understand
						how humans interact with technology and how to design experiences that are intuitive and
						enjoyable.
					</p>
				</div>
			</div>

			<!-- Proficiencies Panel with Tabs -->
			<div
				class="proficiencies-panel panel"
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				role="region"
				aria-label="Skills and proficiencies"
			>
				<header class="panel-header">
					<h2 id="proficiencies-heading">⚔️ Proficiencies</h2>
					<div class="tab-indicators" role="tablist" aria-labelledby="proficiencies-heading">
						{#each tabs as tab (tab.id)}
							<button
								class="tab-indicator {activeTab === tab.id ? 'active' : ''}"
								role="tab"
								aria-selected={activeTab === tab.id}
								aria-controls="tab-{tab.id}"
								aria-label="{tab.label} tab"
								onclick={() => {
									activeTab = tab.id;
									tabContentVisible = true;
								}}
							></button>
						{/each}
					</div>
				</header>
				<div class="panel-content" bind:this={proficienciesContainer}>
					<CardCarousel
						languageEcosystems={languageEcosystems}
						devOpsGroups={devOpsGroups}
						activeTab={activeTab}
					/>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Quote Section -->
<section class="quote-section" data-section="quote" aria-label="Personal philosophy">
	<div class="container">
		<div class="quote-container" in:fly={{ y: 30, duration: 800 }}>
			<div class="quote-decoration quote-decoration-left" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
				</svg>
			</div>
			<blockquote class="quote-content">
				<p class="quote-text">"Strong opinions, weakly held."</p>
				<footer class="quote-author">— Paul Saffo</footer>
			</blockquote>
			<div class="quote-decoration quote-decoration-right" aria-hidden="true">
				<svg viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
				</svg>
			</div>
		</div>
	</div>
</section>

<!-- Current Interests & Projects -->
<section class="interests-section" data-section="interests" aria-labelledby="interests-heading">
	<div class="container">
		<div class="section-header" in:fly={{ y: 50, duration: 800 }}>
			<h2 id="interests-heading">Current Interests & Projects</h2>
		</div>
		<div class="quests-grid" role="list">
			{#each currentInterests as interest, i (interest.title)}
				<article
					class="quest-card"
					in:fly={{ y: 50, duration: 600, delay: i * 150 }}
					role="listitem"
				>
					<h3>{interest.title}</h3>
					<p>{interest.description}</p>
					<div class="quest-tags" role="list" aria-label="Project tags">
						{#each interest.tags as tag (tag)}
							<span class="quest-tag" role="listitem">{tag}</span>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- Call to Action -->
<section class="cta-section" data-section="cta" aria-labelledby="cta-heading">
	<div class="container">
		<div class="cta-content" in:fade={{ duration: 800, delay: 200 }}>
			<h2 id="cta-heading">Let's Work Together</h2>
			<p>I'm always excited to take on new challenges and collaborate on interesting projects.</p>
			<Button href="/contact" label="Contact Me" />
		</div>
	</div>
</section>

<style>
	/* Character Sheet Hero */
	.character-sheet-hero {
		min-height: auto;
		padding: 4rem 2rem 3rem;
		background: linear-gradient(180deg, var(--color-deep-purple) 0%, #0a0015 100%);
		margin-top: 2rem;
	}

	.sheet-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.sheet-header {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 2rem;
		margin-bottom: 1.5rem;
		padding: 2rem;
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 16px;
		position: relative;
		overflow: hidden;
	}

	.sheet-header::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-pink));
	}

	.character-frame {
		position: relative;
		display: flex;
		align-items: center;
	}

	.character-portrait {
		width: 250px;
		height: 250px;
		border-radius: 16px;
		border: 4px solid var(--color-accent-purple);
		box-shadow:
			0 0 30px rgba(139, 92, 246, 0.5),
			inset 0 0 20px rgba(0, 0, 0, 0.3);
		object-fit: cover;
	}

	.character-info {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.25rem;
	}

	.character-name {
		font-family: 'Cinzel', serif;
		font-size: 4rem;
		font-weight: 700;
		margin: 0;
		line-height: 1.1;
		text-align: left;
		background: linear-gradient(
			135deg,
			#ffffff,
			var(--color-accent-purple),
			var(--color-accent-pink)
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		text-shadow: 0 0 40px rgba(139, 92, 246, 0.5);
	}

	.character-class {
		font-family: 'Inter', sans-serif;
		font-size: 1.4rem;
		color: var(--color-accent-purple);
		font-weight: 600;
		letter-spacing: 1px;
		line-height: 1.4;
		text-align: left;
	}

	.character-title {
		font-family: 'Cinzel', serif;
		font-size: 1.25rem;
		color: rgba(255, 255, 255, 0.7);
		font-style: italic;
		line-height: 1.4;
		text-align: left;
	}

	/* Stats with circular progress */
	.stats-badges {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
		align-content: start;
	}

	.stat-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background: rgba(0, 0, 0, 0.2);
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 12px;
		transition: all 0.3s ease;
	}

	.stat-badge:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
		background: rgba(0, 0, 0, 0.3);
		border-color: rgba(139, 92, 246, 0.5);
	}

	.stat-circle-container {
		position: relative;
		width: 50px;
		height: 50px;
	}

	.stat-circle {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}

	.stat-circle-fill {
		transition: stroke-dasharray 1s ease-in-out;
	}

	.stat-circle-value {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: 'Courier New', monospace;
		font-size: 1rem;
		font-weight: 900;
		text-shadow: 0 0 15px currentColor;
	}

	.stat-badge-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 0.25rem;
	}

	.stat-badge-name {
		font-family: 'Courier New', monospace;
		font-size: 0.65rem;
		color: rgba(255, 255, 255, 0.8);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-weight: 600;
		line-height: 1.2;
	}

	/* Container */
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	/* Hero Content Grid - Story & Proficiencies merged into hero */
	.hero-content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-top: 2rem;
	}

	.panel {
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.panel:hover {
		border-color: var(--color-accent-purple);
		box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
	}

	.panel-header {
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2));
		padding: 1rem 1.5rem;
		border-bottom: 2px solid rgba(139, 92, 246, 0.3);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.panel-header h2 {
		font-family: 'Cinzel', serif;
		font-size: 1.8rem;
		margin: 0;
		color: white;
		text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
	}

	.panel-content {
		padding: 1.5rem;
	}

	.panel-content p {
		color: var(--color-text-muted);
		line-height: 1.8;
		margin-bottom: 1.25rem;
		font-size: 1.05rem;
	}

	.panel-content p:last-child {
		margin-bottom: 0;
	}

	/* 3D Sphere Visualization */
	.sphere-instructions {
		text-align: center;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background: rgba(139, 92, 246, 0.1);
		border-radius: 8px;
		border: 1px solid rgba(139, 92, 246, 0.3);
	}

	.sphere-instructions p {
		margin: 0;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 600;
		letter-spacing: 0.5px;
	}

	/* Tab functionality styles */
	.tab-indicators {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.tab-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(139, 92, 246, 0.3);
		transition: all 0.3s ease;
		border: none;
		cursor: default;
		padding: 0;
	}

	.tab-indicator.active {
		background: var(--color-accent-purple);
		box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
		transform: scale(1.2);
	}

	.tab-indicator:focus {
		outline: 2px solid var(--color-accent-purple);
		outline-offset: 2px;
	}

	/* Quote Section */
	.quote-section {
		padding: 4rem 0;
		background: #0a0015;
		position: relative;
		overflow: hidden;
	}

	.quote-container {
		position: relative;
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1rem;
		border: 2px solid rgba(139, 92, 246, 0.4);
		border-radius: 20px;
		box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
		transition: all 0.4s ease;
	}

	.quote-container:hover {
		border-color: rgba(139, 92, 246, 0.7);
		box-shadow: 0 15px 50px rgba(139, 92, 246, 0.5);
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		transform: translateY(-3px);
	}

	.quote-decoration {
		flex-shrink: 0;
		width: 60px;
		height: 60px;
		opacity: 0.5;
		color: var(--color-accent-purple);
	}

	.quote-decoration-left {
		transform: rotate(180deg);
	}

	.quote-decoration svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
	}

	.quote-content {
		flex: 1;
		margin: 0;
		text-align: center;
	}

	.quote-text {
		font-family: 'Cinzel', serif;
		font-size: 1.5rem;
		line-height: 1.8;
		color: #ffffff;
		margin: 0 0 1rem 0;
		font-style: italic;
		text-shadow: 0 2px 10px rgba(139, 92, 246, 0.5);
		opacity: 1;
	}

	.quote-author {
		font-family: 'Inter', sans-serif;
		font-size: 1.1rem;
		color: var(--color-accent-purple);
		font-weight: 600;
		letter-spacing: 1px;
	}

	/* Current Interests & Projects */
	.interests-section {
		padding: 3rem 0;
		background: #0a0015;
	}

	.section-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.section-header h2 {
		font-family: 'Cinzel', serif;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0;
		color: white;
		text-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
	}

	.quests-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.quest-card {
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 16px;
		padding: 2rem;
		position: relative;
		transition: all 0.3s ease;
		overflow: hidden;
	}

	.quest-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-pink));
	}

	.quest-card:hover {
		border-color: var(--color-accent-purple);
		transform: translateY(-5px);
		box-shadow: 0 15px 40px rgba(139, 92, 246, 0.4);
	}

	.quest-card h3 {
		font-family: 'Cinzel', serif;
		font-size: 1.5rem;
		color: white;
		margin: 0 0 1rem 0;
		text-shadow: 0 0 15px rgba(139, 92, 246, 0.3);
	}

	.quest-card p {
		color: var(--color-text-muted);
		line-height: 1.7;
		margin-bottom: 1.5rem;
		font-size: 1rem;
	}

	.quest-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.quest-tag {
		font-family: 'Courier New', monospace;
		font-size: 0.8rem;
		color: var(--color-accent-purple);
		background: rgba(139, 92, 246, 0.15);
		padding: 0.4rem 0.8rem;
		border-radius: 6px;
		border: 1px solid rgba(139, 92, 246, 0.3);
		font-weight: 600;
	}

	/* CTA Section */
	.cta-section {
		padding: 6rem 0;
		background: #0a0015;
		color: white;
		text-align: center;
	}

	/* CTA Section */
	.cta-content h2 {
		font-size: 3rem;
		margin: 0 0 1rem 0;
		color: white;
	}

	.cta-content p {
		font-size: 1.1rem;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	/* Responsive Design */
	@media (max-width: 1024px) {
		.hero-content-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}

	@media (max-width: 1024px) {
		.sheet-header {
			grid-template-columns: auto 1fr;
			grid-template-rows: auto auto;
		}

		.stats-badges {
			grid-column: 1 / 3;
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.character-sheet-hero {
			padding: 2rem 1rem 1.5rem;
		}

		.sheet-header {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			text-align: center;
			gap: 1.5rem;
			padding: 1.5rem;
		}

		.character-frame {
			justify-content: center;
		}

		.character-portrait {
			width: 180px;
			height: 180px;
		}

		.character-info {
			align-items: center;
		}

		.character-name {
			font-size: 3rem;
			text-align: center;
		}

		.character-class {
			font-size: 1.3rem;
			text-align: center;
		}

		.character-title {
			font-size: 1.15rem;
			text-align: center;
		}

		.stats-badges {
			grid-column: 1;
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.stat-badge {
			padding: 0.75rem 0.5rem;
		}

		.stat-circle-container {
			width: 70px;
			height: 70px;
		}

		.stat-circle-value {
			font-size: 1.4rem;
		}

		.stat-badge-name {
			font-size: 0.8rem;
		}

		.quote-container {
			flex-direction: column;
			padding: 2rem 1.5rem;
			gap: 1rem;
		}

		.quote-decoration {
			width: 40px;
			height: 40px;
		}

		.quote-decoration-left,
		.quote-decoration-right {
			display: none;
		}

		.quote-text {
			font-size: 1.2rem;
			line-height: 1.6;
		}

		.quote-author {
			font-size: 1rem;
		}

		.section-header h2 {
			font-size: 2rem;
		}

		.quests-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.cta-content h2 {
			font-size: 1.8rem;
		}

		.cta-content p {
			font-size: 0.9rem;
		}

		.sphere-instructions p {
			font-size: 0.75rem;
		}
	}
</style>
