export function flattenObject(obj: Record<string, unknown>, targetDepth = 2) {
  const result: Record<string, unknown> = {}

  function flatten(current: Record<string, unknown>, depth = 1) {
    for (const key in current) {
      if (depth === targetDepth) {
        // 목표 깊이에 도달하면 값을 저장
        result[key] = current[key]
      } else if (
        typeof current[key] === 'object' &&
        current[key] !== null &&
        !Array.isArray(current[key])
      ) {
        // 아직 목표 깊이가 아니면 재귀 호출
        flatten(current[key] as Record<string, unknown>, depth + 1)
      }
    }
  }

  flatten(obj)
  return result
}
