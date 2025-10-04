// src/routes/blog/[slug]/+page.server.ts
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const { slug } = params;
	const filePath = path.resolve('src/posts', `${slug}.md`);
	try {
		const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
		const htmlContent = marked(fileContent);

		// JSONオブジェクトを返す
		return {
			status: 200,
			body: htmlContent
		};
	} catch {
		return error(404, `Post not found: ${slug}`);
	}
}
