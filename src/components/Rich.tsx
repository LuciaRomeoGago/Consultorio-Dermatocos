import type { Rich as RichText } from '../data/types';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'blockquote';

interface Props {
  text: RichText;
  as?: Tag;
  className?: string;
}

/** Títulos que mezclan Poppins con la manuscrita, como en el diseño. */
export function Rich({ text, as: Tag = 'h2', className }: Props) {
  return (
    <Tag className={className}>
      {text.map(([part, script], i) => (
        <span key={i} className={script ? 'script' : undefined}>
          {part}
        </span>
      ))}
    </Tag>
  );
}
