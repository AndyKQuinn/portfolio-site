import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const HCAPTCHA_SECRET = env.HCAPTCHA_SITE_KEY || 'STUB_KEY';
const HCAPTCHA_VERIFY_URL = 'https://hcaptcha.com/siteverify';

interface ContactFormData {
	name: string;
	email: string;
	subject: string;
	message: string;
	captcha: string;
	honeypot?: string;
}

interface HCaptchaResponse {
	success: boolean;
	'error-codes'?: string[];
}

async function verifyCaptcha(token: string): Promise<boolean> {
	try {
		const response = await fetch(HCAPTCHA_VERIFY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				secret: HCAPTCHA_SECRET,
				response: token
			})
		});

		const data: HCaptchaResponse = await response.json();
		return data.success;
	} catch (error) {
		console.error('Captcha verification failed:', error);
		return false;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const formData: ContactFormData = await request.json();

		// Honeypot check
		if (formData.honeypot) {
			return json({ error: 'Spam detected' }, { status: 400 });
		}

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

		// Verify captcha
		const isCaptchaValid = await verifyCaptcha(formData.captcha);
		if (!isCaptchaValid) {
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

		// TODO: Replace this with actual email sending logic
		// Example with SendGrid:
		/*
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		const msg = {
			to: 'your-email@example.com',
			from: 'noreply@your-domain.com',
			subject: `Contact Form: ${formData.subject}`,
			text: `
				Name: ${formData.name}
				Email: ${formData.email}
				Subject: ${formData.subject}
				Message: ${formData.message}
			`,
			html: `
				<h3>New Contact Form Submission</h3>
				<p><strong>Name:</strong> ${formData.name}</p>
				<p><strong>Email:</strong> ${formData.email}</p>
				<p><strong>Subject:</strong> ${formData.subject}</p>
				<p><strong>Message:</strong> ${formData.message}</p>
			`,
		};

		await sgMail.send(msg);
		*/

		return json({
			success: true,
			message: 'Message sent successfully!'
		});
	} catch (error) {
		console.error('Contact form error:', error);
		return json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
	}
};
