import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface TextAreaFieldProps extends ComponentPropsWithRef<'textarea'> {
  /** Rótulo visível do campo. */
  label: string;
  /** Texto de ajuda abaixo do campo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` e marca o campo como inválido. */
  error?: string;
  /** Ajusta `rows` ao conteúdo, entre `minRows` e `maxRows`. */
  autoResize?: boolean;
  /** Mínimo de linhas com `autoResize`. Padrão: 3. */
  minRows?: number;
  /** Máximo de linhas com `autoResize`. Padrão: 12. */
  maxRows?: number;
  /** Contador (ex.: "3 de 30 linhas"); lido junto do campo, sem anúncio a cada tecla. */
  counter?: ReactNode;
}
