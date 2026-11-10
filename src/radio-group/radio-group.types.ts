import type { ComponentPropsWithRef, ReactNode } from 'react';

/** Tom de uma opção; além da cor, `success` e `danger` ganham um ícone. */
export type RadioTone = 'success' | 'danger' | 'neutral';

export interface RadioOption {
  /** Valor da opção, entregue ao `onChange`. */
  value: string;
  /** Rótulo da opção. */
  label: ReactNode;
  /** Texto de apoio abaixo do rótulo. */
  description?: ReactNode;
  /** Marcador antes do texto (ex.: a letra da alternativa). */
  marker?: ReactNode;
  /** Desabilita a opção. */
  disabled?: boolean;
  /** Tom da opção, útil para mostrar certo e errado. */
  tone?: RadioTone;
  /** Conteúdo no fim da opção (ex.: um selo). */
  adornment?: ReactNode;
}

export interface RadioGroupProps extends Omit<
  ComponentPropsWithRef<'fieldset'>,
  'onChange' | 'children'
> {
  /** Rótulo do grupo (a legenda do `<fieldset>`). */
  label: string;
  /** Esconde a legenda só visualmente; o nome acessível continua. */
  hideLabel?: boolean;
  /** Opções do grupo. */
  options: readonly RadioOption[];
  /** Valor da opção escolhida, ou `null` sem escolha. */
  value: string | null;
  /** Chamada com o valor da opção escolhida. */
  onChange: (value: string) => void;
  /** Nome dos rádios; sem ele, um nome gerado agrupa as opções. */
  name?: string;
  /** Aparência: lista simples ou cartões. */
  variant?: 'default' | 'card';
  /** Mantém a escolha atual e impede a mudança, sem esconder as opções. */
  readOnly?: boolean;
  /** Texto de ajuda abaixo do grupo. */
  help?: string;
  /** Mensagem de erro; aparece com `role="alert"` ligada ao grupo. */
  error?: string;
}
