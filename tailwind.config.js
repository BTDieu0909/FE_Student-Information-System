/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#002555",
                "primary-container": "#d8e2ff",
                "on-primary-container": "#001a41",
                secondary: "#585f66",
                "secondary-container": "#dde3ec",
                "on-secondary-container": "#161c23",
                surface: "#f7f9fb",
                "on-surface": "#191c1e",
                "surface-variant": "#e0e3e5",
                "on-surface-variant": "#43474f",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f2f4f6",
                "surface-container": "#e6e8ea",
                outline: "#747780",
                "outline-variant": "#c4c6d1",
                "on-tertiary-container": "#dd9860",
            },
            fontFamily: {
                headline: ["Manrope", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
