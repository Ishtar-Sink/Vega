import type { ComponentPropsWithRef, ReactNode, Ref } from 'react';
import styles from './page-header.module.css';

export interface PageHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title'> {
  /** Texto do título (`h1`). */
  title: string;
  /** Texto curto acima do título. */
  eyebrow?: string;
  /** Texto de apoio abaixo do título; some no estado compacto. */
  subtitle?: string;
  /** Ações alinhadas ao fim do cabeçalho. */
  actions?: ReactNode;
  /** "Voltar" acima do eyebrow e do título. */
  back?: ReactNode;
  /** Preso sob a barra superior: mostra o fundo de desfoque. */
  stuck?: boolean;
  /** Título menor e sem subtítulo, depois de rolar a página. */
  compact?: boolean;
  /** Ref do `h1`, para levar o foco ao título ao trocar de página. */
  headingRef?: Ref<HTMLHeadingElement>;
}

export function PageHeader({
  title,
  eyebrow,
  subtitle,
  actions,
  back,
  stuck = false,
  compact = false,
  headingRef,
  className,
  ...rest
}: PageHeaderProps) {
  const classes = [styles.root, stuck ? styles.stuck : '', compact ? styles.compact : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <header
      {...rest}
      className={classes}
      {...(stuck ? { 'data-stuck': '' } : {})}
      {...(compact ? { 'data-compact': '' } : {})}
    >
      <div className={styles.titleBlock}>
        {back ? <div className={styles.back}>{back}</div> : null}
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 ref={headingRef} tabIndex={-1} data-page-heading="" className={styles.pageHeading}>
          {title}
        </h1>
        {subtitle && !compact ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </header>
  );
}
