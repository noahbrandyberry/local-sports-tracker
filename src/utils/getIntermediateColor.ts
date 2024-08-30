import { hexToRgb } from '@check-light-or-dark/utils';

export const getIntermediateColor = (...colors: string[]) => {
  const average = Math.max(colors.length, 1);
  const rgb = { r: 0, g: 0, b: 0 };
  colors.forEach((c) => {
    const { r, g, b } = hexToRgb(c);
    rgb.r += r;
    rgb.g += g;
    rgb.b += b;
  });

  rgb.r = rgb.r / average;
  rgb.g = rgb.g / average;
  rgb.b = rgb.b / average;

  return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(
    rgb.b,
  )})`;
};
