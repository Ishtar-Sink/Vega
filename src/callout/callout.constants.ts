import {
  AlertTriangleIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LightbulbIcon,
} from '../icons/interface-icons';
import type { CalloutTone } from './callout.types';

/** Ícone padrão de cada tom. */
export const TONE_ICONS: Record<CalloutTone, typeof InfoIcon> = {
  neutral: InfoIcon,
  accent: LightbulbIcon,
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: AlertTriangleIcon,
  danger: CircleAlertIcon,
};
