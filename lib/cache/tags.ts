export function tagFor(path: string): string {
  const clean = path.replace(/^\/+/, '').replace(/[/?&=]+/g, '-');
  return `upstream-${clean || 'root'}`;
}
