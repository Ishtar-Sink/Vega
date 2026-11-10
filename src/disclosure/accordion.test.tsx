import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './accordion';
import { Disclosure } from './disclosure';

function three(type: 'single' | 'multiple') {
  return (
    <Accordion type={type}>
      <Disclosure title="Um">a</Disclosure>
      <Disclosure title="Dois">b</Disclosure>
      <Disclosure title="Três">c</Disclosure>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('closes the others in single mode', async () => {
    const user = userEvent.setup();
    const { container } = render(three('single'));
    const all = Array.from(container.querySelectorAll('details'));
    await user.click(screen.getByText('Um'));
    await user.click(screen.getByText('Dois'));
    await waitFor(() => {
      expect(all.map((d) => d.open)).toEqual([false, true, false]);
    });
    const names = new Set(all.map((d) => d.getAttribute('name')));
    expect(names.size).toBe(1);
    expect([...names][0]).toBeTruthy();
  });

  it('keeps them independent in multiple mode', async () => {
    const user = userEvent.setup();
    const { container } = render(three('multiple'));
    await user.click(screen.getByText('Um'));
    await user.click(screen.getByText('Dois'));
    const all = Array.from(container.querySelectorAll('details'));
    await waitFor(() => {
      expect(all.map((d) => d.open)).toEqual([true, true, false]);
    });
    expect(all.every((d) => !d.hasAttribute('name'))).toBe(true);
  });

  it('passes className, style, data attributes and ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Accordion ref={ref} className="extra" style={{ color: 'red' }} data-x="1">
        <Disclosure title="Um">a</Disclosure>
      </Accordion>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('extra');
    expect(root.style.color).toBe('red');
    expect(root).toHaveAttribute('data-x', '1');
  });
});
