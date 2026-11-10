import { CircleAlertIcon, CircleCheckIcon } from '../icons/interface-icons';
import type { RadioTone } from './radio-group.types';

/** Ícone de cada tom, para que o estado não dependa só da cor. */
export const TONE_ICONS: Record<Exclude<RadioTone, 'neutral'>, typeof CircleCheckIcon> = {
  success: CircleCheckIcon,
  danger: CircleAlertIcon,
};
