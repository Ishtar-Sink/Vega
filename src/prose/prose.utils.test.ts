import type { HastElement as Element, HastRoot as Root } from './prose.types';
import { proseUrlTransform, rehypeProseLinks } from './prose.utils';

function element(tagName: string, properties: Element['properties']): Element {
  return { type: 'element', tagName, properties, children: [] };
}

describe('proseUrlTransform', () => {
  it.each(['https://exemplo.com', '/caminho', '#ancora', 'mailto:a@b.c'])('keeps %s', (url) => {
    expect(proseUrlTransform(url)).toBe(url);
  });

  it.each(['javascript:alert(1)', ' JavaScript:alert(1)', 'data:text/html,x', 'vbscript:x'])(
    'blocks %s',
    (url) => {
      expect(proseUrlTransform(url)).toBe('');
    },
  );
});

describe('rehypeProseLinks', () => {
  it('adds rel to external links and lazy loading to images', () => {
    const external = element('a', { href: 'https://exemplo.com' });
    const internal = element('a', { href: '/interno' });
    const image = element('img', { src: 'https://exemplo.com/a.png' });
    const paragraph: Element = { ...element('p', {}), children: [external, internal] };
    const tree: Root = { type: 'root', children: [paragraph, image] };

    rehypeProseLinks()(tree);

    expect(external.properties.rel).toEqual(['noopener', 'noreferrer']);
    expect(internal.properties.rel).toBeUndefined();
    expect(image.properties.loading).toBe('lazy');
  });
});
