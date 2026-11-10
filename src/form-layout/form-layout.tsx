import type { ComponentPropsWithRef } from 'react';
import { Button } from '../button/button';
import styles from './form-layout.module.css';

export type FormGridProps = ComponentPropsWithRef<'div'>;

/** Grade do formulário; um filho com `data-span="full"` ocupa a linha inteira. */
export function FormGrid({ className, ...rest }: FormGridProps) {
  return <div {...rest} className={[styles.grid, className].filter(Boolean).join(' ')} />;
}

export interface FormActionsProps extends ComponentPropsWithRef<'div'> {
  /** Texto do botão de cancelar. Padrão: `Cancelar`. */
  cancelLabel?: string;
  /** Texto do botão de enviar. Padrão: `Salvar`. */
  submitLabel?: string;
  /** Chamado ao cancelar. */
  onCancel: () => void;
  /** Mostra o carregamento no botão de enviar e bloqueia o clique. */
  loading?: boolean;
  /** Desabilita o botão de enviar. */
  submitDisabled?: boolean;
}

export function FormActions({
  cancelLabel = 'Cancelar',
  submitLabel = 'Salvar',
  onCancel,
  loading = false,
  submitDisabled = false,
  className,
  ...rest
}: FormActionsProps) {
  return (
    <div
      {...rest}
      className={[styles.actions, className].filter(Boolean).join(' ')}
      data-span="full"
    >
      <Button variant="muted" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant="primary" type="submit" loading={loading} disabled={submitDisabled}>
        {submitLabel}
      </Button>
    </div>
  );
}
