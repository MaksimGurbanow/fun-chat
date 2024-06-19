export function isValid(...props: string[]) {
  return props.every((prop) => !!prop && /[A-Z]/.test(prop) && prop.length > 4);
}