import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tabs } from './tabs';

const tabs = [
  { id: 'a', label: 'Resumo', panel: <p>Painel A</p> },
  { id: 'b', label: 'Detalhes', panel: <p>Painel B</p> },
  { id: 'c', label: 'Histórico', panel: <p>Painel C</p> },
];

describe('Tabs', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Tabs label="Seções" tabs={tabs} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('moves focus with arrow keys', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Seções" tabs={tabs} />);
    await user.tab();
    expect(screen.getByRole('tab', { name: 'Resumo' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Detalhes' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Histórico' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Resumo' })).toHaveFocus();
  });

  it('activates the tab on Enter', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Seções" tabs={tabs} />);
    await user.tab();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('tab', { name: 'Detalhes' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Painel B');
  });

  it('moves back with ArrowLeft and Home', async () => {
    const user = userEvent.setup();
    render(<Tabs label="Seções" tabs={tabs} />);
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Histórico' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Resumo' })).toHaveFocus();
  });

  it('calls onChange and respects the controlled value', async () => {
    const onChange = vi.fn();
    render(<Tabs label="Seções" tabs={tabs} value="b" onChange={onChange} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Painel B');
    await userEvent.click(screen.getByRole('tab', { name: 'Histórico' }));
    expect(onChange).toHaveBeenCalledWith('c');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Painel B');
  });

  it('passes className, style and data attributes to the root', () => {
    render(
      <Tabs
        label="Seções"
        tabs={tabs}
        className="extra"
        style={{ marginTop: '4px' }}
        data-testid="raiz"
      />,
    );
    const root = screen.getByTestId('raiz');
    expect(root).toContainElement(screen.getByRole('tablist'));
    expect(root).toHaveClass('extra');
    expect(root).toHaveStyle({ marginTop: '4px' });
  });
});
