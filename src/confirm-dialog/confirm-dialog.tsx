import { Button } from '../button/button';
import { Dialog } from '../dialog/dialog';
import type { DialogProps } from '../dialog/dialog';
import styles from './confirm-dialog.module.css';

export interface ConfirmDialogProps extends Omit<
  DialogProps,
  'children' | 'actions' | 'role' | 'onClose'
> {
  /** Texto explicativo do corpo, lido como descrição do diálogo. */
  description: string;
  /** Rótulo do botão de confirmar. Padrão: `Confirmar`. */
  confirmLabel?: string;
  /** Rótulo do botão de cancelar. Padrão: `Cancelar`. */
  cancelLabel?: string;
  /** Chamado ao confirmar. */
  onConfirm: () => void;
  /** Chamado ao cancelar ou ao apertar Esc. */
  onCancel: () => void;
}

/** Confirmação simples, montada sobre o `Dialog`. */
export function ConfirmDialog({
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  ...rest
}: ConfirmDialogProps) {
  return (
    <Dialog
      {...rest}
      role="alertdialog"
      onClose={onCancel}
      actions={
        <>
          <Button data-autofocus="" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className={styles.description}>{description}</p>
    </Dialog>
  );
}
