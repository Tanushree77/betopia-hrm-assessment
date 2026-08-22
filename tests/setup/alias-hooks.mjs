// Node.js ESM loader hook that resolves the project's `@/` TypeScript path
// alias (defined in tsconfig.json as "@/*" -> "./*") when running tests with
// the built-in `node --test` runner, which does not understand tsconfig
// path mappings on its own.
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = new URL('../../', import.meta.url);

function resolveAliasSpecifier(specifier) {
  const relative = specifier.slice('@/'.length);
  const basePath = fileURLToPath(new URL(relative, projectRoot));

  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}/index.ts`,
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return pathToFileURL(candidate).href;
    }
  }

  // Fall through with a best-guess `.ts` suffix so the underlying loader
  // produces a natural "module not found" error if nothing matched.
  return pathToFileURL(`${basePath}.ts`).href;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    return nextResolve(resolveAliasSpecifier(specifier), context);
  }
  return nextResolve(specifier, context);
}
