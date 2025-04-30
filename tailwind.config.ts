
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Solo Leveling Theme Colors
				'solo': {
					'purple': '#8B5CF6',
					'dark-purple': '#1A1F2C',
					'light-purple': '#D6BCFA',
					'blue-glow': '#33C3F0',
					'dark-bg': '#0F1320',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'glow': {
					'0%, 100%': { 
						opacity: '1',
						filter: 'brightness(100%)'
					},
					'50%': { 
						opacity: '0.8',
						filter: 'brightness(150%)' 
					}
				},
				'shadow-pulse': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(139, 92, 246, 0.5), 0 0 15px rgba(139, 92, 246, 0.3)' 
					},
					'50%': { 
						boxShadow: '0 0 10px rgba(139, 92, 246, 0.8), 0 0 25px rgba(139, 92, 246, 0.5)' 
					}
				},
				'levitate': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'shadow-pulse': 'shadow-pulse 2s ease-in-out infinite',
				'levitate': 'levitate 3s ease-in-out infinite'
			},
			backgroundImage: {
				'solo-gradient': 'linear-gradient(to right, #1A1F2C, #2C1A42)',
				'purple-glow': 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(10,10,20,0) 70%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
