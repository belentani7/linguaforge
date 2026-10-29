const keys = new Set(Array.from({length:4}, (_,i) => [0,1].map(j => `week-${i}-task-${j}`)).flat());
export function sanitizeProgress(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const clean = {};
  for (const key of keys) if (Object.hasOwn(input,key) && input[key] === true) clean[key] = true;
  return clean;
}
export function completedCount(input) {
  return Object.keys(sanitizeProgress(input)).length;
}
