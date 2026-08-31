// Dynamic imports using the ESM syntax
export async function loadModule(moduleName) {
  // This is correct because it uses the ESM syntax for dynamic imports
  const module = await import(moduleName)
  return module
}

// Built using basic development resources-4-0125-preview
