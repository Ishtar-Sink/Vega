import { defaultUrlTransform } from 'react-markdown';
import type { HastElement, HastRoot } from './prose.types';

const BLOCKED_SCHEMES = ['javascript:', 'data:', 'vbscript:'];
const EXTERNAL_LINK = /^https?:\/\//i;

type HastNode = HastRoot | HastRoot['children'][number];

/** Bloqueia esquemas que executam código, mesmo com espaços ou maiúsculas. */
export function proseUrlTransform(url: string): string {
  const normalized = url.trim().toLowerCase();
  if (BLOCKED_SCHEMES.some((scheme) => normalized.startsWith(scheme))) return '';
  return defaultUrlTransform(url);
}

function decorate(element: HastElement): void {
  if (element.tagName === 'img') {
    element.properties.loading = 'lazy';
    return;
  }
  const href = element.properties.href;
  if (element.tagName === 'a' && typeof href === 'string' && EXTERNAL_LINK.test(href)) {
    element.properties.rel = ['noopener', 'noreferrer'];
  }
}

function visit(node: HastNode): void {
  if (node.type === 'element') decorate(node);
  if ('children' in node) node.children.forEach(visit);
}

// Roda depois da sanitização e antes dos `components`, então vale mesmo se o produto trocar o `a`.
export function rehypeProseLinks() {
  return (tree: HastRoot): void => {
    visit(tree);
  };
}
