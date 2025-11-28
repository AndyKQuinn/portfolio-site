<!-- TypeScript declarations for hCaptcha -->
<script context="module">
	declare global {
		interface Window {
			hcaptcha: {
				render: (container: string, options: Record<string, unknown>) => string;
				reset: (widgetId: string) => void;
				remove: (widgetId: string) => void;
			};
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';

	let form: HTMLFormElement;
	let formData = {
		name: '',
		email: '',
		subject: '',
		message: '',
		honeypot: '' // Hidden field for spam protection
	};
	let isSubmitting = false;
	let submitStatus = '';
	let formErrors: Record<string, string> = {};
	let hcaptchaResponse = '';
	let hcaptchaWidgetId: string | null = null;

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

	function validateForm() {
		formErrors = {};

		if (!formData.name.trim()) {
			formErrors.name = 'Name is required';
		}

		if (!formData.email.trim()) {
			formErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			formErrors.email = 'Please enter a valid email address';
		}

		if (!formData.subject.trim()) {
			formErrors.subject = 'Subject is required';
		}

		if (!formData.message.trim()) {
			formErrors.message = 'Message is required';
		} else if (formData.message.trim().length < 10) {
			formErrors.message = 'Message must be at least 10 characters long';
		}

		if (!hcaptchaResponse) {
			formErrors.captcha = 'Please complete the captcha';
		}

		return Object.keys(formErrors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		// Check honeypot field
		if (formData.honeypot) {
			console.log('Spam detected');
			return;
		}

		isSubmitting = true;
		submitStatus = '';

		try {
			// Submit form with captcha
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					...formData,
					captcha: hcaptchaResponse
				})
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			// Reset form
			formData = {
				name: '',
				email: '',
				subject: '',
				message: '',
				honeypot: ''
			};

			// Reset captcha
			if (hcaptchaWidgetId && window.hcaptcha) {
				window.hcaptcha.reset(hcaptchaWidgetId);
			}
			hcaptchaResponse = '';

			submitStatus = 'success';
		} catch {
			submitStatus = 'error';
		} finally {
			isSubmitting = false;
		}
	}

	function onCaptchaVerify(token: string) {
		hcaptchaResponse = token;
		formErrors.captcha = '';
	}

	function onCaptchaExpire() {
		hcaptchaResponse = '';
	}

	onMount(() => {
		// Load hCaptcha script
		const script = document.createElement('script');
		script.src = 'https://js.hcaptcha.com/1/api.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		script.onload = () => {
			// Initialize hCaptcha when script loads
			setTimeout(() => {
				if (window.hcaptcha && document.getElementById('hcaptcha-container')) {
					hcaptchaWidgetId = window.hcaptcha.render('hcaptcha-container', {
						sitekey: 'a4c6c6ea-ba7b-4c4a-a5d6-e7b3f2c1d8e9', // Replace with your actual site key
						callback: onCaptchaVerify,
						'expired-callback': onCaptchaExpire,
						theme: 'dark'
					});
				}
			}, 100);
		};
	});
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
			I'd love to hear from you. Send me a message and I'll respond as soon as possible.
		</p>
	</div>
</section>

<section class="contact-content">
	<div class="container">
		<div class="contact-grid">
			<!-- Contact Form -->
			<div class="form-section" in:fly={{ x: -50, duration: 800, delay: 200 }}>
				<h2>Send a Message</h2>
				<form bind:this={form} on:submit={handleSubmit} class="contact-form">
					<!-- Honeypot field (hidden) -->
					<input
						type="text"
						bind:value={formData.honeypot}
						style="display: none;"
						tabindex="-1"
						autocomplete="off"
					/>

					<div class="form-group">
						<label for="name">Name *</label>
						<input
							type="text"
							id="name"
							bind:value={formData.name}
							class:error={formErrors.name}
							required
						/>
						{#if formErrors.name}
							<span class="error-message">{formErrors.name}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="email">Email *</label>
						<input
							type="email"
							id="email"
							bind:value={formData.email}
							class:error={formErrors.email}
							required
						/>
						{#if formErrors.email}
							<span class="error-message">{formErrors.email}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="subject">Subject *</label>
						<input
							type="text"
							id="subject"
							bind:value={formData.subject}
							class:error={formErrors.subject}
							required
						/>
						{#if formErrors.subject}
							<span class="error-message">{formErrors.subject}</span>
						{/if}
					</div>

					<div class="form-group">
						<label for="message">Message *</label>
						<textarea
							id="message"
							bind:value={formData.message}
							class:error={formErrors.message}
							rows="6"
							required
						></textarea>
						{#if formErrors.message}
							<span class="error-message">{formErrors.message}</span>
						{/if}
					</div>

					<!-- hCaptcha -->
					<div class="form-group">
						<div id="hcaptcha-container" class="hcaptcha-container"></div>
						{#if formErrors.captcha}
							<span class="error-message">{formErrors.captcha}</span>
						{/if}
					</div>

					<button type="submit" class="submit-btn" disabled={isSubmitting || !hcaptchaResponse}>
						{#if isSubmitting}
							<span class="spinner"></span>
							Sending...
						{:else}
							Send Message
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								style="transition: transform 0.3s ease;"
							>
								<line x1="5" y1="12" x2="19" y2="12"></line>
								<polyline points="12,5 19,12 12,19"></polyline>
							</svg>
						{/if}
					</button>

					{#if submitStatus === 'success'}
						<div class="status-message success" in:fade>✅ Message sent successfully!</div>
					{/if}

					{#if submitStatus === 'error'}
						<div class="status-message error" in:fade>
							❌ Something went wrong. Please try again.
						</div>
					{/if}
				</form>
			</div>

			<!-- Contact Methods -->
			<div class="methods-section" in:fly={{ x: 50, duration: 800, delay: 400 }}>
				<h2>Other Ways to Reach Me</h2>
				<div class="contact-methods">
					{#each contactMethods as method, index (method.platform)}
						<a
							href={method.href}
							class="contact-method"
							in:fly={{ y: 30, duration: 600, delay: 600 + index * 100 }}
							target="_blank"
							rel="noopener noreferrer"
							data-sveltekit-reload
						>
							<div class="method-icon">{method.icon}</div>
							<div class="method-content">
								<h3>{method.platform}</h3>
								<p class="method-value">{method.value}</p>
								<p class="method-description">{method.description}</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
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
		padding: 6rem 0 2rem; /* Reduced padding */
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
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		align-items: start;
	}

	/* Form Section */
	.form-section h2 {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 1.5rem 0;
		color: white;
	}

	.contact-form {
		background: linear-gradient(145deg, rgba(30, 15, 60, 0.95), rgba(20, 10, 40, 0.95));
		padding: 2rem;
		border-radius: 16px;
		box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
		border: 1px solid rgba(139, 92, 246, 0.3);
		backdrop-filter: blur(10px);
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		color: var(--color-text-light);
		margin-bottom: 0.5rem;
		font-size: 0.95rem;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: 'Inter', sans-serif;
		transition: all 0.3s ease;
		box-sizing: border-box;
		background: rgba(0, 0, 0, 0.8);
		color: white;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--color-accent-purple);
		box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
	}

	.form-group input.error,
	.form-group textarea.error {
		border-color: #e53e3e;
	}

	.error-message {
		color: #e53e3e;
		font-size: 0.875rem;
		margin-top: 0.25rem;
		display: block;
	}

	.submit-btn {
		width: 100%;
		padding: 1rem 2rem;
		background: linear-gradient(
			135deg,
			var(--color-accent-purple) 0%,
			var(--color-accent-pink) 100%
		);
		color: white;
		border: 2px solid rgba(139, 92, 246, 0.3);
		border-radius: 12px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		position: relative;
		overflow: hidden;
		backdrop-filter: blur(10px);
		box-shadow:
			0 10px 30px rgba(0, 0, 0, 0.3),
			inset 0 0 20px rgba(139, 92, 246, 0.1);
	}

	.submit-btn::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-3px) scale(1.02);
		border-color: rgba(139, 92, 246, 0.8);
		box-shadow:
			0 20px 50px rgba(139, 92, 246, 0.5),
			inset 0 0 40px rgba(139, 92, 246, 0.2);
	}

	.submit-btn:hover:not(:disabled)::before {
		opacity: 1;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%);
	}

	.submit-btn svg {
		transition: transform 0.3s ease;
	}

	.submit-btn:hover:not(:disabled) {
		transform: translateY(-3px) scale(1.02);
		border-color: rgba(139, 92, 246, 0.8);
		box-shadow:
			0 20px 50px rgba(139, 92, 246, 0.5),
			inset 0 0 40px rgba(139, 92, 246, 0.2);
	}

	.submit-btn:hover:not(:disabled)::before {
		opacity: 1;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		background: linear-gradient(135deg, rgba(139, 92, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 100%);
	}

	.submit-btn svg {
		transition: transform 0.3s ease;
	}

	.submit-btn:hover:not(:disabled) svg {
		transform: translateX(4px);
	}

	.hcaptcha-container {
		display: flex;
		justify-content: center;
		margin: 1rem 0;
	}

	.hcaptcha-container :global(div) {
		max-width: 100%;
		overflow: hidden;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid white;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.status-message {
		margin-top: 1rem;
		padding: 1rem;
		border-radius: 8px;
		font-weight: 500;
	}

	.status-message.success {
		background: #f0fff4;
		color: #2f855a;
		border: 1px solid #9ae6b4;
	}

	.status-message.error {
		background: #fed7d7;
		color: #c53030;
		border: 1px solid #feb2b2;
	}

	/* Methods Section */
	.methods-section h2 {
		font-size: 1.8rem;
		font-weight: 700;
		margin: 0 0 1.5rem 0;
		color: white;
	}

	.contact-methods {
		margin-bottom: 0;
	}

	.contact-method {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		background: linear-gradient(145deg, rgba(30, 15, 60, 0.95), rgba(20, 10, 40, 0.95));
		border-radius: 12px;
		box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2);
		margin-bottom: 1rem;
		text-decoration: none;
		color: inherit;
		transition: all 0.3s ease;
		border: 1px solid rgba(139, 92, 246, 0.3);
		backdrop-filter: blur(10px);
	}

	.contact-method:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
		border-color: var(--color-accent-purple);
	}

	.method-icon {
		font-size: 1.5rem;
		width: 50px;
		height: 50px;
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
		font-size: 1.2rem;
		font-weight: 600;
		margin: 0 0 0.25rem 0;
		color: white;
	}

	.method-value {
		font-size: 1rem;
		font-weight: 500;
		background: linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-pink));
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin: 0 0 0.25rem 0;
	}

	.method-description {
		font-size: 0.9rem;
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

		.contact-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.form-section h2,
		.methods-section h2 {
			font-size: 1.5rem;
			margin-bottom: 1rem;
		}

		.contact-form {
			padding: 1.5rem;
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

	@media (max-width: 480px) {
		.hero-content h1 {
			font-size: 1.75rem;
		}

		.container {
			padding: 0 1rem;
		}

		.contact-form {
			padding: 1.25rem;
		}
	}
</style>
