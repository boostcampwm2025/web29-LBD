export function removeUndefined<T extends Record<string, any>>(obj: T): T {
  return (Object.keys(obj) as (keyof T)[]).reduce((acc, key) => {
    const value = obj[key];
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {} as T);
}
