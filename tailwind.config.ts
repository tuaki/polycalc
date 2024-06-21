import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            // Not needed yet. The following values are the defaults.
            // colors: {
            //     primary: {
            //         50: '#e6f1fe',
            //         100: '#cce3fd',
            //         200: '#99c7fb',
            //         300: '#66aaf9',
            //         400: '#338ef7',
            //         500: '#006fee',
            //         600: '#005bc4',
            //         700: '#004493',
            //         800: '#002e62',
            //         900: '#001731',
            //         foreground: '#ffffff',
            //         DEFAULT: '#006fee',
            //     },
            // },
        },
    },
    darkMode: 'class',
    plugins: [ nextui() ],
};
