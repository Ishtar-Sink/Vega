import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { GridIcon, ListIcon } from '../icons';
import { ViewSwitcher } from '../view-switcher/view-switcher';
import { Toolbar, type ToolbarProps } from './toolbar';

const views = [
  { value: 'list', label: 'Lista', icon: <ListIcon /> },
  { value: 'grid', label: 'Grade', icon: <GridIcon /> },
];

function setup(
  onSearchChange: (value: string) => void = () => undefined,
  props: Partial<ToolbarProps> = {},
) {
  return render(
    <Toolbar
      searchLabel="Buscar"
      searchValue=""
      onSearchChange={onSearchChange}
      filters={<span>Filtros</span>}
      {...props}
    >
      <ViewSwitcher label="Visualização" options={views} value="list" onChange={() => undefined} />
    </Toolbar>,
  );
}

describe('Toolbar', () => {
  it('has no axe violations', async () => {
    const { container } = setup();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('calls onSearchChange', async () => {
    const onSearchChange = vi.fn();
    setup(onSearchChange);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar' }), 'a');
    expect(onSearchChange).toHaveBeenCalledWith('a');
  });

  it('marks the active view with aria-pressed', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Lista' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Grade' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('uses Buscar as the default search label', () => {
    render(<Toolbar searchValue="" onSearchChange={() => undefined} />);
    expect(screen.getByRole('searchbox', { name: 'Buscar' })).toBeInTheDocument();
  });

  it('accepts another search label', () => {
    setup(undefined, { searchLabel: 'Search' });
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('reaches the search and the views with the keyboard', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    setup(onSearchChange);
    await user.tab();
    expect(screen.getByRole('searchbox', { name: 'Buscar' })).toHaveFocus();
    await user.keyboard('ab');
    expect(onSearchChange).toHaveBeenNthCalledWith(1, 'a');
    expect(onSearchChange).toHaveBeenNthCalledWith(2, 'b');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Lista' })).toHaveFocus();
  });

  it('passes className, style and data attributes to the root', () => {
    setup(undefined, {
      className: 'extra',
      style: { marginTop: '4px' },
      'data-testid': 'raiz',
    } as Partial<ToolbarProps>);
    const root = screen.getByTestId('raiz');
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
    expect(root.querySelector('[role="search"]')).not.toBeNull();
  });
});
