"use client";

import { useState } from "react";
import { getInitials } from "@/lib/experts-data";

interface VenueAvatarProps {
  name: string;
  instagramHandle: string;
  color: string;
  size?: number;
  /** Dimmed until the venue is marked "Been here", matching the
   * prototype's .vrow:not(.visited) .vimg opacity treatment. */
  dim?: boolean;
}

/** Loads a venue's Instagram profile photo via unavatar.io, same source and
 * fallback behavior as the prototype: on any load failure (private
 * account, no such handle, no handle at all), fall back to a colored
 * initials tile. Kept as specified, no alternate image strategy. */
export function VenueAvatar({ name, instagramHandle, color, size = 44, dim = false }: VenueAvatarProps) {
  const [failed, setFailed] = useState(false);
  const imgUrl = instagramHandle ? `https://unavatar.io/instagram/${instagramHandle}` : "";
  const showImage = imgUrl && !failed;

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg text-xs font-bold text-white transition-opacity ${
        dim ? "opacity-40" : "opacity-100"
      }`}
      style={{ width: size, height: size, background: showImage ? "#1A1A15" : color }}
    >
      {showImage ? (
        // unavatar.io is a third-party runtime lookup, not an asset Next's image optimizer can serve.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
