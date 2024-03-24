import type { PluginOption } from "vite";

type VariableName = `--${string}`;
type ColorScheme = "light" | "dark";

type PluginOptions = {
  defaultScheme: ColorScheme;
  persistKey?: string;
  adaptive?: boolean;
  variables?: Record<ColorScheme, Record<VariableName, string>>;
};

export function colorScheme(options: PluginOptions) {
  return {
    name: "vite-plugin-color-scheme",
    transformIndexHtml(html: string) {
      const script = template(options);
      return html.replace("</head>", `${script}</head>`);
    },
  } satisfies PluginOption;
}

const template = ({
  defaultScheme,
  adaptive = true,
  persistKey = "",
  variables = { light: {}, dark: {} },
}: PluginOptions) => /*html*/ `
<script>
  (function () {
    const defaultScheme = '${defaultScheme}';
    const persistKey = '${persistKey}';
    const adaptive = ${adaptive};
    const variables = ${JSON.stringify(variables)};

    function updateColorScheme(colorScheme) {
      window.COLOR_SCHEME = colorScheme;

      const root = document.documentElement;

      root.style.setProperty('color-scheme', colorScheme);

      const scheme = variables[colorScheme];

      for (const [key, value] of Object.entries(scheme)) {
        root.style.setProperty(key, value);
      }
    }

    function getColorScheme() {
      let persisted = null;

      if (persistKey) {
        try {
          persisted = JSON.parse(window.localStorage.getItem(persistKey));
        } catch (error) {}
      }

      const hasPersistedPreference =
        typeof persisted === 'string' &&
        ['light', 'dark'].indexOf(persisted) !== -1;

      if (hasPersistedPreference) {
        return persisted;
      }

      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const hasMediaQueryPreference = typeof mql.matches === 'boolean';

      if (hasMediaQueryPreference) {
        return mql.matches ? 'dark' : 'light';
      }

      return defaultScheme;
    }

    // Get and update initial color scheme
    const colorScheme = getColorScheme();

    updateColorScheme(colorScheme);

    // Id adaptive is enabled, listen for changes
    if (adaptive) {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (e) => {
          updateColorScheme(e.matches ? "dark" : "light");
        });
    }
  })();
</script>
`;
