import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    dark: '#080C14',
                    surface: '#0F1626',
                    card: '#151F32',
                    border: '#1E2D4A',
                    // Red Accent (Shutter / Live / Alert)
                    red: {
                        DEFAULT: '#FF2E63',
                        glow: '#FF2E634D',
                        hover: '#E02654',
                        light: '#FF5C85',
                    },
                    // Blue Accent (Primary Action / Filters / UI)
                    blue: {
                        DEFAULT: '#00F2FE',
                        glow: '#00F2FE4D',
                        dark: '#3B82F6',
                        light: '#70F8FF',
                    },
                    // Green Accent (Status Online / Print / Success)
                    green: {
                        DEFAULT: '#00F5A0',
                        glow: '#00F5A04D',
                        dark: '#10B981',
                        light: '#61FFC3',
                    },
                },
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow-spin': 'glowSpin 10s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                glowSpin: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                }
            }
        },
    },

    plugins: [forms],
};
