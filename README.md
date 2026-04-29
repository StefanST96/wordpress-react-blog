# WordPress React Blog

A headless WordPress blog built with React — fast, modern, and fully responsive.

🔗 **[Live Demo](https://wordpress-react-blog.vercel.app/)**

---

## Screenshot

//

---

## Features

- 📄 Infinite scroll with automatic pagination
- 🗂️ Filter posts by category
- 🔍 Client-side search with debounce
- 🌙 Dark / Light mode with persistence
- ⚡ Session cache with TTL (5 min) per category
- 📱 Fully responsive layout
- 🔗 Dynamic single post pages (`/post/:id`)

---

## Tech Stack

| Layer       | Technology                    |
| ----------- | ----------------------------- |
| Framework   | React 19                      |
| Build tool  | Vite                          |
| Routing     | React Router v7               |
| HTTP client | Axios                         |
| Styling     | SCSS Modules                  |
| CMS         | Headless WordPress (REST API) |
| Deployment  | Vercel                        |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running WordPress instance with REST API enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/StefanST96/wordpress-react-blog.git
cd wordpress-react-blog

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_SERVER_URL=http://your-wordpress-url.com
```

### Run Locally

```bash
npm run dev
```

App runs on [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── api/            # WordPress REST API calls
├── cache/          # Session cache with TTL
├── components/     # Reusable UI components (Button, Input, Navbar...)
├── context/        # ThemeContext (dark/light mode)
├── hooks/          # Custom hooks (useInfinitePosts, useInfiniteScroll, useDebounce, usePost)
├── pages/          # Route-level pages (Home, Posts, Post, About, Contact)
├── routes/         # App routing (AppRoutes)
└── main.jsx        # Entry point
```

---

## Author

**Stefan** — [github.com/StefanST96](https://github.com/StefanST96)
