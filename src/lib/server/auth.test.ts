import { describe, it, expect, vi } from 'vitest';
import {
	generateSessionToken,
	sessionCookieName,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from './auth';

describe('Auth Utilities', () => {
	describe('generateSessionToken', () => {
		it('should generate a session token', () => {
			expect.assertions(1);

			const token = generateSessionToken();

			expect(token).toBeDefined();
		});

		it('should generate a non-empty string', () => {
			expect.assertions(1);

			const token = generateSessionToken();

			expect(token.length).toBeGreaterThan(0);
		});

		it('should generate unique tokens', () => {
			expect.assertions(1);

			const token1 = generateSessionToken();
			const token2 = generateSessionToken();

			expect(token1).not.toBe(token2);
		});

		it('should generate URL-safe base64 tokens', () => {
			expect.assertions(1);

			const token = generateSessionToken();

			// Base64url should not contain +, /, or =
			expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
		});

		it('should generate tokens from 18 random bytes', () => {
			expect.assertions(1);

			const token = generateSessionToken();

			// 18 bytes encoded as base64url should be 24 characters
			expect(token.length).toBe(24);
		});

		it('should handle multiple generations without errors', () => {
			expect.assertions(10);

			for (let i = 0; i < 10; i++) {
				const token = generateSessionToken();
				expect(token).toBeDefined();
			}
		});
	});

	describe('setSessionTokenCookie', () => {
		it('should set cookie with correct name and token', () => {
			expect.assertions(1);

			const mockEvent = {
				cookies: {
					set: vi.fn()
				}
			} as any;

			const token = 'test-cookie-token';
			const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

			setSessionTokenCookie(mockEvent, token, expiresAt);

			expect(mockEvent.cookies.set).toHaveBeenCalledWith(
				sessionCookieName,
				token,
				expect.objectContaining({
					expires: expiresAt,
					path: '/'
				})
			);
		});

		it('should set cookie with path /', () => {
			expect.assertions(1);

			const mockEvent = {
				cookies: {
					set: vi.fn()
				}
			} as any;

			setSessionTokenCookie(mockEvent, 'token', new Date());

			expect(mockEvent.cookies.set).toHaveBeenCalledWith(
				sessionCookieName,
				'token',
				expect.objectContaining({
					path: '/'
				})
			);
		});
	});

	describe('deleteSessionTokenCookie', () => {
		it('should delete cookie with correct name', () => {
			expect.assertions(1);

			const mockEvent = {
				cookies: {
					delete: vi.fn()
				}
			} as any;

			deleteSessionTokenCookie(mockEvent);

			expect(mockEvent.cookies.delete).toHaveBeenCalledWith(sessionCookieName, {
				path: '/'
			});
		});

		it('should delete cookie with path /', () => {
			expect.assertions(1);

			const mockEvent = {
				cookies: {
					delete: vi.fn()
				}
			} as any;

			deleteSessionTokenCookie(mockEvent);

			expect(mockEvent.cookies.delete).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					path: '/'
				})
			);
		});
	});

	describe('sessionCookieName constant', () => {
		it('should be defined', () => {
			expect.assertions(1);

			expect(sessionCookieName).toBeDefined();
		});

		it('should be a string', () => {
			expect.assertions(1);

			expect(typeof sessionCookieName).toBe('string');
		});

		it('should have the correct value', () => {
			expect.assertions(1);

			expect(sessionCookieName).toBe('auth-session');
		});
	});
});
