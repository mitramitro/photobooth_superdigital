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

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    DEFAULT: '#1D4ED8',
                    dark: '#1E3A8A',
                    darker: '#172554',
                    light: '#3B82F6',
                    lighter: '#DBEAFE',
                    subtle: '#EFF6FF',
                },
                success: {
                    DEFAULT: '#059669',
                    subtle: '#ECFDF5',
                    border: '#A7F3D0',
                },
                warning: {
                    DEFAULT: '#D97706',
                    subtle: '#FFFBEB',
                    border: '#FDE68A',
                },
                danger: {
                    DEFAULT: '#DC2626',
                    subtle: '#FEF2F2',
                    border: '#FECACA',
                },
                ink: {
                    DEFAULT: '#0F172A',
                    muted: '#64748B',
                    faint: '#94A3B8',
                },
                canvas: '#F8FAFC',
                surface: '#FFFFFF',
                edge: '#E2E8F0',
            },
            borderRadius: {
                DEFAULT: '8px',
                input: '8px',
                card: '10px',
                modal: '14px',
            },
            boxShadow: {
                card: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
                cardHover: '0 4px 12px -2px rgba(15, 23, 42, 0.08)',
                pop: '0 10px 30px -8px rgba(15, 23, 42, 0.18)',
            },
        },
    },

    plugins: [forms],
};
