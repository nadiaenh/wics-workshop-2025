# 🤖 ChatGPT Next.js Application

A modern chat application built with Next.js, integrating Anthropic's AI capabilities and Supabase for data storage.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic-6B46C1?style=for-the-badge&logo=anthropic&logoColor=white)

![](public/screenshot.png)

- [Next.js](https://nextjs.org/) - React framework
- [Anthropic AI SDK](https://www.anthropic.com/) - AI integration
- [Supabase](https://supabase.com/) - Backend and database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Radix UI](https://www.radix-ui.com/) - UI components

## ✨ Prerequisites

This workshop assumes that you are somewhat familiar with git, React, JavaScript, HTML, CSS, and using terminal commands.

You will also need to get:

1. **Supabase Account & Project** (free)

   - Sign up at [Supabase](https://supabase.com)
   - Create a new project
   - Get the `URL` and `anon public` key from Project Settings → Data API

2. **Anthropic API Key**

   - Sign up at [Anthropic Console](https://console.anthropic.com)
   - Navigate to API Keys section
   - Create a new API key
   - **Note:** May require credit card information

3. **Vercel Account** (free)

   - Sign up at [Vercel](https://vercel.com)
   - Create a new project

## 🚀 Getting Started

1. Make sure you have Docker and Docker Compose installed on your system:
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) (free)
   - [Docker Compose](https://docs.docker.com/compose/install/) (free)
2. Clone (or fork) this repository
3. Copy the `.env.example` file to a new file called `.env` and fill in your environment variables
4. Start the development environment (it might take a couple of minutes to start initially):
   ```bash
   docker-compose up
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Docker setup includes hot reload, so any changes you make to the files will be reflected immediately in the browser.

## ✈️ Deploying to Vercel

**Option 1: Terminal** (if you have `pnpm` and `Node.js` installed locally)

1. Install [Vercel CLI](https://vercel.com/docs/cli):
   ```bash
   npm install -g vercel
   ```
2. Run `vercel` and follow the instructions to deploy the application
3. (If not automatic) Go to Vercel Dashboard, paste your `.env` in the Project Settings, then re-deploy

**Option 2: Vercel Dashboard**

1. Go to Vercel Dashboard and create a new project from your forked repository
2. Go to Project Settings and paste your `.env` in the Environment Variables section

## 📁 Project Structure

```bash
chatgptnextjs/
├── app/                # Next.js app directory
│   ├── api/           # API route handlers
│   │   ├── chat/      # AI chat endpoints
│   │   └── conversations/ # Conversation management
│   ├── auth/          # Authentication pages and callback
│   ├── layout.tsx     # Root layout with auth and theme
│   └── page.tsx       # Main chat interface
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── chat-area.tsx # Main chat interface
│   └── chat-sidebar.tsx # Conversation sidebar
├── lib/              # Shared utilities
│   └── supabase.ts   # Supabase client and types
└── types/            # TypeScript type definitions
```

### 🗺️ Next.js App Router

The project uses Next.js 14 App Router with server-side authentication:

```bash
app/
├── layout.tsx        # Root layout with Supabase auth
├── page.tsx         # Main chat interface
├── auth/           # Authentication routes
│   ├── callback/   # OAuth callback handling
│   │   └── route.ts  # GET /auth/callback
│   └── layout.tsx  # Auth pages layout
└── api/           # API route handlers
    ├── chat/      # AI chat endpoints
    │   └── route.ts  # POST /api/chat - Authenticated AI responses
    └── conversations/  # Conversation management
        ├── route.ts   # GET & POST /api/conversations
        └── [id]/     # Specific conversation routes
            ├── route.ts   # DELETE /api/conversations/[id]
            └── messages/  # Message management
                └── route.ts # GET & POST messages
```

### 📍 API Endpoints

- `GET /auth/callback`

  - Handles OAuth callback from Supabase
  - Exchanges code for session
  - Redirects to home or error page

- `POST /api/chat`

  - Requires authentication
  - Streams AI responses using Claude
  - Accepts chat messages in request body

- `GET /api/conversations`

  - Requires authentication
  - Returns user's conversations with messages
  - Ordered by creation date (newest first)

- `POST /api/conversations`

  - Requires authentication
  - Creates conversation for current user
  - Optionally accepts initial messages

- `DELETE /api/conversations/[id]`

  - Requires authentication
  - Only deletes if user owns conversation
  - Removes conversation and all messages

- `GET /api/conversations/[id]/messages`

  - Requires authentication
  - Only returns if user owns conversation
  - Messages ordered chronologically

- `POST /api/conversations/[id]/messages`
  - Requires authentication
  - Only posts if user owns conversation
  - Creates new message in conversation

### ➕ Adding New Routes

To add new functionality:

1. Create route handler in `app/api/`:

   - Use `route.ts` for HTTP methods
   - Add server-side authentication
   - Include proper error handling

2. Add UI components in `app/`:

   - Create new page or component
   - Use client-side auth hooks if needed
   - Follow existing patterns for data fetching

3. Update types in `types/`:
   - Add new type definitions
   - Update existing types if needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐳 Docker Development Setup

This project includes a Docker setup optimized for local development. The configuration provides:

- Hot reload support (changes to files are reflected immediately)
- All development tools and dependencies
- Automatic restart on crashes
- Volume mounts for local development

### Prerequisites

- Docker
- Docker Compose

### Running with Docker

1. Copy the `.env.example` file to `.env` and fill in your environment variables:

   ```bash
   cp .env.example .env
   ```

2. Start the development environment:

   ```bash
   docker-compose up
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000)

The application will automatically reload when you make changes to the source code.

To stop the application:

```bash
docker-compose down
```

To rebuild the container (needed when dependencies change):

```bash
docker-compose up --build
```
