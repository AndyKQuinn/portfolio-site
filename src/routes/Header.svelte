<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';

	let headerElement: HTMLElement;

	onMount(() => {
		// Fade in animation
		gsap.fromTo(headerElement,
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.5 }
		);
	});
</script>

<header bind:this={headerElement}>
	<div class="logo">
		<a href="/">
			Andy K Quinn
		</a>
	</div>
	<nav>
		<ul>
			<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			<li aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">About</a>
			</li>
			<li aria-current={page.url.pathname.startsWith('/contact') ? 'page' : undefined}>
				<a href="/contact">Contact</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem 3rem;
		background: linear-gradient(180deg, rgba(10, 10, 21, 0.4) 0%, rgba(10, 10, 21, 0.1) 70%, transparent 100%);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: none;
		z-index: 1000;
	}

	.logo a {
		font-family: 'Inter', sans-serif;
		font-size: 1.4rem;
		font-weight: 800;
		background: linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%);
		background-size: 200% 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-decoration: none;
		letter-spacing: -0.5px;
		transition: all 0.4s ease;
		animation: gradientShift 4s ease infinite;
	}

	@keyframes gradientShift {
		0%, 100% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
	}

	.logo a:hover {
		letter-spacing: 1px;
		filter: drop-shadow(0 0 8px rgba(167, 139, 250, 0.6));
	}

	nav ul {
		display: flex;
		gap: 2rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	nav a {
		color: rgba(255, 255, 255, 0.7);
		text-decoration: none;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		font-size: 0.95rem;
		letter-spacing: 0.3px;
		text-transform: none;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		padding: 0.5rem 0;
		background: transparent;
	}

	nav a::before {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: 2px;
	}

	nav a:hover {
		color: white;
		transform: translateY(-1px);
	}

	nav a:hover::before {
		width: 100%;
	}

	li[aria-current='page'] a {
		color: white;
		font-weight: 700;
		background: linear-gradient(135deg, var(--color-accent-purple) 0%, var(--color-accent-pink) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	li[aria-current='page'] a::before {
		width: 100%;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		header {
			padding: 1rem 1.5rem;
		}

		.logo a {
			font-size: 1.3rem;
		}

		nav ul {
			gap: 1.5rem;
		}

		nav a {
			font-size: 1.3rem;
		}
	}

	@media (max-width: 480px) {
		header {
			padding: 0.8rem 1rem;
		}

		.logo a {
			font-size: 1.2rem;
		}

		nav ul {
			gap: 1rem;
		}

		nav a {
			font-size: 0.85rem;
		}
	}
</style>
