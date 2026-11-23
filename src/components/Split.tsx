import { Fragment, type ElementType } from 'react';

/**
 * Heading split into masked words for the reveal. Screen readers get the sentence once,
 * from aria-label; the word spans are decorative.
 */
export default function Split({ as: Tag = 'h2', text, className = '', em = [] }: { as?: ElementType; text: string; className?: string; em?: string[] }) {
  const words = text.split(' ');
  return (
    <Tag data-split className={className} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className={em.includes(w.replace(/[.,—]/g, '')) || em.includes(w) ? 'italic text-plum' : undefined}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </Tag>
  );
}
