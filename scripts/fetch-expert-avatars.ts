/**
 * One-off / periodic maintenance script: pre-fetches each venue's Instagram
 * profile photo from unavatar.io exactly once and saves it as a local
 * static asset, instead of the app calling unavatar.io live on every
 * visitor's page load.
 *
 * Why this exists: unavatar.io's anonymous tier has a very small daily
 * quota, and even a registered/paid key only allows 50 requests/day. The
 * survey page alone can render ~100 distinct venue avatars in a single
 * pageview, so calling it live per-visitor can never work at any tier.
 * Caching once, here, decouples the deployed site from that quota
 * entirely (see src/components/experts/VenueAvatar.tsx, which reads the
 * manifest this script writes and never calls unavatar.io itself).
 *
 * Resumable: re-running only fetches handles missing from the manifest,
 * so it's safe to run repeatedly across multiple days as the daily quota
 * allows more through. Stops early (without erroring) the moment it hits
 * a rate limit, saving whatever progress it made first.
 *
 * Usage: pnpm run fetch:expert-avatars
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { EXPERT_CATEGORIES } from "../src/lib/experts-data";

const MANIFEST_PATH = path.join(__dirname, "..", "src", "lib", "experts-avatar-manifest.json");
const AVATARS_DIR = path.join(__dirname, "..", "public", "experts", "avatars");
const DELAY_MS = 2000;

type ManifestEntry = { path: string } | { failed: true };
type Manifest = Record<string, ManifestEntry>;

const EXTENSION_BY_CONTENT_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeFilename(handle: string): string {
  return handle.replace(/[^a-zA-Z0-9_.-]/g, "_");
}

async function loadManifest(): Promise<Manifest> {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
  } catch {
    return {};
  }
}

async function saveManifest(manifest: Manifest) {
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

async function main() {
  const handles = new Set<string>();
  for (const category of EXPERT_CATEGORIES) {
    for (const venue of category.venues) {
      if (venue.instagramHandle) handles.add(venue.instagramHandle);
    }
  }

  const manifest = await loadManifest();
  const pending = Array.from(handles).filter((h) => !manifest[h]);

  console.log(`${handles.size} total handles, ${handles.size - pending.length} already cached, ${pending.length} to fetch.`);
  if (pending.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  await mkdir(AVATARS_DIR, { recursive: true });

  let fetched = 0;
  let failed = 0;

  for (const handle of pending) {
    const res = await fetch(`https://unavatar.io/instagram/${handle}`);

    if (res.status === 429) {
      console.warn(`Rate limited after ${fetched} fetched this run. Stopping early, re-run later to continue.`);
      break;
    }

    const contentType = res.headers.get("content-type")?.split(";")[0].trim() ?? "";
    const extension = EXTENSION_BY_CONTENT_TYPE[contentType];

    if (!res.ok || !extension) {
      console.log(`  ✗ ${handle}: no usable image (status ${res.status}, content-type "${contentType}"), falls back to initials.`);
      manifest[handle] = { failed: true };
      failed++;
    } else {
      const filename = `${safeFilename(handle)}.${extension}`;
      const bytes = Buffer.from(await res.arrayBuffer());
      await writeFile(path.join(AVATARS_DIR, filename), bytes);
      manifest[handle] = { path: `/experts/avatars/${filename}` };
      fetched++;
      console.log(`  ✓ ${handle} -> ${filename}`);
    }

    await saveManifest(manifest);
    await sleep(DELAY_MS);
  }

  console.log(`Done this run: ${fetched} cached, ${failed} confirmed no image. ${pending.length - fetched - failed} left for next run.`);
}

main().catch((err) => {
  console.error("fetch-expert-avatars failed:", err);
  process.exitCode = 1;
});
