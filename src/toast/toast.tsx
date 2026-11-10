import type { ComponentPropsWithRef } from 'react';
import styles from './toast.module.css';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

const DEFAULT_TONE_LABELS: Record<ToastTone, string> = {
  info: 'Informação',
  success: 'Sucesso',
  warning: 'Atenção',
  danger: 'Erro',
};

const ICON_PATHS: Record<ToastTone, string[]> = {
  info: ['M12 11v5M12 8h.01'],
  success: ['M8 12l3 3 5-6'],
  warning: ['M12 10v4M12 17h.01'],
  danger: ['M9 9l6 6M15 9l-6 6'],
};

function ToneIcon({ tone }: { tone: ToastTone }) {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {tone === 'warning' ? <path d="M12 3l9 16H3z" /> : <circle cx="12" cy="12" r="9" />}
      {ICON_PATHS[tone].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Região fixa que anuncia os avisos com `aria-live="polite"`. */
export function ToastRegion({ className, ...rest }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...rest}
      aria-live="polite"
      className={[styles.region, className].filter(Boolean).join(' ')}
    />
  );
}

export interface ToastProps extends ComponentPropsWithRef<'div'> {
  /** Tom do aviso. Padrão: `info`. */
  tone?: ToastTone;
  /** Nome do tom lido por leitor de tela. Padrão em pt-br por tom. */
  toneLabel?: string;
}

export function Toast({
  tone = 'info',
  toneLabel = DEFAULT_TONE_LABELS[tone],
  className,
  children,
  ...rest
}: ToastProps) {
  return (
    <div {...rest} className={[styles.root, styles[tone], className].filter(Boolean).join(' ')}>
      <ToneIcon tone={tone} />
      <span className={styles.srOnly}>{`${toneLabel}: `}</span>
      <span>{children}</span>
    </div>
  );
}
