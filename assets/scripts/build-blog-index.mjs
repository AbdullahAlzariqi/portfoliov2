#!/usr/bin/env node
// Build a lightweight posts index from Markdown files in assets/blog
// Usage: node assets/scripts/build-blog-index.mjs

import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const rootDir = path.dirname(path.dirname(path.dirname(url.fileURLToPath(import.meta.url))));
const blogDir = path.join(rootDir, 'assets', 'blog');
const outFile = path.join(blogDir, 'posts.json');

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return [{}, text];
  const end = text.indexOf('\n---', 3);
  if (end === -1) return [{}, text];
  const fmRaw = text.slice(3, end).trim();
  const rest = text.slice(end + 4);
  const meta = {};
  for (const line of fmRaw.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_\-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    // naive parse for arrays like [a, b]
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^"|"$/g, '').replace(/^'|'$/g, ''))
        .filter(Boolean);
    } else {
      val = val.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
    }
    meta[key] = val;
  }
  return [meta, rest];
}

function estimateReadingTime(text) {
  const words = (text.replace(/```[\s\S]*?```/g, '').match(/\b\w+\b/g) || []).length;
  const minutes = Math.max(1, Math.round(words / 225));
  return `${minutes} min read`;
}

function toSlug(filename) {
  return filename.replace(/\.md$/i, '');
}

async function build() {
  try {
    const entries = await fs.readdir(blogDir, { withFileTypes: true });
    const mdFiles = entries.filter((e) => e.isFile() && e.name.toLowerCase().endsWith('.md')).map((e) => e.name);
    const posts = [];

    for (const file of mdFiles) {
      const slug = toSlug(file);
      const full = path.join(blogDir, file);
      const raw = await fs.readFile(full, 'utf8');
      const [meta, body] = parseFrontmatter(raw);
      const lines = body.split(/\r?\n/).map((l) => l.trim());
      const firstPara = lines.find((l) => l.length > 0 && !l.startsWith('#')) || '';
      const titleFromH1 = (body.match(/^#\s+(.+)$/m) || [])[1];
      const title = meta.title || titleFromH1 || slug;
      const date = meta.date || '';
      const tags = Array.isArray(meta.tags) ? meta.tags : (typeof meta.tags === 'string' && meta.tags ? meta.tags.split(',').map(s=>s.trim()) : []);
      const hero = meta.hero || '';
      const excerpt = meta.excerpt || firstPara.slice(0, 280);
      const readingTime = estimateReadingTime(body);
      posts.push({ slug, title, date, tags, hero, excerpt, readingTime });
    }

    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    await fs.writeFile(outFile, JSON.stringify(posts, null, 2) + '\n');
    console.log(`Built ${posts.length} posts → ${path.relative(rootDir, outFile)}`);
  } catch (err) {
    console.error('blog_index:build_error', err);
    process.exitCode = 1;
  }
}

build();


