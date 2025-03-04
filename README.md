# 🤖 ChatGPT Next.js Application

A modern chat application built with Next.js, integrating Anthropic's AI capabilities and Supabase for data storage.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic-6B46C1?style=for-the-badge&logo=anthropic&logoColor=white)

- [Next.js](https://nextjs.org/) - React framework
- [Anthropic AI SDK](https://www.anthropic.com/) - AI integration
- [Supabase](https://supabase.com/) - Backend and database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Radix UI](https://www.radix-ui.com/) - UI components

![](public/screenshot.png)

## ✨ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm package manager (`npm install -g pnpm`)
- A Supabase account (free) and new empty project (free)
  - Specifically, get the `URL` and `anon public` key values from the Project Settings (see below for more details)
- An Anthropic API key (may require credit card information)

If you don't have Node.js and/or pnpm installed, you can also just clone or fork this repository and **open it in [GitHub Codespaces](https://github.com/codespaces) or [Replit](https://replit.com)** for an instantaneous setup !

## 🚀 Getting Started

You can do everything below in your local machine, in [Github Codespaces](https://github.com/codespaces) or in [Replit](https://replit.com).

1. Clone (or fork) the repository

2. Install dependencies with `pnpm install`

3. Copy the `.env.example` file to a new `.env` file.

4. Get your Anthropic API key from the [Anthropic Console Dashboard](https://console.anthropic.com/dashboard)

5. Get your Supabase `URL` and `anon public` key (**not** `service_role secret` key) by going to your Supabase Dashboard -> Project -> Project Settings -> Data API.

6. Paste those values in your `.env` file. Make sure the values start and end with double quotes `"`.

7. Go to your Supabase Dashboard -> SQL Editor, paste the contents of the `setup.sql` file, and click "Run".

8. Go to your terminal and run `pnpm run dev`.

9. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
