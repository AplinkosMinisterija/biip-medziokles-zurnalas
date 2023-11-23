export const shortenName = (name: any, lastname: any) =>
  `${name ? name.charAt(0).toUpperCase() : ''}.${lastname || ''}`;
