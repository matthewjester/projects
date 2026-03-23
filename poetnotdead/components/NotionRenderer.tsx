'use client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .replace(/-+/g, '-')
    .trim();
}

function getRichTextPlain(items: any[]): string {
  return items.map((i) => i.plain_text).join('');
}

function RichText({ items }: { items: any[] }) {
  return (
    <>
      {items.map((item, i) => {
        const text = item.plain_text;
        if (item.href)
          return <a key={i} href={item.href} target="_blank" rel="noopener noreferrer">{text}</a>;
        if (item.annotations?.bold) return <strong key={i}>{text}</strong>;
        if (item.annotations?.italic) return <em key={i}>{text}</em>;
        if (item.annotations?.code) return <code key={i}>{text}</code>;
        return <span key={i}>{text}</span>;
      })}
    </>
  );
}

export function TableOfContents({ blocks, locale = 'ru' }: { blocks: any[]; locale?: string }) {
  const headings = blocks
    .filter((b) => b.type === 'heading_2' || b.type === 'heading_3')
    .map((b) => {
      const text = getRichTextPlain(b[b.type].rich_text);
      return { type: b.type as string, text, id: slugify(text) };
    });

  if (headings.length < 2) return null;

  return (
    <nav className="toc">
      <div className="toc-title">{locale === 'en' ? 'In this article' : 'В этой статье'}</div>
      <ol className="toc-list">
        {headings.map((h) => (
          <li key={h.id} className={`toc-item${h.type === 'heading_3' ? ' toc-sub' : ''}`}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default function NotionRenderer({ blocks }: { blocks: any[] }) {
  // Group consecutive bulleted/numbered list items
  const grouped: any[] = [];
  for (const block of blocks) {
    const last = grouped[grouped.length - 1];
    if (block.type === 'bulleted_list_item') {
      if (last?.listType === 'ul') last.items.push(block);
      else grouped.push({ listType: 'ul', items: [block] });
    } else if (block.type === 'numbered_list_item') {
      if (last?.listType === 'ol') last.items.push(block);
      else grouped.push({ listType: 'ol', items: [block] });
    } else {
      grouped.push(block);
    }
  }

  return (
    <div className="notion-content">
      {grouped.map((item, idx) => {
        // Bulleted list
        if (item.listType === 'ul') {
          return (
            <ul key={idx}>
              {item.items.map((b: any) => (
                <li key={b.id}><RichText items={b.bulleted_list_item.rich_text} /></li>
              ))}
            </ul>
          );
        }
        // Numbered list
        if (item.listType === 'ol') {
          return (
            <ol key={idx}>
              {item.items.map((b: any) => (
                <li key={b.id}><RichText items={b.numbered_list_item.rich_text} /></li>
              ))}
            </ol>
          );
        }

        const b = item as any;

        switch (b.type) {
          case 'paragraph':
            return b.paragraph.rich_text.length > 0
              ? <p key={b.id}><RichText items={b.paragraph.rich_text} /></p>
              : <div key={b.id} className="notion-spacer" />;

          case 'heading_1': {
            const text = getRichTextPlain(b.heading_1.rich_text);
            return <h1 key={b.id} id={slugify(text)}><RichText items={b.heading_1.rich_text} /></h1>;
          }
          case 'heading_2': {
            const text = getRichTextPlain(b.heading_2.rich_text);
            return <h2 key={b.id} id={slugify(text)}><RichText items={b.heading_2.rich_text} /></h2>;
          }
          case 'heading_3': {
            const text = getRichTextPlain(b.heading_3.rich_text);
            return <h3 key={b.id} id={slugify(text)}><RichText items={b.heading_3.rich_text} /></h3>;
          }

          case 'quote':
            return <blockquote key={b.id}><RichText items={b.quote.rich_text} /></blockquote>;

          case 'code':
            return (
              <pre key={b.id}><code><RichText items={b.code.rich_text} /></code></pre>
            );

          case 'divider':
            return <hr key={b.id} />;

          case 'image': {
            const imgUrl = b.image?.file?.url || b.image?.external?.url;
            const caption = b.image?.caption?.[0]?.plain_text || '';
            return imgUrl ? (
              <figure key={b.id}>
                <img src={imgUrl} alt={caption} style={{ maxWidth: '100%', borderRadius: '8px' }} />
                {caption && <figcaption>{caption}</figcaption>}
              </figure>
            ) : null;
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
