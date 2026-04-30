import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titlePlain: z.string(),
    client: z.string(),
    discipline: z.enum(['product', 'audio']),
    year: z.number(),
    pretitle: z.string(),
    lede: z.string(),
    summary: z.string(),
    deliverables: z.array(z.string()),
    term: z.string(),
    status: z.string(),
    order: z.number().int().min(1),
    featured: z.boolean(),
    image: z.enum(['spire', 'lattice', 'morrow', 'halftone']),
    variant: z.enum(['left', 'right']),
  }),
});

export const collections = { work };
