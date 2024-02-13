import { defineCollection, z } from "astro:content";

const post = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
	}),
});

export const collections = { post };
