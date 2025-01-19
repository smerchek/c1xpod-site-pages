import { useState } from "react";
import clsx from "clsx";

import { TinyWaveFormIcon } from "~/components/TinyWaveFormIcon";

export function AboutSection(props: React.ComponentPropsWithoutRef<"section">) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section {...props}>
      <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
        <TinyWaveFormIcon
          colors={["fill-violet-300", "fill-slate-300"]}
          className="h-2.5 w-2.5"
        />
        <span className="ml-2.5">About</span>
      </h2>
      <p
        className={clsx(
          "mt-2 text-base leading-7 text-slate-700",
          !isExpanded && "lg:line-clamp-4"
        )}
      >
        C1X is a disc golf podcast driven by the game we love, where every
        episode dives into the origin stories of players and the culture that
        links us together. Join us for laid-back conversations that feel like
        you're hanging out with friends, sharing the passion and excitement of
        disc golf.
      </p>
      {!isExpanded && (
        <button
          type="button"
          className="mt-2 hidden text-sm font-bold leading-6 text-slate-500 hover:text-slate-700 active:text-slate-900 lg:inline-block"
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </button>
      )}
    </section>
  );
}
