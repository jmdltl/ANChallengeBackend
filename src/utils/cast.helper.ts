export function toLowerCase(value: string): string {
  return value.toLowerCase();
}

export function trim(value: string): string {
  return value.trim();
}

export function toDate(value: string): Date {
  return new Date(value);
}

export function toBoolean(value: string): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') value = value.toLowerCase();

  return value === 'true' || value === '1' ? true : false;
}

export function toNumber(value: string): number {
  let newValue: number = Number.parseInt(value);

  if (Number.isNaN(newValue)) {
    newValue = 0;
  }

  return newValue;
}
