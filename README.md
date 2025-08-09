# Portfolio Blog Setup

## How to Add Blog Posts

This portfolio includes a simple, static blog system built from Markdown files. Follow these steps to add new blog posts:

### 1. Create a New Blog Post

1. Navigate to the `assets/blog/` directory
2. Create a new Markdown file with a descriptive filename: `{slug}.md`
   - Example: `my-awesome-project.md` or `learning-react-hooks.md`

### 2. Write Your Post

Structure your blog post with optional frontmatter for metadata:

```markdown
---
title: Your Blog Post Title
date: 2025-08-09
tags: [javascript, react, web-development]
hero: https://example.com/cover-image.jpg
excerpt: A brief description that appears on the blog listing page.
---

# Your Blog Post Title

Your content goes here. Write in standard Markdown format.

## Subheadings

- Use bullet points
- Add code blocks
- Include images

```js
// Code examples work great
function example() {
  return "Hello, world!";
}
```

That's it!
```

### 3. Frontmatter Fields (All Optional)

- **title**: Post title (fallback: first H1 heading or filename)
- **date**: Publication date in YYYY-MM-DD format
- **tags**: Array of tags for filtering `[tag1, tag2, tag3]`
- **hero**: Cover image URL (can be external URL or relative path)
- **excerpt**: Brief description for the listing page (fallback: first paragraph)

### 4. Build the Blog Index

After adding or editing posts, regenerate the blog index:

```bash
node assets/scripts/build-blog-index.mjs
```

This command:
- Scans all `.md` files in `assets/blog/`
- Generates `assets/blog/posts.json` with post metadata
- Enables the blog listing page to display your posts

### 5. View Your Blog

- Open `blogs.html` to see all posts with filtering options
- Click any post card to read the full article
- Posts are sorted by date (newest first)

### Tips

- Keep image files reasonably sized for web performance
- Use descriptive filenames that work well as URL slugs
- The blog supports the portfolio's themes (Newsprint, Sepia, Night)
- No server required - works with any static hosting service

### Example Post Structure

Check out `assets/blog/hello-world.md` for a working example of a blog post.