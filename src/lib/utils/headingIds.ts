function stripMarkdownArtifacts(raw: string): string {
	return (
		raw
			// [text](url) -> text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			// `code` -> code
			.replace(/`([^`]+)`/g, '$1')
			// emphasis markers
			.replace(/[*_~]/g, '')
	);
}

export function slugifyHeading(raw: string): string {
	const normalized = stripMarkdownArtifacts(raw).normalize('NFKC').trim().toLowerCase();

	const cleaned = normalized.replace(/[^0-9a-z\u3040-\u30ff\u3400-\u9fff\s-]/g, '');

	const slug = cleaned.replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '');
	return slug || 'section';
}

export function createHeadingIdGenerator(): (rawHeading: string) => string {
	const counts = new Map<string, number>();

	return (rawHeading: string) => {
		const base = slugifyHeading(rawHeading);
		const current = counts.get(base) ?? 0;
		const next = current + 1;
		counts.set(base, next);
		return current === 0 ? base : `${base}-${next}`;
	};
}
