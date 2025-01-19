import type { Episode } from "~/.server/api";

export function getEpisodeSlug(episode: Episode) {
  const url = new URL(episode._microfeed.web_url);

  return url.pathname.split("/").filter(Boolean).pop() ?? episode.id;
}

export function parseEpisodeSlug(slug: string) {
  return slug.split("-").pop() ?? slug;
}
