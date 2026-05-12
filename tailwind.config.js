/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50:  '#f0f4ff',
					100: '#dce7ff',
					200: '#bbd0ff',
					300: '#8eafff',
					400: '#5c83fc',
					500: '#3a5bf7',
					600: '#2438ec',
					700: '#1c2bd9',
					800: '#1d27b0',
					900: '#1e278b',
					950: '#151a5e'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			}
		}
	},
	plugins: []
};
