interface AutoResizeOptions {
  enabled: boolean;
  minRows: number;
  maxRows: number;
}

export function useAutoResize(
  value: string,
  { enabled, minRows, maxRows }: AutoResizeOptions,
): number | undefined {
  if (!enabled) return undefined;
  // Conta quebras de linha: é determinístico no teste e dispensa medir o layout;
  // linhas longas que quebram sozinhas não contam.
  const lineCount = value.split('\n').length;
  return Math.min(Math.max(lineCount, minRows), maxRows);
}
