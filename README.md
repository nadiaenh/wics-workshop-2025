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

![](public/capture.png)

## ✨ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm package manager (`npm install -g pnpm`)
- A Supabase account and new empty project
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
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Home page
│   └── globals.css    # Global styles
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   ├── chat-area.tsx # Main chat interface
│   └── chat-sidebar.tsx # Conversation sidebar
├── lib/              # Utility functions and services
│   ├── supabase.ts   # Supabase client configuration
│   └── utils.ts      # Helper functions
├── types/            # TypeScript types and interfaces
├── public/          # Static files
└── ...             # Configuration files
```

### 🗺️ Next.js App Router

The project uses Next.js 13+ App Router with a file-system based routing approach:

```bash
app/
├── layout.tsx        # Root layout - shared UI for all pages
├── page.tsx         # Home page (/) - main chat interface
├── globals.css      # Global styles
└── api/            # API route handlers
    ├── chat/       # Chat endpoints
    │   └── route.ts   # POST /api/chat - Stream AI responses
    └── conversations/  # Conversation management
        ├── route.ts   # GET & POST /api/conversations
        ├── [id]/      # Dynamic route for specific conversations
        │   ├── route.ts   # DELETE /api/conversations/[id]
        │   └── messages/  # Messages for a specific conversation
        │       └── route.ts # GET & POST /api/conversations/[id]/messages
```

### 📍 API Endpoints

- `POST /api/chat`

  - Streams AI responses using Anthropic's Claude model
  - Accepts chat messages in the request body

- `GET /api/conversations`

  - Retrieves all conversations with their messages
  - Messages are ordered by creation date (newest first)

- `POST /api/conversations`

  - Creates a new conversation
  - Optionally accepts initial messages

- `DELETE /api/conversations/[id]`

  - Deletes a specific conversation by ID

- `GET /api/conversations/[id]/messages`

  - Retrieves all messages for a specific conversation
  - Messages are ordered chronologically

- `POST /api/conversations/[id]/messages`
  - Adds a new message to a specific conversation

### ➕ Adding New Routes

To add new functionality:

1. Create a new directory in `app/` for the feature
2. Add a `page.tsx` for UI components
3. Add API routes in `app/api/` following the pattern:
   - Use `route.ts` for HTTP method handlers
   - Create directories for nested resources
   - Use square brackets for dynamic segments (e.g., `[id]`)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
