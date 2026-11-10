import type { ComponentPropsWithoutRef } from 'react';
import ReactMarkdown, { type ExtraProps } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { PROSE_SCHEMA } from './prose.constants';
import styles from './prose.module.css';
import type { ProseProps } from './prose.types';
import { proseUrlTransform, rehypeProseLinks } from './prose.utils';

type TableWrapProps = ComponentPropsWithoutRef<'table'> & ExtraProps;

// O invólucro rola a tabela larga sem tirar dela o papel de tabela.
function TableWrap(props: TableWrapProps) {
  // O `node` do hast não é atributo de DOM, então sai antes de repassar as props.
  const rest = { ...props };
  delete rest.node;
  return (
    <div className={styles.tableWrap}>
      <table {...rest} />
    </div>
  );
}

export function Prose({
  markdown,
  children,
  size = 'base',
  components,
  remarkPlugins,
  className,
  ...rest
}: ProseProps) {
  const classes = [styles.root, styles[size], className].filter(Boolean).join(' ');
  return (
    <div {...rest} className={classes}>
      {markdown === undefined ? (
        children
      ) : (
        <ReactMarkdown
          skipHtml
          remarkPlugins={[remarkGfm, ...(remarkPlugins ?? [])]}
          rehypePlugins={[[rehypeSanitize, PROSE_SCHEMA], rehypeProseLinks]}
          urlTransform={proseUrlTransform}
          components={{ table: TableWrap, ...components }}
        >
          {markdown}
        </ReactMarkdown>
      )}
    </div>
  );
}
