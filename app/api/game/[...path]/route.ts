import { type NextRequest, NextResponse } from "next/server"

// Base location of the games in the upstream GitLab repository.
const GITLAB_BASE = "https://gitlab.com/barryjensen-dev/monkeygg2/-/raw/main/games"

// Map file extensions to sensible content types. GitLab raw serves everything
// as text/plain, which prevents browsers from executing HTML/JS, so we correct it here.
const CONTENT_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  json: "application/json; charset=utf-8",
  wasm: "application/wasm",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  ico: "image/x-icon",
  bmp: "image/bmp",
  mp3: "audio/mpeg",
  ogg: "audio/ogg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  mp4: "video/mp4",
  webm: "video/webm",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  txt: "text/plain; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  atlas: "text/plain; charset=utf-8",
}

function contentTypeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? ""
  return CONTENT_TYPES[ext] ?? "application/octet-stream"
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params

  // Guard against path traversal and empty requests.
  if (!path || path.length === 0 || path.some((seg) => seg === "..")) {
    return new NextResponse("Bad request", { status: 400 })
  }

  const encoded = path.map((seg) => encodeURIComponent(seg)).join("/")
  const upstream = `${GITLAB_BASE}/${encoded}`

  let res: Response
  try {
    res = await fetch(upstream, { headers: { "User-Agent": "Solara-Games-Proxy" } })
  } catch {
    return new NextResponse("Upstream fetch failed", { status: 502 })
  }

  if (!res.ok) {
    return new NextResponse(`Not found: ${path.join("/")}`, { status: res.status })
  }

  const buffer = await res.arrayBuffer()

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentTypeFor(encoded),
      // Cache aggressively — game assets are immutable per commit.
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
