export interface Theme {
  name: string;
  path: string;
  dark: boolean;
  id: string;
}
export const defaultTheme: Theme = {
  name: "Lara - Light (Purple)",
  path: "themes/lara-light-purple/theme.css",
  dark: false,
  id: "lara-light-purple",
};

// Thanks chatGPT for generating it as requested 🦾🤖
export const themes: Theme[] = [
  {
    name: "Bootstrap4 - Light (Blue)",
    path: "themes/bootstrap4-light-blue/theme.css",
    dark: false,
    id: "bootstrap4-light-blue",
  },
  {
    name: "Bootstrap4 - Light (Purple)",
    path: "themes/bootstrap4-light-purple/theme.css",
    dark: false,
    id: "bootstrap4-light-purple",
  },
  {
    name: "Bootstrap4 - Dark (Blue)",
    path: "themes/bootstrap4-dark-blue/theme.css",
    dark: true,
    id: "bootstrap4-dark-blue",
  },
  {
    name: "Bootstrap4 - Dark (Purple)",
    path: "themes/bootstrap4-dark-purple/theme.css",
    dark: true,
    id: "bootstrap4-dark-purple",
  },
  {
    name: "Material Design - Light (Indigo)",
    path: "themes/md-light-indigo/theme.css",
    dark: false,
    id: "md-light-indigo",
  },
  {
    name: "Material Design - Light (Deep Purple)",
    path: "themes/md-light-deeppurple/theme.css",
    dark: false,
    id: "md-light-deeppurple",
  },
  {
    name: "Material Design - Dark (Indigo)",
    path: "themes/md-dark-indigo/theme.css",
    dark: true,
    id: "md-dark-indigo",
  },
  {
    name: "Material Design - Dark (Deep Purple)",
    path: "themes/md-dark-deeppurple/theme.css",
    dark: true,
    id: "md-dark-deeppurple",
  },
  {
    name: "Material Design Compact - Light (Indigo)",
    path: "themes/mdc-light-indigo/theme.css",
    dark: false,
    id: "mdc-light-indigo",
  },
  {
    name: "Material Design Compact - Light (Deep Purple)",
    path: "themes/mdc-light-deeppurple/theme.css",
    dark: false,
    id: "mdc-light-deeppurple",
  },
  {
    name: "Material Design Compact - Dark (Indigo)",
    path: "themes/mdc-dark-indigo/theme.css",
    dark: true,
    id: "mdc-dark-indigo",
  },
  {
    name: "Material Design Compact - Dark (Deep Purple)",
    path: "themes/mdc-dark-deeppurple/theme.css",
    dark: true,
    id: "mdc-dark-deeppurple",
  },
  {
    name: "Fluent Design - Light",
    path: "themes/fluent-light/theme.css",
    dark: false,
    id: "fluent-light",
  },
  {
    name: "Lara - Light (Blue)",
    path: "themes/lara-light-blue/theme.css",
    dark: false,
    id: "lara-light-blue",
  },
  {
    name: "Lara - Light (Indigo)",
    path: "themes/lara-light-indigo/theme.css",
    dark: false,
    id: "lara-light-indigo",
  },
  {
    name: "Lara - Light (Purple)",
    path: "themes/lara-light-purple/theme.css",
    dark: false,
    id: "lara-light-purple",
  },
  {
    name: "Lara - Light (Teal)",
    path: "themes/lara-light-teal/theme.css",
    dark: false,
    id: "lara-light-teal",
  },
  {
    name: "Lara - Light (Green)",
    path: "themes/lara-light-green/theme.css",
    dark: false,
    id: "lara-light-green",
  },
  {
    name: "Lara - Light (Amber)",
    path: "themes/lara-light-amber/theme.css",
    dark: false,
    id: "lara-light-amber",
  },
  {
    name: "Lara - Light (Cyan)",
    path: "themes/lara-light-cyan/theme.css",
    dark: false,
    id: "lara-light-cyan",
  },
  {
    name: "Lara - Light (Pink)",
    path: "themes/lara-light-pink/theme.css",
    dark: false,
    id: "lara-light-pink",
  },
  {
    name: "Lara - Dark (Blue)",
    path: "themes/lara-dark-blue/theme.css",
    dark: true,
    id: "lara-dark-blue",
  },
  {
    name: "Lara - Dark (Indigo)",
    path: "themes/lara-dark-indigo/theme.css",
    dark: true,
    id: "lara-dark-indigo",
  },
  {
    name: "Lara - Dark (Purple)",
    path: "themes/lara-dark-purple/theme.css",
    dark: true,
    id: "lara-dark-purple",
  },
  {
    name: "Lara - Dark (Teal)",
    path: "themes/lara-dark-teal/theme.css",
    dark: true,
    id: "lara-dark-teal",
  },
  {
    name: "Lara - Dark (Green)",
    path: "themes/lara-dark-green/theme.css",
    dark: true,
    id: "lara-dark-green",
  },
  {
    name: "Lara - Dark (Amber)",
    path: "themes/lara-dark-amber/theme.css",
    dark: true,
    id: "lara-dark-amber",
  },
  {
    name: "Lara - Dark (Cyan)",
    path: "themes/lara-dark-cyan/theme.css",
    dark: true,
    id: "lara-dark-cyan",
  },
  {
    name: "Lara - Dark (Pink)",
    path: "themes/lara-dark-pink/theme.css",
    dark: true,
    id: "lara-dark-pink",
  },
  {
    name: "Soho - Light",
    path: "themes/soho-light/theme.css",
    dark: false,
    id: "soho-light",
  },
  {
    name: "Soho - Dark",
    path: "themes/soho-dark/theme.css",
    dark: true,
    id: "soho-dark",
  },
  {
    name: "Viva - Light",
    path: "themes/viva-light/theme.css",
    dark: false,
    id: "viva-light",
  },
  {
    name: "Viva - Dark",
    path: "themes/viva-dark/theme.css",
    dark: true,
    id: "viva-dark",
  },
  { name: "Mira", path: "themes/mira/theme.css", dark: false, id: "mira" },
  { name: "Nano", path: "themes/nano/theme.css", dark: false, id: "nano" },
  {
    name: "Saga - Blue",
    path: "themes/saga-blue/theme.css",
    dark: false,
    id: "saga-blue",
  },
  {
    name: "Saga - Green",
    path: "themes/saga-green/theme.css",
    dark: false,
    id: "saga-green",
  },
  {
    name: "Saga - Orange",
    path: "themes/saga-orange/theme.css",
    dark: false,
    id: "saga-orange",
  },
  {
    name: "Saga - Purple",
    path: "themes/saga-purple/theme.css",
    dark: false,
    id: "saga-purple",
  },
  {
    name: "Vela - Blue",
    path: "themes/vela-blue/theme.css",
    dark: false,
    id: "vela-blue",
  },
  {
    name: "Vela - Green",
    path: "themes/vela-green/theme.css",
    dark: false,
    id: "vela-green",
  },
  {
    name: "Vela - Orange",
    path: "themes/vela-orange/theme.css",
    dark: false,
    id: "vela-orange",
  },
  {
    name: "Vela - Purple",
    path: "themes/vela-purple/theme.css",
    dark: false,
    id: "vela-purple",
  },
  {
    name: "Arya - Blue",
    path: "themes/arya-blue/theme.css",
    dark: false,
    id: "arya-blue",
  },
  {
    name: "Arya - Green",
    path: "themes/arya-green/theme.css",
    dark: false,
    id: "arya-green",
  },
  {
    name: "Arya - Orange",
    path: "themes/arya-orange/theme.css",
    dark: false,
    id: "arya-orange",
  },
  {
    name: "Arya - Purple",
    path: "themes/arya-purple/theme.css",
    dark: false,
    id: "arya-purple",
  },
];
