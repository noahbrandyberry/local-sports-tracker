import {
  VALIDATE_REGEX,
  MATCH_REGEX,
  getBrightness,
  hexToRgb,
  rgbaToRgb,
} from '@check-light-or-dark/utils';

const BRIGHTNESS_DEGREE = 165;

function filterRgbOrRgba(color: string) {
  const { MATCH_RGB_RGBA_COLOR } = MATCH_REGEX;
  const match = color.match(MATCH_RGB_RGBA_COLOR);
  const [, r, g, b, a] = match ?? [];

  const red = parseInt(r, 10);
  const green = parseInt(g, 10);
  const blue = parseInt(b, 10);

  if (a) {
    const opacity = parseFloat(a);
    return rgbaToRgb(red, green, blue, opacity);
  }

  return {
    r: red,
    g: green,
    b: blue,
  };
}

function lightOrDarkColor(color: string) {
  const { VALIDATE_HEX_COLOR: hexRegex, VALIDATE_RGB_RGBA_COLOR: rgbRegex } =
    VALIDATE_REGEX;

  if (hexRegex.test(color)) {
    const brightness = getBrightness(hexToRgb(color));

    return brightness > BRIGHTNESS_DEGREE ? 'light' : 'dark';
  } else if (rgbRegex.test(color)) {
    const brightness = getBrightness(filterRgbOrRgba(color));

    return brightness > BRIGHTNESS_DEGREE ? 'light' : 'dark';
  }

  return null;
}

export const getColorByBackground = (backgroundColor: string) =>
  lightOrDarkColor(backgroundColor) === 'light' ? 'black' : 'white';
