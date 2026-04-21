# WordPress React Blog (Headless CMS)

Modern frontend blog aplikacija izgrađena sa **React + Vite**, koja koristi **WordPress REST API** kao headless CMS.

---

## Demo

https://wordpress-react-blog-bruka9ws6-stefanst96s-projects.vercel.app/

---

## Opis projekta

Ovaj projekat predstavlja frontend aplikaciju koja konzumira WordPress API i prikazuje blog sadržaj kroz moderan React UI.

Cilj projekta:

- prikaz realnog rada sa API-jem
- izgradnja skalabilne React arhitekture
- implementacija UX obrazaca koji se koriste u produkciji

---

## Funkcionalnosti

- Lista postova (WordPress API)
- Pretraga postova (debounced search)
- Single post prikaz
- Featured image podrška
- Skeleton loading (bolji UX)
- Pagination ("Load more")
- Error handling
- Empty state UI

---

## Arhitektura

Projekt je organizovan po principu separation of concerns:

src/

- components/ # UI komponente
- hooks/ # custom React hooks
- pages/ # stranice (Posts, Post, itd.)
- services/ # API komunikacija
- styles/ # SCSS moduli

---

## Tehnologije

- React (Hooks)
- Vite
- SCSS Modules
- React Router
- WordPress REST API

---

## Ključni koncepti

### 🔹 Custom Hooks

- `usePosts` – fetch + pagination
- `usePost` – single post fetch
- `useDebounce` – optimizacija search-a

---

### 🔹 UX optimizacije

- Skeleton loading umesto spinner-a
- Debounced search (300ms delay)
- Load more pagination
- Empty & error states

---

## WordPress API

Aplikacija koristi:

```
/wp-json/wp/v2/posts?_embed
```

Za rad je potreban WordPress backend (lokalni ili online).

---

## Moguća unapređenja

- Infinite scroll
- Category filter
- Dark mode
- Authentication (JWT)
- Admin dashboard
- Caching (React Query)

---

## Šta ovaj projekat pokazuje

Ovaj projekat demonstrira:

- rad sa REST API
- razumevanje React arhitekture
- pisanje čistog i modularnog koda
- implementaciju realnih UX obrazaca
- spremnost za rad na produkcijskim aplikacijama

---
