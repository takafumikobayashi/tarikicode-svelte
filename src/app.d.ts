// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Google Analytics gtag function
declare global {
	interface Window {
		gtag?: (
			command: 'config' | 'event' | 'js' | 'set',
			targetId: string,
			config?: Record<string, unknown>
		) => void;
		dataLayer?: unknown[];
	}
}

export {};
