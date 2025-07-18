export function replacePlaceholders(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return data[key.trim()] ?? '';
  });
}
