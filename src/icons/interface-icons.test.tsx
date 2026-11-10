import { render } from '@testing-library/react';
import { createRef } from 'react';
import { axe } from 'vitest-axe';
import * as icons from './interface-icons';

const ICON_NAMES = [
  'HomeIcon',
  'BookOpenIcon',
  'LayersIcon',
  'TimerIcon',
  'UsersIcon',
  'MenuIcon',
  'ChevronLeftIcon',
  'ChevronRightIcon',
  'ChevronDownIcon',
  'ArrowLeftIcon',
  'CloseIcon',
  'PlusIcon',
  'MinusIcon',
  'DownloadIcon',
  'UploadIcon',
  'FlagIcon',
  'RefreshIcon',
  'EyeIcon',
  'CheckIcon',
  'CircleCheckIcon',
  'InfoIcon',
  'AlertTriangleIcon',
  'CircleAlertIcon',
  'WifiOffIcon',
  'CloudCheckIcon',
  'UserIcon',
  'SettingsIcon',
  'LogOutIcon',
  'SunIcon',
  'MoonIcon',
  'LightbulbIcon',
  'ClockIcon',
  'CalendarIcon',
  'PencilIcon',
  'SearchIcon',
  'TrashIcon',
] as const;

describe('ícones de interface', () => {
  it('exporta os 36 ícones da primeira leva', () => {
    expect(Object.keys(icons).sort()).toEqual([...ICON_NAMES].sort());
  });

  it.each(ICON_NAMES)('%s é decorativo, com traço currentColor e ref', (name) => {
    const Icon = icons[name];
    const ref = createRef<SVGSVGElement>();
    const { getByTestId } = render(<Icon ref={ref} data-testid="i" />);
    const svg = getByTestId('i');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '2');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(ref.current).toBe(svg);
    svg.querySelectorAll('[fill],[stroke]').forEach((child) => {
      for (const attr of ['fill', 'stroke']) {
        const value = child.getAttribute(attr);
        if (value !== null) expect(['currentColor', 'none']).toContain(value);
      }
    });
  });

  it('aceita os tamanhos 16 e 24', () => {
    const { getByTestId } = render(
      <>
        <icons.HomeIcon size={16} data-testid="p" />
        <icons.HomeIcon size={24} data-testid="g" />
      </>,
    );
    expect(getByTestId('p')).toHaveAttribute('width', '16');
    expect(getByTestId('g')).toHaveAttribute('width', '24');
  });

  it('mantém aria-hidden mesmo com outro valor', () => {
    const { getByTestId } = render(<icons.HomeIcon aria-hidden={false} data-testid="i" />);
    expect(getByTestId('i')).toHaveAttribute('aria-hidden', 'true');
  });

  it('repassa className e style', () => {
    const { getByTestId } = render(
      <icons.HomeIcon className="extra" style={{ color: 'red' }} data-testid="i" />,
    );
    const svg = getByTestId('i');
    expect(svg).toHaveClass('extra');
    expect(svg).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  });

  it('não tem violações de axe', async () => {
    const { container } = render(
      <button type="button" aria-label="Fechar">
        <icons.CloseIcon />
      </button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
