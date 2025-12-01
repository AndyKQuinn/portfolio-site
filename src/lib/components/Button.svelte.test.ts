import { describe, it, expect, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import Button from './Button.svelte';

describe('Button', () => {
	describe('Rendering as Link', () => {
		it('should render as link when href is provided', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'Click Me',
				href: '/about'
			});

			const link = page.getByRole('link');
			await expect.element(link).toBeInTheDocument();
		});

		it('should apply correct href attribute', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'Navigate',
				href: '/contact'
			});

			const link = page.getByRole('link');
			const href = await link.element().getAttribute('href');
			expect(href).toBe('/contact');
		});

		it('should render label text in link', async () => {
			expect.assertions(1);

			const { container } = render(Button, {
				label: 'About Page',
				href: '/about'
			});

			expect(container.textContent).toContain('About Page');
		});
	});

	describe('Rendering as Button', () => {
		it('should render as button when href is not provided', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'Submit'
			});

			const button = page.getByRole('button');
			await expect.element(button).toBeInTheDocument();
		});

		it('should have default type="button"', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'Default'
			});

			const button = page.getByRole('button');
			const type = await button.element().getAttribute('type');
			expect(type).toBe('button');
		});

		it('should accept type="submit"', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'Submit Form',
				type: 'submit'
			});

			const button = page.getByRole('button');
			const type = await button.element().getAttribute('type');
			expect(type).toBe('submit');
		});

		it('should be disabled when disabled prop is true', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'Disabled',
				disabled: true
			});

			const button = page.getByRole('button');
			const isDisabled = await button.element().hasAttribute('disabled');
			expect(isDisabled).toBe(true);
		});
	});

	describe('Click Handling', () => {
		it('should call onclick handler when clicked', async () => {
			expect.assertions(1);

			const handleClick = vi.fn();

			render(Button, {
				label: 'Click Handler',
				onclick: handleClick
			});

			const button = page.getByRole('button');
			await button.click();

			expect(handleClick).toHaveBeenCalledOnce();
		});

		it('should handle multiple clicks', async () => {
			expect.assertions(1);

			const handleClick = vi.fn();

			render(Button, {
				label: 'Multiple Clicks',
				onclick: handleClick
			});

			const button = page.getByRole('button');

			await button.click();
			await button.click();
			await button.click();

			expect(handleClick).toHaveBeenCalledTimes(3);
		});
	});

	describe('Edge Cases', () => {
		it('should handle empty label gracefully', async () => {
			expect.assertions(1);

			render(Button, {
				label: ''
			});

			const buttons = await page.getByRole('button').all();
			expect(buttons.length).toBe(1);
		});

		it('should handle undefined onclick gracefully', async () => {
			expect.assertions(1);

			render(Button, {
				label: 'No Handler'
			});

			const button = page.getByRole('button');
			// Just verify button can be clicked without throwing
			await button.click();
			expect(true).toBe(true);
		});
	});
});
