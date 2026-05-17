import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: [
				// worktree source
				path.resolve(__dirname),
				// parent repo node_modules (shared via git worktree)
				path.resolve(__dirname, '../../node_modules')
			]
		}
	}
});
