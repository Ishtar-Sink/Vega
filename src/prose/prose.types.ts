import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { Components, ExtraProps, Options } from 'react-markdown';
import type rehypeSanitize from 'rehype-sanitize';

/** Troca a renderização de um elemento do Markdown (ex.: `h2`, `code`). */
export type ProseComponents = Components;

/** Plugin remark que acrescenta sintaxe do produto (ex.: matemática). */
export type ProsePlugin = NonNullable<Options['remarkPlugins']>[number];

/** Tamanho do texto: `base` (16 px) ou `reading` (18 px). */
export type ProseSize = 'base' | 'reading';

export interface ProseProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  /** Markdown a renderizar. Sem ele, o `Prose` só estiliza os `children`. */
  markdown?: string;
  /** Conteúdo já em React, estilizado quando não há `markdown`. */
  children?: ReactNode;
  /** Tamanho do texto. Padrão: `base`. */
  size?: ProseSize;
  /** Componentes que substituem a renderização de elementos do Markdown. */
  components?: ProseComponents;
  /** Plugins remark do produto, aplicados depois do GFM. */
  remarkPlugins?: ProsePlugin[];
}

// Tipos hast derivados dos pacotes diretos, sem depender do `@types/hast` transitivo.
export type HastRoot = Parameters<ReturnType<typeof rehypeSanitize>>[0];
export type HastElement = NonNullable<ExtraProps['node']>;
