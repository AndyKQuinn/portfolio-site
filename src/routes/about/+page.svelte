<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { Slidy } from '@slidy/svelte';

	import Button from '../../components/Button.svelte';

	let scrollY = 0;
	let isVisible: Record<string, boolean> = {};
	let parallaxElements: Record<string, HTMLElement | undefined> = {};

	// Tab state for proficiencies
	let activeTab = 0;
	let isPaused = false;
	let intervalId: NodeJS.Timeout;

	// Slidy carousel state
	let slidyIndex = $state(0);
	let slidyPaused = $state(false);

	// Character Stats
	const stats = [
		{ name: 'Code Quality', value: 90, max: 100, color: '#8b5cf6' },
		{ name: 'Problem Solving', value: 95, max: 100, color: '#ec4899' },
		{ name: 'Communication', value: 90, max: 100, color: '#06b6d4' },
		{ name: 'Learning Speed', value: 85, max: 100, color: '#10b981' },
		{ name: 'Creativity', value: 80, max: 100, color: '#f59e0b' },
		{ name: 'Team Synergy', value: 100, max: 100, color: '#6366f1' }
	];

	// Skill proficiencies
	const proficiencies = [
		{
			id: 1,
			name: 'JavaScript',
			related: [{ name: 'React' }, { name: 'Vue' }, { name: 'Nuxt' }, { name: 'Svelte' }]
		},
		{
			id: 2,
			name: 'Golang',
			related: [{ name: 'Gin' }, { name: 'Fiber' }]
		},
		{
			id: 3,
			name: 'Python',
			related: [{ name: 'Django' }, { name: 'FastAPI' }]
		},
		{
			id: 4,
			name: 'Docker',
			related: [{ name: 'Kubernetes' }, { name: 'Helm' }, { name: 'DevContainers' }]
		},
		{
			id: 5,
			name: 'Git',
			related: [{ name: 'GitHub' }, { name: 'GitLab' }, { name: 'Bitbucket' }]
		},
		{
			id: 6,
			name: 'Databases',
			related: [{ name: 'PostgreSQL' }, { name: 'MongoDB' }]
		},
		{
			id: 7,
			name: 'Cloud',
			related: [{ name: 'Rancher' }, { name: 'Azure' }]
		}
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

		// Wait for fade out - reduced for smoother transition
		setTimeout(() => {
			activeTab = (activeTab + 1) % 2;
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

	// Auto-advance carousel
	const startSlidyAutoplay = () => {
		return setInterval(() => {
			if (!slidyPaused) {
				slidyIndex = (slidyIndex + 1) % proficiencies.length;
			}
		}, 3000); // Change slide every 3 seconds
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

		// Start Slidy autoplay
		const slidyInterval = startSlidyAutoplay();

		// No need to calculate height anymore since we use fixed container height

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleResize);
			observer.disconnect();
			stopAutoTransition();
			clearInterval(slidyInterval);
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

			<!-- Proficiencies Panel -->
			<div class="proficiencies-panel">
				<header class="panel-header">
					<h2 id="proficiencies-heading">⚔️ Proficiencies</h2>
				</header>
				<div
					class="slidy-wrapper"
					onmouseenter={() => (slidyPaused = true)}
					onmouseleave={() => (slidyPaused = false)}
				>
					<Slidy slides={proficiencies} bind:index={slidyIndex} loop={true}>
						{#snippet slide(item)}
							<div class="proficiency-slide">
								<div class="proficiency-icon">
									{#if item.name === 'JavaScript'}
										<!-- JS Logo -->
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"
											/>
										</svg>
									{:else if item.name === 'Python'}
										<!-- Python Logo -->
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"
											/>
										</svg>
									{:else if item.name === 'Golang'}
										<!-- Go Logo -->
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.093.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.303-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z"
											/>
										</svg>
									{:else if item.name === 'Docker'}
										<!-- Docker Container -->
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
											<rect x="2" y="8" width="4" height="3" />
											<rect x="7" y="8" width="4" height="3" />
											<rect x="12" y="8" width="4" height="3" />
											<rect x="7" y="4" width="4" height="3" />
											<rect x="12" y="4" width="4" height="3" />
											<path d="M2 11h14M2 11v6a2 2 0 002 2h12a2 2 0 002-2v-6" />
											<path d="M17 11c3 0 5-1.5 5-3M18 8l3-2" />
										</svg>
									{:else if item.name === 'Git'}
										<!-- Git Logo -->
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.658 2.66a1.838 1.838 0 011.882 2.847 1.837 1.837 0 01-2.842-.307 1.838 1.838 0 01-.128-1.696l-2.48-2.48v6.522a1.837 1.837 0 01.484 3.351 1.837 1.837 0 01-1.805-2.152 1.84 1.84 0 01.327-.623v-6.586a1.837 1.837 0 01-.996-2.405L7.467 3.447l-6.973 6.973a1.55 1.55 0 000 2.188l10.48 10.477a1.55 1.55 0 002.188 0l10.43-10.43a1.55 1.55 0 00-.046-2.188"
											/>
										</svg>
									{:else if item.name === 'Databases'}
										<!-- Database icon -->
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
											<ellipse cx="12" cy="5" rx="9" ry="3" />
											<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
											<path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
										</svg>
									{:else if item.name === 'Cloud'}
										<!-- Cloud icon -->
										<svg viewBox="0 0 24 24" fill="currentColor">
											<path
												d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
											/>
										</svg>
									{:else}
										<!-- Default code icon -->
										<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
											<path
												d="M17.25 6.75L22.5 12L17.25 17.25M6.75 17.25L1.5 12L6.75 6.75M14.25 3.75L9.75 20.25"
											/>
										</svg>
									{/if}
								</div>
								<div class="proficiency-info">
									<h3>{item.name}</h3>
									<div class="related-techs">
										{#each item.related as tech}
											<span class="tech-tag">{tech.name}</span>
										{/each}
									</div>
								</div>
							</div>
						{/snippet}
					</Slidy>
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

	/* Proficiencies Panel - Slidy Container */
	.proficiencies-panel {
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
	}

	.proficiencies-panel:hover {
		border-color: var(--color-accent-purple);
		box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
	}

	.slidy-wrapper {
		padding: 1.5rem;
		min-height: 400px;
		display: flex;
		align-items: center;
	}

	.slidy-wrapper :global(.slidy) {
		--slidy-height: 450px;
		--slidy-slide-width: 100%;
		--slidy-slide-height: 100%;
		--slidy-arrow-bg: rgba(139, 92, 246, 0.3);
		--slidy-arrow-bg-hover: rgba(139, 92, 246, 0.5);
		--slidy-arrow-icon-color: white;
		--slidy-nav-item-color: var(--color-accent-purple);
		--slidy-focus-ring-color: var(--color-accent-purple);
		width: 100%;
	}

	/* Custom Proficiency Slide Styling */
	.proficiency-slide {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		width: 100%;
		height: 100%;
		padding: 2rem;
	}

	.proficiency-icon {
		width: 160px;
		height: 160px;
		border-radius: 16px;
		border: 3px solid rgba(139, 92, 246, 0.8);
		background: linear-gradient(145deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%),
			linear-gradient(180deg, #1a0030 0%, #0a0015 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow:
			0 0 5px 3px rgba(139, 92, 246, 0.2),
			0 10px 30px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease;
	}

	.proficiency-icon:hover {
		transform: scale(1.05);
	}

	.proficiency-icon svg {
		width: 100px;
		height: 100px;
		color: var(--color-accent-purple);
		filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
	}

	.proficiency-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	.proficiency-info h3 {
		font-family: 'Cinzel', serif;
		font-size: 2rem;
		color: white;
		text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
		margin: 0;
	}

	.related-techs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.tech-tag {
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		color: white;
		background: rgba(236, 72, 153, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid rgba(236, 72, 153, 0.4);
		transition: all 0.2s ease;
	}

	.tech-tag:hover {
		background: rgba(236, 72, 153, 0.3);
		border-color: rgba(236, 72, 153, 0.6);
		transform: translateY(-2px);
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

		.slidy-wrapper {
			min-height: 350px;
		}

		.slidy-wrapper :global(.slidy) {
			--slidy-height: 350px;
		}

		.proficiency-icon {
			width: 140px;
			height: 140px;
		}

		.proficiency-icon svg {
			width: 80px;
			height: 80px;
		}

		.proficiency-info h3 {
			font-size: 1.75rem;
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

		.slidy-wrapper {
			min-height: 320px;
			padding: 1rem;
		}

		.slidy-wrapper :global(.slidy) {
			--slidy-height: 320px;
		}

		.proficiency-slide {
			gap: 1.5rem;
			padding: 1rem;
		}

		.proficiency-icon {
			width: 120px;
			height: 120px;
		}

		.proficiency-icon svg {
			width: 70px;
			height: 70px;
		}

		.proficiency-info h3 {
			font-size: 1.5rem;
		}

		.tech-tag {
			font-size: 0.8rem;
			padding: 0.4rem 0.8rem;
		}
	}
</style>
