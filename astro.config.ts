import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { Resvg } from "@resvg/resvg-js";
import type { AstroIntegration } from "astro";
import { defineConfig } from "astro/config";
import parseFrontmatter from "gray-matter";
import fs from "node:fs/promises";
import satori from "satori";

const render = (title: string) => ({
	type: "div",
	props: {
		style: {
			height: "100%",
			width: "100%",
			display: "flex",
			flexDirection: "column",
			backgroundColor: "#161618",
			padding: "55px 70px",
			color: "#70E1C8",
			fontFamily: "JetBrains Mono",
			fontSize: 72,
		},
		children: [
			{
				type: "svg",
				props: {
					xmlns: "http://www.w3.org/2000/svg",
					width: "48",
					height: "48",
					viewBox: "0 0 48 48",
					fill: "none",
					children: {
						type: "path",
						props: {
							d: "M7.03846 40.9615C4.91538 38.8385 6.32308 34.3846 5.23846 31.7769C4.15385 29.1692 0 26.8846 0 24C0 21.1154 4.10769 18.9231 5.23846 16.2231C6.36923 13.5231 4.91538 9.16154 7.03846 7.03846C9.16154 4.91538 13.6154 6.32308 16.2231 5.23846C18.8308 4.15385 21.1154 0 24 0C26.8846 0 29.0769 4.10769 31.7769 5.23846C34.4769 6.36923 38.8385 4.91538 40.9615 7.03846C43.0846 9.16154 41.6769 13.6154 42.7615 16.2231C43.8462 18.8308 48 21.1154 48 24C48 26.8846 43.8923 29.0769 42.7615 31.7769C41.6308 34.4769 43.0846 38.8385 40.9615 40.9615C38.8385 43.0846 34.3846 41.6769 31.7769 42.7615C29.1692 43.8462 26.8846 48 24 48C21.1154 48 18.9231 43.8923 16.2231 42.7615C13.5231 41.6308 9.16154 43.0846 7.03846 40.9615Z",
							fill: "#FFA800",
							fillOpacity: "0.75",
						},
					},
				},
			},
			{
				type: "div",
				props: {
					style: { marginTop: 96 },
					children: title,
				},
			},
		],
	},
});

const og = (): AstroIntegration => ({
	name: "og",
	hooks: {
		"astro:build:done": async ({ dir, pages, logger }) => {
			try {
				const jetBrainsMono = await fs.readFile(
					"public/fonts/satori/JetBrainsMono-Regular.ttf",
				);

				let ogCount = 0;
				for (const { pathname } of pages) {
					if (!pathname.startsWith("p/")) continue;

					const file = await Promise.any([
						fs.readFile(`src/content/post/${pathname.slice(2, -1)}.md`),
						fs.readFile(`src/content/post/${pathname.slice(2, -1)}.mdx`),
					]);

					const { title } = parseFrontmatter(file).data;
					const svg = await satori(render(title), {
						width: 1200,
						height: 630,
						fonts: [
							{
								name: "JetBrains Mono",
								data: jetBrainsMono,
								weight: 400,
								style: "normal",
							},
						],
					});

					const resvg = new Resvg(svg, {
						fitTo: {
							mode: "width",
							value: 1200,
						},
					});
					await fs.writeFile(
						`${dir.pathname}${pathname}og.png`,
						resvg.render().asPng(),
					);
					ogCount++;
				}

				logger.info(`Generated ${ogCount} OpenGraph; images`);
			} catch (e) {
				logger.error("OpenGraph image generation failed");
				throw e;
			}
		},
	},
});

export default defineConfig({
	site: "https://dietcode.io",
	integrations: [mdx(), sitemap(), tailwind(), og()],
	markdown: {
		gfm: true,
		shikiConfig: {
			theme: "poimandres",
			langs: [
				"docker",
				"glsl",
				"ruby",
				"rust",
				"sh",
				"typescript",
				"zig",
				// biome-ignore lint/suspicious/noExplicitAny: `langs` expects a type it does not export
			] as any[],
			wrap: false,
		},
	},
	redirects: {
		"/t/[...slug]": "/p/[...slug]",
	},
});
