const markdownToHtml = (md: string): string => {
  // ---- Escaping helpers ----
  // Escape HTML so user-supplied text can't inject tags/scripts
  const escHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Escape attribute values (like href) so quotes/angles can't break out
  const escAttr = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  // Disallow control chars / whitespace inside URLs
  const hasBadUrlChars = (s: string) => /[\u0000-\u001F\u007F\s]/.test(s);

  // Validate and sanitize URLs: allow only http, https, mailto
  const safeUrl = (raw: string): string | null => {
    if (!raw || hasBadUrlChars(raw)) return null;
    try {
      const u = new URL(raw);
      const ok = u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'mailto:';
      return ok ? u.toString() : null;
    } catch {
      // Not a valid absolute URL → reject for MVP safety
      return null;
    }
  };

  // ---- Inline replacements (bold, italic, code, links) ----
  const inline = (s: string | undefined) => {
    if (!s) return '';

    let out = escHtml(s);

    // Inline code: `code`
    out = out.replace(/`([^`]+)`/g, (_m, code) => `<code>${code}</code>`);

    // Links: [text](url) → <a href="...">text</a>, with safe URL check
    out = out.replace(
      /$begin:math:display$([^$end:math:display$]+)\]$begin:math:text$([^()\\s]+)$end:math:text$/g,
      (_m, text, url) => {
        const u = safeUrl(url);
        if (!u) {
          // Invalid URL → just render the text without a link
          return escHtml(text);
        }
        return `<a href="${escAttr(u)}" target="_blank" rel="noopener noreferrer nofollow ugc">${escHtml(text)}</a>`;
      },
    );

    // Bold: **text** or __text__
    out = out
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_ (very naive but works for MVP)
    out = out
      .replace(/(^|[^\*])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[^_])_(?!\s)([^_]+?)_(?!_)/g, '$1<em>$2</em>');

    return out;
  };

  // ---- Block parsing ----
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html: string[] = [];
  let inUl = false,
    inOl = false,
    inCode = false;

  // Utility: close any open lists
  const closeLists = () => {
    if (inUl) {
      html.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      html.push('</ol>');
      inOl = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw?.replace(/\s+$/, '');

    if (line === undefined) continue;

    // Code fences: ```
    if (line.startsWith('```')) {
      if (!inCode) {
        closeLists();
        inCode = true;
        html.push('<pre><code>');
      } else {
        inCode = false;
        html.push('</code></pre>');
      }
      continue;
    }

    // Inside code block → escape everything literally
    if (inCode) {
      html.push(escHtml(line) + '\n');
      continue;
    }

    // Empty line → close lists
    if (line.trim() === '') {
      closeLists();
      continue;
    }

    // Headings: #..###### text
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      closeLists();
      const level = h[1]?.length;
      html.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    // Ordered list: "1. text"
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ol) {
      if (!inOl) {
        closeLists();
        html.push('<ol class="list-decimal list-inside">');
        inOl = true;
      }
      html.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }

    // Unordered list: "- text", "* text", or "+ text"
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ul) {
      if (!inUl) {
        closeLists();
        html.push('<ul>');
        inUl = true;
      }
      html.push(`<li class="list-disc list-inside">${inline(ul[1])}</li>`);
      continue;
    }

    // Fallback: paragraph
    closeLists();
    html.push(`<p>${inline(line)}</p>`);
  }

  // Close any still-open tags
  if (inCode) html.push('</code></pre>');
  closeLists();

  return html.join('\n');
};

export default markdownToHtml;
