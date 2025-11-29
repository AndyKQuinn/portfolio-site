// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
		}
	}

	interface Window {
		hcaptcha: {
			render: (container: string, options: Record<string, unknown>) => string;
			reset: (widgetId: string) => void;
			remove: (widgetId: string) => void;
		};
	}
	// interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};
