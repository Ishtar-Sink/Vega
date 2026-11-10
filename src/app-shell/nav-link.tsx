import type { NavItem, RenderNavLink } from './nav.types';

interface NavLinkProps {
  item: NavItem;
  className: string | undefined;
  iconClassName?: string | undefined;
  badgeClassName?: string | undefined;
  renderLink?: RenderNavLink;
}

/** Link de um destino: usa o `renderLink` do produto ou, sem ele, um `<a href>` simples. */
export function NavLink({
  item,
  className,
  iconClassName,
  badgeClassName,
  renderLink,
}: NavLinkProps) {
  const ariaCurrent = item.current ? ('page' as const) : undefined;
  const children = (
    <>
      <span className={iconClassName} aria-hidden="true">
        {item.icon}
      </span>
      <span>{item.label}</span>
      {/* O espaço separa o rótulo do selo no nome acessível (ex.: "Revisar 3"). */}
      {item.badge === undefined ? null : (
        <>
          {' '}
          <span className={badgeClassName}>{item.badge}</span>
        </>
      )}
    </>
  );
  if (renderLink)
    return renderLink(item, { className: className ?? '', 'aria-current': ariaCurrent, children });
  return (
    <a href={item.href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  );
}
