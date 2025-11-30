import { getUrl } from "@/lib/url-store"

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const urlData = await getUrl(code)

  if (!urlData || !urlData.url) {
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Not Found - URLGPT</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #fafafa;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container { text-align: center; padding: 2rem; }
          .error-code { font-size: 6rem; font-weight: 700; color: #ef4444; line-height: 1; }
          h1 { font-size: 1.5rem; margin: 1rem 0; color: #fafafa; }
          p { color: #a1a1aa; margin-bottom: 2rem; }
          a {
            display: inline-block;
            background: #22c55e;
            color: #0a0a0a;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            text-decoration: none;
            font-weight: 500;
            transition: background 0.2s;
          }
          a:hover { background: #16a34a; }
          .slug { font-family: monospace; background: #27272a; padding: 0.25rem 0.5rem; border-radius: 0.25rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-code">404</div>
          <h1>Link Not Found</h1>
          <p>The short link <span class="slug">/${code}</span> does not exist or has expired.</p>
          <a href="/">Create a New Link</a>
        </div>
      </body>
      </html>`,
      { status: 404, headers: { "Content-Type": "text/html" } },
    )
  }

  return Response.redirect(urlData.url, 302)
}
