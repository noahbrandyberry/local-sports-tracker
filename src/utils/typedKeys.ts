export const typedKeys = <T>(object: T): (keyof T)[] =>
  Object.keys(object).filter((v) => isNaN(Number(v))) as (keyof T)[];
