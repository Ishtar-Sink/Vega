import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from './brand-logo.module.css';

export interface BrandLogoProps extends ComponentPropsWithRef<'div'> {
  /** Nome do produto ao lado da marca, já traduzido por quem usa. */
  name: string;
  /** Desenho da marca (SVG ou imagem), mostrado no quadrado em gradiente; é decorativo, o nome é o texto acessível. */
  mark: ReactNode;
}

/** Marca de um produto: quadrado em gradiente com o desenho recebido e o nome em texto com gradiente. */
export function BrandLogo({ name, mark, className, ...rest }: BrandLogoProps) {
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <span aria-hidden="true" className={styles.mark}>
        {mark}
      </span>
      <span className={styles.name}>{name}</span>
    </div>
  );
}
