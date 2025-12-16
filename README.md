# URLGPT by ExploitZ3r0

A fast, modern URL shortener built with Next.js and Upstash Redis.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by Upstash](https://img.shields.io/badge/Powered%20by-Upstash-00E9A3?style=for-the-badge&logo=redis)](https://upstash.com)

## Features

- Shorten long URLs with a single click
- Copy shortened URLs to clipboard
- Persistent storage with Upstash Redis
- Real redirects via `/s/[code]` routes
- Maximum 11 links per session
- Dark mode UI
- Deploy anywhere

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Upstash Redis
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Language:** TypeScript

---

## Environment Variables

All deployment platforms require these environment variables:

| Variable | Description |
|----------|-------------|
| `KV_REST_API_URL` | Upstash Redis REST API URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST API Token |

Get these from your [Upstash Console](https://console.upstash.com/) after creating a Redis database.

---

## Local Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Upstash Redis database

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/urlgpt.git
   cd urlgpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Upstash credentials:
   ```env
   KV_REST_API_URL=https://your-redis-url.upstash.io
   KV_REST_API_TOKEN=your-token-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## Deployment Instructions

### Vercel (Recommended)

#### Option 1: GUI Deployment

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. In the **Environment Variables** section, add:
   - `KV_REST_API_URL` = your Upstash Redis URL
   - `KV_REST_API_TOKEN` = your Upstash Redis token
5. Click **"Deploy"**

#### Option 2: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN

# Deploy to production
vercel --prod
```

---

### Render

#### Option 1: GUI Deployment

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure settings:
   - **Name:** `urlgpt`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables in the **Environment** section:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
6. Click **"Create Web Service"**

#### Option 2: Using render.yaml (Blueprint)

1. Ensure `render.yaml` exists in your repo root:
   ```yaml
   services:
     - type: web
       name: urlgpt
       env: node
       buildCommand: npm install && npm run build
       startCommand: npm start
       envVars:
         - key: KV_REST_API_URL
           sync: false
         - key: KV_REST_API_TOKEN
           sync: false
   ```
2. Go to Render Dashboard → **"Blueprints"**
3. Connect your repo and deploy

---

### Cloudflare Pages

#### Option 1: GUI Deployment

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and sign in
2. Navigate to **"Workers & Pages"** → **"Create application"**
3. Select **"Pages"** → **"Connect to Git"**
4. Select your repository
5. Configure build settings:
   - **Framework preset:** `Next.js`
   - **Build command:** `npx @cloudflare/next-on-pages@1`
   - **Build output directory:** `.vercel/output/static`
6. Add environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `NODE_VERSION` = `18`
7. Click **"Save and Deploy"**

#### Option 2: CLI Deployment

```bash
# Install Wrangler CLI
npm i -g wrangler

# Login to Cloudflare
wrangler login

# Build for Cloudflare
npx @cloudflare/next-on-pages@1

# Deploy
wrangler pages deploy .vercel/output/static --project-name=urlgpt

# Set secrets
wrangler pages secret put KV_REST_API_URL --project-name=urlgpt
wrangler pages secret put KV_REST_API_TOKEN --project-name=urlgpt
```

---

### Fly.io

#### Prerequisites

- Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)

#### Steps

1. **Login to Fly.io**
   ```bash
   flyctl auth login
   ```

2. **Launch the app**
   ```bash
   flyctl launch
   ```
   Follow the prompts to configure your app.

3. **Set environment variables**
   ```bash
   flyctl secrets set KV_REST_API_URL=https://your-redis-url.upstash.io
   flyctl secrets set KV_REST_API_TOKEN=your-token-here
   ```

4. **Deploy**
   ```bash
   flyctl deploy
   ```

#### fly.toml Configuration

```toml
app = "urlgpt"
primary_region = "iad"

[build]
  builder = "heroku/buildpacks:20"

[env]
  PORT = "3000"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[vm]]
  cpu_kind = "shared"
  cpus = 1
  memory_mb = 256
```

---

### Railway

#### Option 1: GUI Deployment

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Next.js - no build config needed
5. Go to **"Variables"** tab and add:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
6. Click **"Deploy"**

#### Option 2: CLI Deployment

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project (or create new)
railway link

# Set environment variables
railway variables set KV_REST_API_URL=https://your-redis-url.upstash.io
railway variables set KV_REST_API_TOKEN=your-token-here

# Deploy
railway up
```

---

### Docker (Self-Hosted)

#### Prerequisites

- Docker and Docker Compose installed

#### Option 1: Docker Compose (Recommended)

1. **Create `.env` file**
   ```env
   KV_REST_API_URL=https://your-redis-url.upstash.io
   KV_REST_API_TOKEN=your-token-here
   ```

2. **Ensure `docker-compose.yml` exists:**
   ```yaml
   version: '3.8'
   services:
     urlgpt:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env
       restart: unless-stopped
   ```

3. **Build and run**
   ```bash
   docker-compose up -d --build
   ```

4. **Access the app**
   Navigate to [http://localhost:3000](http://localhost:3000)

#### Option 2: Docker CLI

```bash
# Build the image
docker build -t urlgpt .

# Run the container
docker run -d \
  -p 3000:3000 \
  -e KV_REST_API_URL=https://your-redis-url.upstash.io \
  -e KV_REST_API_TOKEN=your-token-here \
  --name urlgpt \
  urlgpt
```

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

---

### DigitalOcean App Platform

#### GUI Deployment

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Navigate to **"Apps"** → **"Create App"**
3. Select **"GitHub"** as source and choose your repo
4. Configure the app:
   - **Type:** Web Service
   - **Build Command:** `npm install && npm run build`
   - **Run Command:** `npm start`
   - **HTTP Port:** `3000`
5. Add environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
6. Choose plan and click **"Create Resources"**

#### App Spec (app.yaml)

```yaml
name: urlgpt
services:
  - name: web
    github:
      repo: yourusername/urlgpt
      branch: main
    build_command: npm install && npm run build
    run_command: npm start
    http_port: 3000
    instance_size_slug: basic-xxs
    instance_count: 1
    envs:
      - key: KV_REST_API_URL
        scope: RUN_TIME
        type: SECRET
      - key: KV_REST_API_TOKEN
        scope: RUN_TIME
        type: SECRET
```

---

### AWS Amplify

#### GUI Deployment

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Select **"GitHub"** and authorize access
4. Choose your repository and branch
5. Configure build settings (auto-detected for Next.js):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
6. Add environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
7. Click **"Save and deploy"**

#### CLI Deployment

```bash
# Install Amplify CLI
npm i -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize in your project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

---

## Troubleshooting

### Common Issues

**1. "Redis connection failed"**
- Verify your `KV_REST_API_URL` and `KV_REST_API_TOKEN` are correct
- Check that your Upstash Redis database is active

**2. "Short URL not redirecting"**
- Ensure the URL was saved successfully (check browser console)
- Verify Redis has the stored key using Upstash Console

**3. "Build failed on deployment"**
- Check Node.js version (requires 18+)
- Clear cache and redeploy
- Check build logs for specific errors

**4. "Environment variables not working"**
- Ensure variables are set for the correct environment (production/preview)
- Redeploy after adding/changing environment variables

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Author

**ExploitZ3r0**

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
