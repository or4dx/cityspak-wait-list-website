"use client";

import { useState } from "react";
import { getInitials } from "@/lib/experts-data";
import avatarManifest from "@/lib/experts-avatar-manifest.json";

interface VenueAvatarProps {
  name: string;
  instagramHandle: string;
  color: string;
  size?: number;
  /** Dimmed until the venue is marked "Been here", matching the
   * prototype's .vrow:not(.visited) .vimg opacity treatment. */
  dim?: boolean;
}

type ManifestEntry = { path: string } | { failed: true };
const manifest = avatarManifest as Record<string, ManifestEntry>;

/**
 * Shows a venue's Instagram profile photo from a locally cached copy (see
 * scripts/fetch-expert-avatars.ts), not a live unavatar.io call. unavatar.io's
 * daily quota (50/day even on a paid key) can't cover a single pageview's
 * worth of avatars, so the app never calls it directly, only the pre-fetch
 * script does, once, ahead of time. Falls back to colored initials when a
 * venue has no handle, wasn't fetched yet, or genuinely has no photo.
 */
export function VenueAvatar({ name, instagramHandle, color, size = 44, dim = false }: VenueAvatarProps) {
  const [failed, setFailed] = useState(false);
  const cached = instagramHandle ? manifest[instagramHandle] : undefined;
  const imgUrl = cached && "path" in cached ? cached.path : "";
  const showImage = Boolean(imgUrl) && !failed;

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg text-xs font-bold text-white transition-opacity ${
        dim ? "opacity-40" : "opacity-100"
      }`}
      style={{ width: size, height: size, background: showImage ? "#1A1A15" : color }}
    >
      {showImage ? (
        // Served from /public, a locally cached copy, not next/image's remote
        // optimizer (there's no external domain here to configure).
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
