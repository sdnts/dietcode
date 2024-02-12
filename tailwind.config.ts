import { mauveDark, mint } from "@radix-ui/colors";
import typography from "@tailwindcss/typography";
import { type Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		colors: {
			mauve: Object.entries(mauveDark).reduce(
				(acc, [k, v]) => {
					acc[k.slice("mauve".length)] = v;
					return acc;
				},
				{} as Record<string, string>,
			),
			mint: Object.entries(mint).reduce(
				(acc, [k, v]) => {
					acc[k.slice("mint".length)] = v;
					return acc;
				},
				{} as Record<string, string>,
			),
			transparent: "rgba(0, 0, 0, 0)",
		},
		extend: {
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "sans-serif"],
				mono: ["JetBrains Mono", "ui-monospace", "monospace"],
			},
			typography: (theme: Function) => ({
				default: {
					css: {
						"--tw-prose-body": theme("colors.mauve[12]"),
						"--tw-prose-headings": theme("colors.mint[9]"),
						"--tw-prose-lead": theme("colors.mauve[12]"),
						"--tw-prose-links": theme("colors.mint[9]"),
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
	plugins: [typography()],
};

export default config;
