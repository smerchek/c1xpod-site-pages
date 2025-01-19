import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { getEpisode } from "~/.server/api";
import { Container } from "~/components/Container";
import { EpisodePlayButton } from "~/components/EpisodePlayButton";
import { FormattedDate } from "~/components/FormattedDate";
import { PauseIcon } from "~/components/PauseIcon";
import { PlayIcon } from "~/components/PlayIcon";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.episode) {
    return [];
  }

  const description = data.episode.content_text.split("\n\n")[0];

  return [
    {
      title: data.episode.title,
      description,
    },
    {
      "script:ld+json": {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "PodcastEpisode",
          name: data.episode.title,
          description,
          datePublished: data.episode.date_published,
          associatedMedia: {
            "@type": "AudioObject",
            contentUrl: data.episode.attachments[0].url,
          },
        }),
      },
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:title",
      content: data.episode.title,
    },
    {
      property: "og:description",
      content: description,
    },
    {
      name: "twitter:card",
      content: "summary",
    },
    {
      name: "twitter:title",
      content: data.episode.title,
    },
    {
      name: "twitter:description",
      content: description,
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.episodeId) {
    throw new Response("Not Found", { status: 404 });
  }

  const episode = await getEpisode(params.episodeId);

  if (!episode) {
    throw new Response("Not Found", { status: 404 });
  }

  return { episode };
}

export default function Episode() {
  const { episode } = useLoaderData<typeof loader>();
  const date = new Date(episode.date_published);
  const youtubeId = episode._microfeed["youtube:url"]?.split("v=")[1];

  return (
    <article className="py-16 lg:py-36">
      <Container>
        <header className="flex flex-col">
          <div className="flex items-center gap-6">
            <EpisodePlayButton
              episode={episode}
              className="group relative flex h-18 w-18 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 hover:bg-slate-900 focus:outline-none focus:ring focus:ring-slate-700 focus:ring-offset-4"
              playing={
                <PauseIcon className="h-9 w-9 fill-white group-active:fill-white/80" />
              }
              paused={
                <PlayIcon className="h-9 w-9 fill-white group-active:fill-white/80" />
              }
            />
            <div className="flex flex-col">
              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                {episode.title}
              </h1>
              <FormattedDate
                date={date}
                className="order-first font-mono text-sm leading-7 text-slate-500"
              />
            </div>
          </div>
          {/* <p className="ml-24 mt-3 text-lg font-medium leading-8 text-slate-700">
            {description}
          </p> */}
        </header>
        <hr className="my-12 border-gray-200" />
        {youtubeId && (
          <div className="aspect-video w-full max-w-2xl">
            <iframe
              className="mx-auto w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?si=wmvKwwNp6OpIopV-`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <div
          className="prose prose-slate mt-14 [&>h2:nth-of-type(3n)]:before:bg-violet-200 [&>h2:nth-of-type(3n+2)]:before:bg-indigo-200 [&>h2]:mt-12 [&>h2]:flex [&>h2]:items-center [&>h2]:font-mono [&>h2]:text-sm [&>h2]:font-medium [&>h2]:leading-7 [&>h2]:text-slate-900 [&>h2]:before:mr-3 [&>h2]:before:h-3 [&>h2]:before:w-1.5 [&>h2]:before:rounded-r-full [&>h2]:before:bg-cyan-200 [&>ul]:mt-6 [&>ul]:list-['\2013\20'] [&>ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: episode.content_html }}
        />
      </Container>
    </article>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 sm:px-6 lg:px-0">
      <p className="font-mono text-sm leading-7 text-slate-500">404</p>
      <h1 className="mt-4 text-lg font-bold text-slate-900">
        Episode not found
      </h1>
      <p className="mt-2 text-base leading-7 text-slate-700">
        Sorry, we couldn’t find the episode you’re looking for.
      </p>
      <Link
        to="/"
        className="mt-4 text-sm font-bold leading-6 text-slate-500 hover:text-slate-700 active:text-slate-900"
      >
        Go back home
      </Link>
    </div>
  );
}
