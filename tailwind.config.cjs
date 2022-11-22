const colors = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    colors: {
      mauve: Object.entries(colors.mauveDark).reduce((acc, [k, v]) => {
        acc[k.slice("mauve".length)] = v;
        return acc;
      }, {}),
      crimson: Object.entries(colors.crimsonDark).reduce((acc, [k, v]) => {
        acc[k.slice("crimson".length)] = v;
        return acc;
      }, {}),
      transparent: "rgba(0, 0, 0, 0)",
    },
    extend: {
      fontFamily: {
        sans: ["Inter"],
        mono: ["JetBrains Mono"],
      },
      typography: ({ theme }) => ({
        default: {
          css: {
            "--tw-prose-body": theme("colors.mauve[12]"),
            "--tw-prose-headings": theme("colors.crimson[9]"),
            "--tw-prose-lead": theme("colors.mauve[12]"),
            "--tw-prose-links": theme("colors.crimson[9]"),
            "--tw-prose-bold": theme("colors.mauve[12]"),
            "--tw-prose-counters": theme("colors.mauve[12]"),
            "--tw-prose-bullets": theme("colors.mauve[11]"),
            "--tw-prose-hr": theme("colors.mauve[11]"),
            "--tw-prose-quotes": theme("colors.mauve[11]"),
            "--tw-prose-quote-borders": theme("colors.mauve[11]"),
            "--tw-prose-captions": theme("colors.mauve[11]"),
            "--tw-prose-code": theme("colors.mauve[12]"),
            "--tw-prose-pre-code": theme("colors.mauve[12]"),
            "--tw-prose-pre-bg": theme("colors.transparent"),
            "--tw-prose-th-borders": theme("colors.mauve[7]"),
            "--tw-prose-td-borders": theme("colors.mauve[7]"),
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
