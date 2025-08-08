### Blog: authoring and build

This site supports a simple, static blog built from Markdown files placed in `assets/blog/`.

#### Write posts
- Create a new Markdown file in `assets/blog/` named `{slug}.md`, e.g. `my-first-post.md`.
- Optional frontmatter (YAML-like) at the top of the file controls metadata:

```md
---
title: My First Post
date: 2025-08-08
tags: [design, dev]
hero: https://example.com/cover.jpg
excerpt: One-liner shown on the list page.
---

# My First Post
Content here...
```

If any field is missing:
- `title` falls back to the first `# H1` in the content, or the slug.
- `excerpt` is auto-derived from the first paragraph.
- `readingTime` is auto-estimated based on word count.

#### Build the posts index
The listing page (`blogs.html`) reads `assets/blog/posts.json`. Generate or refresh it by running:

```sh
node assets/scripts/build-blog-index.mjs
```

This scans `assets/blog/*.md` and writes `assets/blog/posts.json` that contains an array of objects like:

```json
{
  "slug": "my-first-post",
  "title": "My First Post",
  "date": "2025-08-08",
  "tags": ["design", "dev"],
  "hero": "https://example.com/cover.jpg",
  "excerpt": "One-liner shown on the list page.",
  "readingTime": "3 min read"
}
```

#### View
- Open `blogs.html` to see the list with filters. Click a card to open the post page.
- `post.html?slug={slug}` renders the Markdown via a tiny client-side renderer.

#### Notes
- Works on any static host (no server required).
- Keep images reasonably sized. `hero` can be a full URL or a relative path.
- The blog respects the portfolio’s themes (Newsprint, Sepia, Night). The theme selector persists via `localStorage`.


