<script lang="ts">
	import { onMount } from 'svelte';

	export let languageEcosystems: any[];
	export let devOpsGroups: any[];
	export let activeTab: number;

	let currentIndex = 0;
	let isAnimating = false;

	$: allGroups = [
		...languageEcosystems.map((g) => ({ ...g, type: 'language' })),
		...devOpsGroups.map((g) => ({ ...g, type: 'devops' }))
	];

	// Show 3 cards in the stack
	$: visibleCards = [
		allGroups[currentIndex % allGroups.length],
		allGroups[(currentIndex + 1) % allGroups.length],
		allGroups[(currentIndex + 2) % allGroups.length]
	];

	function getMainName(group: any) {
		return group.type === 'language' ? group.language : group.tool;
	}

	function getAngle(index: number): number {
		const angles = [3, -4, 2, -5, 4, -3, 5];
		return angles[index % angles.length];
	}

	function rotate() {
		if (isAnimating) return;

		isAnimating = true;
		setTimeout(() => {
			currentIndex = (currentIndex + 1) % allGroups.length;
			isAnimating = false;
		}, 1100);
	}

	onMount(() => {
		const interval = setInterval(rotate, 4100);
		return () => clearInterval(interval);
	});
</script>

<div class="cards" role="region" aria-label="Technology proficiencies">
	{#each visibleCards as group, i}
		{@const stackIndex = i}
		{@const rotation = getAngle(currentIndex + i)}
		<article
			class="card"
			class:top-card={stackIndex === 0}
			class:animating={isAnimating && stackIndex === 0}
			style="
				--stack-index: {stackIndex};
				--rotation: {rotation}deg;
			"
		>
			<div class="card-img-wrapper">
				<div class="card-img">
					{#if getMainName(group) === 'JavaScript'}
						<!-- JS Logo -->
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"
							/>
						</svg>
					{:else if getMainName(group) === 'Python'}
						<!-- Python Logo -->
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"
							/>
						</svg>
					{:else if getMainName(group) === 'Golang'}
						<!-- Go Logo -->
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M1.811 10.231c-.047 0-.058-.023-.035-.059l.246-.315c.023-.035.081-.058.128-.058h4.172c.046 0 .058.035.035.07l-.199.303c-.023.036-.082.07-.117.07zM.047 11.306c-.047 0-.059-.023-.035-.058l.245-.316c.023-.035.082-.058.129-.058h5.328c.047 0 .07.035.058.07l-.093.28c-.012.047-.058.07-.105.07zm2.828 1.075c-.047 0-.059-.035-.035-.07l.163-.292c.023-.035.07-.07.117-.07h2.337c.047 0 .07.035.07.082l-.023.28c0 .047-.047.082-.093.082zm12.129-2.36c-.736.187-1.239.327-1.963.514-.176.046-.187.058-.34-.117-.174-.199-.303-.327-.548-.444-.737-.362-1.45-.257-2.115.175-.795.514-1.204 1.274-1.192 2.22.011.935.654 1.706 1.577 1.835.795.105 1.46-.175 1.987-.77.105-.13.198-.27.315-.434H10.47c-.245 0-.303-.152-.222-.35.152-.362.432-.97.596-1.274a.315.315 0 01.292-.187h4.253c-.023.316-.023.631-.07.947a4.983 4.983 0 01-.958 2.29c-.841 1.11-1.94 1.8-3.33 1.986-1.145.152-2.209-.07-3.143-.77-.865-.655-1.356-1.52-1.484-2.595-.152-1.274.222-2.419.993-3.424.83-1.086 1.928-1.776 3.272-2.02 1.098-.2 2.15-.07 3.096.571.62.41 1.063.97 1.356 1.648.07.105.023.164-.117.2m3.868 6.461c-1.064-.024-2.034-.328-2.852-1.029a3.665 3.665 0 01-1.262-2.255c-.21-1.32.152-2.489.947-3.529.853-1.122 1.881-1.706 3.272-1.95 1.192-.21 2.314-.095 3.33.595.923.63 1.496 1.484 1.648 2.605.198 1.578-.257 2.863-1.344 3.962-.771.783-1.718 1.273-2.805 1.495-.315.06-.63.07-.934.106zm2.78-4.72c-.011-.153-.011-.27-.034-.387-.21-1.157-1.274-1.81-2.384-1.554-1.087.245-1.788.935-2.045 2.033-.21.912.234 1.835 1.075 2.21.643.28 1.285.244 1.905-.07.923-.48 1.425-1.228 1.484-2.233z"
							/>
						</svg>
					{:else if getMainName(group) === 'Docker'}
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
					{:else if getMainName(group) === 'Git'}
						<!-- Git Logo -->
						<svg viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.658 2.66a1.838 1.838 0 011.882 2.847 1.837 1.837 0 01-2.842-.307 1.838 1.838 0 01-.128-1.696l-2.48-2.48v6.522a1.837 1.837 0 01.484 3.351 1.837 1.837 0 01-1.805-2.152 1.84 1.84 0 01.327-.623v-6.586a1.837 1.837 0 01-.996-2.405L7.467 3.447l-6.973 6.973a1.55 1.55 0 000 2.188l10.48 10.477a1.55 1.55 0 002.188 0l10.43-10.43a1.55 1.55 0 00-.046-2.188"
							/>
						</svg>
					{:else if getMainName(group) === 'Databases'}
						<!-- Database icon -->
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
							<ellipse cx="12" cy="5" rx="9" ry="3" />
							<path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
							<path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
						</svg>
					{:else if getMainName(group) === 'Cloud'}
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
			</div>
			<div class="card-data">
				<h2>{getMainName(group)}</h2>
				<div class="related-techs">
					{#each group.related as tech}
						<span class="tech-tag">{tech.name}</span>
					{/each}
				</div>
			</div>
		</article>
	{/each}
</div>

<style>
	.cards {
		--img-w: 200px;
		width: min(100% - 2rem, 800px);
		margin-inline: auto;
		padding-top: 2rem;
		display: grid;
		position: relative;
		perspective: 1000px;
	}

	.card {
		--cards-grid-cols: auto;
		--cards-grid-rows: var(--img-w) auto;
		--cards-grid-gap: 2rem;

		grid-area: 1/1;
		display: grid;
		place-items: center;
		grid-template-columns: var(--cards-grid-cols);
		grid-template-rows: var(--cards-grid-rows);
		gap: var(--cards-grid-gap);

		/* Stack positioning - top card (index 0) has no rotation */
		transform: translateY(calc(var(--stack-index) * -8px))
			translateX(calc(var(--stack-index) * 4px)) rotate(calc(var(--rotation) * var(--stack-index)))
			scale(calc(1 - var(--stack-index) * 0.05));

		z-index: calc(10 - var(--stack-index));

		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.card.animating .card-data {
		transform: translateX(-100px);
		opacity: 0;
	}

	@media (600px < width) {
		.card {
			--cards-grid-cols: var(--img-w) auto;
			--cards-grid-rows: auto;
			--cards-grid-gap: 4rem;
		}
	}

	.card-img-wrapper {
		width: 200px;
		height: 200px;
		aspect-ratio: 1 / 1;
		border-radius: 10px;
		border: 3px solid rgba(139, 92, 246, 0.8);
		overflow: hidden;
		transform-origin: center;
		box-shadow:
			0 0 5px 3px rgba(139, 92, 246, 0.2),
			0 10px 30px rgba(0, 0, 0, 0.3);
		background:
			linear-gradient(145deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%),
			linear-gradient(180deg, #1a0030 0%, #0a0015 100%);
		display: grid;
		place-items: center;
		transition: transform 0.3s ease;
	}

	.top-card .card-img-wrapper:hover {
		transform: rotate(calc(var(--rotation) * -0.5)) scale(1.05);
	}

	.card-img {
		width: 120px;
		height: 120px;
		color: var(--color-accent-purple);
		filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
	}

	.card-img svg {
		width: 100%;
		height: 100%;
	}

	.card-data {
		display: grid;
		gap: 1rem;
		opacity: 0;
		transform: translateX(-100px);
		transition:
			opacity 0.3s ease,
			transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.top-card .card-data {
		opacity: 1;
		transform: translateX(0);
	}

	.card-data > h2 {
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
	}

	.tech-tag {
		font-family: 'Inter', sans-serif;
		font-size: 0.9rem;
		color: white;
		background: rgba(236, 72, 153, 0.2);
		padding: 0.5rem 1rem;
		border-radius: 6px;
		border: 1px solid rgba(236, 72, 153, 0.4);
	}
</style>
