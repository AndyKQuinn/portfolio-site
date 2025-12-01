<script lang="ts">
	import { resolveRoute } from '$app/paths';
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		onclick?: () => void;
		disabled?: boolean;
		children?: Snippet;
	}

	let { label, href, type = 'button', onclick, disabled = false, children }: Props = $props();
</script>

{#if href}
	<!-- Link version -->
	<a
		href={href ? resolveRoute(href as any) : undefined}
		class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md border border-purple-700/50 bg-linear-to-b px-6 py-2 font-serif font-semibold shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-110 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-600/50 sm:px-12 sm:py-4"
		class:opacity-50={disabled}
		class:pointer-events-none={disabled}
	>
		<span class="relative z-10 drop-shadow-lg sm:text-3xl md:text-xl">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
		<div
			class="absolute inset-0 flex h-full w-full transform-[skew(-13deg)_translateX(-100%)] justify-center group-hover/button:transform-[skew(-13deg)_translateX(100%)] group-hover/button:duration-1000"
		>
			<div class="relative h-full w-10 bg-white/30"></div>
		</div>
	</a>
{:else}
	<!-- Button version for form submission -->
	<button
		{type}
		{onclick}
		{disabled}
		class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md border border-purple-700/50 bg-linear-to-b px-6 py-2 font-serif font-semibold shadow-lg backdrop-blur-lg transition-all duration-300 ease-in-out hover:scale-110 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-600/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 sm:px-12 sm:py-4"
	>
		<span class="relative z-10 drop-shadow-lg sm:text-3xl md:text-xl">
			{#if children}
				{@render children()}
			{:else}
				{label}
			{/if}
		</span>
		<div
			class="absolute inset-0 flex h-full w-full transform-[skew(-13deg)_translateX(-100%)] justify-center group-hover/button:transform-[skew(-13deg)_translateX(100%)] group-hover/button:duration-1000"
		>
			<div class="relative h-full w-10 bg-white/30"></div>
		</div>
	</button>
{/if}
