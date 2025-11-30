import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
	captcha: string;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData: ContactFormData = await request.json();

		// Validate required fields
		const requiredFields = ['name', 'email', 'subject', 'message', 'captcha'];
		for (const field of requiredFields) {
			if (!formData[field as keyof ContactFormData]?.trim()) {
				return json({ error: `${field} is required` }, { status: 400 });
			}
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Verify hCaptcha
		const captchaSecret = env.HCAPTCHA_SECRET_KEY;
		if (!captchaSecret) {
			console.error('HCAPTCHA_SECRET_KEY is not configured');
			return json({ error: 'Server configuration error' }, { status: 500 });
		}

		const verifyResponse = await fetch('https://hcaptcha.com/siteverify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				secret: captchaSecret,
				response: formData.captcha
			})
		});

		const verifyData = await verifyResponse.json();
		if (!verifyData.success) {
			return json({ error: 'Captcha verification failed' }, { status: 400 });
		}

		// Here you would typically:
		// 1. Send email using a service like SendGrid, Nodemailer, etc.
		// 2. Save to database
		// 3. Send notification

		// For now, we'll just log the form data and return success
		console.log('Contact form submission:', {
			name: formData.name,
			email: formData.email,
			subject: formData.subject,
			message: formData.message,
			timestamp: new Date().toISOString()
		});

		return json({
			success: true,
			message: 'Message sent successfully!'
		});
	} catch (error) {
		console.error('Contact form error:', error);
		return json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
	}
};
