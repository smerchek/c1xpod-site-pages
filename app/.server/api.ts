import { z } from "zod";

export const feedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  attachments: z.array(
    z.object({
      url: z.string(),
      mime_type: z.string(),
      size_in_byte: z.number(),
      duration_in_seconds: z.number(),
    })
  ),
  url: z.string(),
  content_html: z.string(),
  content_text: z.string(),
  date_published: z.string(),
  _microfeed: z.object({
    is_audio: z.boolean(),
    is_document: z.boolean(),
    is_external_url: z.boolean(),
    is_video: z.boolean(),
    is_image: z.boolean(),
    web_url: z.string(),
    json_url: z.string(),
    rss_url: z.string(),
    guid: z.string(),
    status: z.string(),
    duration_hhmmss: z.string(),
    "itunes:title": z.string().optional(),
    "itunes:episodeType": z.string().optional(),
    "itunes:episode": z.number().optional(),
    "itunes:explicit": z.boolean().optional(),
    "spotify:url": z.string().optional(),
    "youtube:url": z.string().optional(),
    date_published_short: z.string(),
    date_published_ms: z.number(),
  }),
});

export const feedSchema = z.object({
  version: z.string(),
  title: z.string(),
  home_page_url: z.string(),
  feed_url: z.string(),
  description: z.string(),
  icon: z.string(),
  favicon: z.string(),
  authors: z.array(z.object({ name: z.string() })),
  language: z.string(),
  items: z.array(feedItemSchema),
  _microfeed: z.object({
    microfeed_version: z.string(),
    base_url: z.string(),
    categories: z.array(
      z.union([
        z.object({
          name: z.string(),
          categories: z.array(z.object({ name: z.string() })),
        }),
        z.object({ name: z.string() }),
      ])
    ),
    subscribe_methods: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        url: z.string(),
        image: z.string(),
        enabled: z.boolean(),
        editable: z.boolean(),
        id: z.string(),
      })
    ),
    description_text: z.string(),
    "itunes:title": z.string(),
    copyright: z.string(),
    "itunes:type": z.string(),
    items_sort_order: z.string(),
  }),
});

export type Episode = z.infer<typeof feedItemSchema>;

export async function getEpisodes(): Promise<Episode[]> {
  const response = await fetch("https://feed.c1xpod.com/json");
  const data = await response.json();

  return feedSchema.parse(data).items;
}

export async function getEpisode(id: string): Promise<Episode | null> {
  const response = await fetch(`https://feed.c1xpod.com/i/${id}/json`);
  const data = await response.json();

  const feedItems = feedSchema.parse(data).items;

  return feedItems[0] ?? null;
}
