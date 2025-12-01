<script lang="ts">
	import { fly } from 'svelte/transition';

	// Handle external link clicks
	function handleExternalLink(url: string) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	// Contact methods data
	const contactMethods = [
		{
			platform: 'Email',
			value: 'andy.kettler.quinn@gmail.com',
			href: 'mailto:andy.kettler.quinn@gmail.com',
			icon: '📧',
			description: 'Send me an email directly'
		},
		{
			platform: 'LinkedIn',
			value: 'andykquinn',
			href: 'https://www.linkedin.com/in/andy-guice/',
			icon: '💼',
			description: 'Connect with me professionally'
		},
		{
			platform: 'GitHub',
			value: 'andykquinn',
			href: 'https://github.com/AndyKQuinn',
			icon: '💻',
			description: 'Check out my code and projects'
		}
	];
</script>

<svelte:head>
	<title>Contact - Andy K Quinn</title>
	<meta
		name="description"
		content="Get in touch with Andy K Quinn for collaborations, opportunities, or just to say hello!"
	/>
</svelte:head>

<section class="contact-hero">
	<div class="hero-content" in:fly={{ y: 50, duration: 800 }}>
		<h1>Let's Connect</h1>
		<p class="hero-subtitle">
			I'd love to hear from you. Reach out through any of the channels below.
		</p>
	</div>
</section>

<section class="contact-content">
	<div class="container">
		<div class="contact-methods">
			{#each contactMethods as method, index (method.platform)}
				<button
					type="button"
					class="contact-method"
					in:fly={{ y: 30, duration: 600, delay: 200 + index * 100 }}
					onclick={() => handleExternalLink(method.href)}
					data-href={method.href}
				>
					<div class="method-icon">{method.icon}</div>
					<div class="method-content">
						<h3>{method.platform}</h3>
						<p class="method-value">{method.value}</p>
						<p class="method-description">{method.description}</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

<style>
	/* Hero Section */
	.contact-hero {
		min-height: auto;
		background: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		padding: 6rem 0 2rem;
	}

	.contact-hero::before {
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
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		50% {
			transform: translateY(-20px) rotate(2deg);
		}
	}

	.hero-content {
		text-align: center;
		color: white;
		max-width: 600px;
		padding: 0 2rem;
		z-index: 2;
		position: relative;
	}

	.hero-content h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0 0 0.5rem 0;
		background: linear-gradient(45deg, #fff, #e0e7ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: 1.1rem;
		opacity: 0.9;
		margin: 0;
		font-weight: 300;
		line-height: 1.6;
	}

	/* Contact Content */
	.contact-content {
		background: transparent;
		padding: 2rem 0 4rem;
	}

	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.contact-methods {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.contact-method {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1.75rem;
		background: linear-gradient(145deg, rgba(30, 15, 60, 0.95), rgba(20, 10, 40, 0.95));
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		border: 1px solid rgba(139, 92, 246, 0.3);
		backdrop-filter: blur(10px);
		cursor: pointer;
		width: 100%;
		text-align: left;
		font-family: inherit;
		font-size: inherit;
	}

	.contact-method:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
		border-color: var(--color-accent-purple);
	}

	.method-icon {
		font-size: 2rem;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--color-accent-purple) 0%,
			var(--color-accent-pink) 100%
		);
		border-radius: 50%;
		color: white;
		flex-shrink: 0;
	}

	.method-content h3 {
		font-size: 1.3rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		color: white;
	}

	.method-value {
		font-size: 1.05rem;
		font-weight: 500;
		background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 0.25rem 0;
	}

	.method-description {
		font-size: 0.95rem;
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.4;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.contact-hero {
			padding: 4rem 0 1.5rem;
		}

		.hero-content h1 {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.contact-content {
			padding: 1.5rem 0 3rem;
		}

		.contact-method {
			padding: 1.25rem;
			gap: 1rem;
		}

		.method-icon {
			width: 50px;
			height: 50px;
			font-size: 1.5rem;
		}

		.method-content h3 {
			font-size: 1.15rem;
		}

		.method-value {
			font-size: 0.95rem;
		}
	}

	@media (max-width: 480px) {
		.hero-content h1 {
			font-size: 1.75rem;
		}

		.container {
			padding: 0 1rem;
		}

		.contact-method {
			padding: 1rem;
		}

		.method-icon {
			width: 45px;
			height: 45px;
			font-size: 1.25rem;
		}
	}
</style>
