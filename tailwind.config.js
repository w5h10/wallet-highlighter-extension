/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: 'Inter'
		},
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			'dark',
			{
				'wh-light': {
					primary: '#000',
					'primary-focus': '#000',
					'primary-content': '#fff',

					secondary: '#cacaca',
					'secondary-focus': '',
					'secondary-content': '',

					accent: '#4277FF',
					'accent-focus': '',
					'accent-content': '',

					neutral: '#fff',
					'neutral-focus': '',
					'neutral-content': '#000',

					'base-100': '#000',
					'base-200': '#f0eff1',
					'base-300': '#FFFFFF14',
					'base-content': '#A5A5A5',

					info: '#075985',
					'info-content': '#075985',

					success: '#28CF6B',
					'success-content': '#28CF6B',

					warning: '#FF7B69',
					'warning-content': '#FF7B69',

					error: '#DF3333',
					'error-content': '#DF3333',

					'.contrast': {
						'background-color': '#F9F9F9',
						color: '#000',
						'border-color': '#F5F2FA'
					},
					'.btn-primary': {
						'border-color': '#5F1DCC',
						'background-color': '#000'
					},
					'.button[disabled]': {
						'border-color': '#A9A9A9',
						'background-color': '#A9A9A9',
						color: '#FFF'
					}
				},
				'wh-dark': {
					primary: '#853BFF',
					'primary-focus': '',
					'primary-content': '#fff',

					secondary: '#cacaca',
					'secondary-focus': '',
					'secondary-content': '',

					accent: '#4277FF',
					'accent-focus': '',
					'accent-content': '',

					neutral: '#141414', // The actual dark/light background
					'neutral-focus': '',
					'neutral-content': '#fff',

					'base-100': '#fff',
					'base-200': '#242424',
					'base-300': '#1a1a1a',
					'base-content': '#A5A5A5',

					info: '#075985',
					'info-content': '#075985',

					success: '#28CF6B',
					'success-content': '#28CF6B',

					warning: '#FF7B69',
					'warning-content': '#FF7B69',

					error: '#DF3333',
					'error-content': '#DF3333',

					'.contrast': {
						'background-color': '#1A1A1A',
						color: '#fff',
						'border-color': '#242424'
					},
					'.btn-primary': {
						'border-color': '#5F1DCC',
						'background-color': '#000'
					},
					'.btn-primary:hover': {
						'border-color': '#5F1DCC',
						'background-color': '#853BFF'
					},
					'.button[disabled]': {
						'border-color': '#3c3c3c',
						'background-color': '#3c3c3c',
						color: '#838383'
					}
				}
			}
		]
	}
};
