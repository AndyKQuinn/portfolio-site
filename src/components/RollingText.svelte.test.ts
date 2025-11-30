import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from '@vitest/browser/context';
import RollingText from './RollingText.svelte';

describe('RollingText', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	const defaultTexts = [
		'Professional Developer',
		'Engineering Coach',
		'Documentation Nerd'
	];

	describe('Rendering', () => {
		it('should render the first text initially', async () => {
			expect.assertions(1);

			const { container } = render(RollingText, {
				texts: defaultTexts,
				interval: 3000
			});

			expect(container.textContent).toContain('Professional Developer');
		});

		it('should render with custom texts', async () => {
			expect.assertions(1);

			const customTexts = ['First', 'Second', 'Third'];

			const { container } = render(RollingText, {
				texts: customTexts,
				interval: 3000
			});

			expect(container.textContent).toContain('First');
		});

		it('should have proper container styling', async () => {
			expect.assertions(1);

			const { container } = render(RollingText, {
				texts: defaultTexts
			});

			const wrapper = container.querySelector('div');
			const classes = wrapper?.getAttribute('class');

			expect(classes).toContain('overflow-hidden');
		});
	});

	describe('Text Rotation', () => {
		it('should advance to next text after interval', async () => {
			expect.assertions(2);

			const { container } = render(RollingText, {
				texts: defaultTexts,
				interval: 3000
			});

			expect(container.textContent).toContain('Professional Developer');

			await vi.advanceTimersByTimeAsync(3000);

			expect(container.textContent).toContain('Engineering Coach');
		});

		it('should loop back to first text after reaching end', async () => {
			expect.assertions(2);

			const texts = ['First', 'Second'];

			const { container } = render(RollingText, {
				texts,
				interval: 1000
			});

			expect(container.textContent).toContain('First');

			// Advance through both texts and loop back
			await vi.advanceTimersByTimeAsync(2000);

			expect(container.textContent).toContain('First');
		});

		it('should respect custom interval', async () => {
			expect.assertions(2);

			const { container } = render(RollingText, {
				texts: ['One', 'Two', 'Three'],
				interval: 5000
			});

			expect(container.textContent).toContain('One');

			// Should not change before interval
			await vi.advanceTimersByTimeAsync(4999);
			expect(container.textContent).toContain('One');
		});
	});

	describe('Edge Cases - Empty Texts', () => {
		it('should handle empty texts array gracefully', async () => {
			expect.assertions(1);

			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const { container } = render(RollingText, {
				texts: [],
				interval: 3000
			});

			expect(consoleSpy).toHaveBeenCalledWith(
				'TextScroller: The "texts" prop is empty. No text will be displayed.'
			);

			consoleSpy.mockRestore();
		});

		it('should not render any text when texts is empty', async () => {
			expect.assertions(1);

			vi.spyOn(console, 'warn').mockImplementation(() => {});

			const { container } = render(RollingText, {
				texts: [],
				interval: 3000
			});

			const innerDiv = container.querySelector('.absolute');
			expect(innerDiv).toBeNull();
		});
	});

	describe('Edge Cases - Single Text', () => {
		it('should handle single text without errors', async () => {
			expect.assertions(2);

			const { container } = render(RollingText, {
				texts: ['Only One'],
				interval: 1000
			});

			expect(container.textContent).toContain('Only One');

			// Should still show same text after interval
			await vi.advanceTimersByTimeAsync(1000);

			expect(container.textContent).toContain('Only One');
		});
	});

	describe('Cleanup', () => {
		it('should clear interval on unmount', async () => {
			expect.assertions(1);

			const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

			const { unmount } = render(RollingText, {
				texts: defaultTexts,
				interval: 1000
			});

			unmount();

			expect(clearIntervalSpy).toHaveBeenCalled();

			clearIntervalSpy.mockRestore();
		});

		it('should not throw when unmounting with empty texts', async () => {
			expect.assertions(1);

			vi.spyOn(console, 'warn').mockImplementation(() => {});

			const { unmount } = render(RollingText, {
				texts: [],
				interval: 1000
			});

			expect(() => unmount()).not.toThrow();
		});
	});

	describe('Styling', () => {
		it('should apply gradient text styling', async () => {
			expect.assertions(1);

			const { container } = render(RollingText, {
				texts: ['Styled']
			});

			const wrapper = container.querySelector('div');
			const classes = wrapper?.getAttribute('class');

			expect(classes).toContain('[background:linear-gradient(90deg,#a78bfa_20%,#f472b6_80%)]');
		});
	});
});
