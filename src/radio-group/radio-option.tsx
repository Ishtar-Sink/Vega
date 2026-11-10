import { CheckIcon } from '../icons/interface-icons';
import { TONE_ICONS } from './radio-group.constants';
import styles from './radio-group.module.css';
import type { RadioGroupProps, RadioOption } from './radio-group.types';

interface RadioOptionItemProps {
  option: RadioOption;
  name: string;
  checked: boolean;
  variant: NonNullable<RadioGroupProps['variant']>;
  readOnly: boolean;
  describedBy?: string;
  onSelect: (value: string) => void;
}

export function RadioOptionItem({
  option,
  name,
  checked,
  variant,
  readOnly,
  describedBy,
  onSelect,
}: RadioOptionItemProps) {
  const { value, label, description, marker, disabled, tone, adornment } = option;
  const ToneIcon = tone === 'success' || tone === 'danger' ? TONE_ICONS[tone] : null;
  const className = [
    styles.option,
    styles[variant],
    tone ? styles[tone] : '',
    checked ? styles.checked : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <label className={className}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        aria-describedby={describedBy}
        className={styles.input}
        onChange={() => {
          if (!readOnly) onSelect(value);
        }}
      />
      {marker ? <span className={styles.marker}>{marker}</span> : null}
      <span className={styles.text}>
        <span>{label}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      {ToneIcon ? <ToneIcon className={styles.toneIcon} /> : null}
      {checked && variant === 'card' ? <CheckIcon className={styles.check} /> : null}
      {adornment}
    </label>
  );
}
