import type { ThemeRegistrationRaw } from "shiki";

interface Palette {
  foreground: string;
  keyword: string;
  string: string;
  function: string;
  number: string;
  type: string;
  comment: string;
  punctuation: string;
}

/**
 * Every token colour clears 4.5:1 against --code and --code-highlight
 * (styles/globals.css) in its mode. Re-check the ratios after changing
 * either side.
 */
const lightPalette: Palette = {
  comment: "#586750",
  foreground: "#14231b",
  function: "#65582c",
  keyword: "#355b3b",
  number: "#755323",
  punctuation: "#586750",
  string: "#356b4b",
  type: "#3d635a",
};

const darkPalette: Palette = {
  comment: "#a5b59c",
  foreground: "#e5ebe1",
  function: "#e0c58b",
  keyword: "#c6d797",
  number: "#e6c28b",
  punctuation: "#b7c7ad",
  string: "#b2d7b0",
  type: "#a7c9b8",
};

const createTheme = ({
  name,
  type,
  palette,
}: {
  name: string;
  type: "light" | "dark";
  palette: Palette;
}): ThemeRegistrationRaw => ({
  colors: {
    "editor.background": "#00000000",
    "editor.foreground": palette.foreground,
  },
  name,
  settings: [
    { settings: { foreground: palette.foreground } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { fontStyle: "italic", foreground: palette.comment },
    },
    {
      scope: [
        "string",
        "string.template",
        "punctuation.definition.string",
        "markup.inserted",
      ],
      settings: { foreground: palette.string },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.operator.new",
        "keyword.operator.expression",
        "variable.language",
        "punctuation.definition.template-expression",
      ],
      settings: { foreground: palette.keyword },
    },
    {
      scope: [
        "keyword.operator",
        "punctuation",
        "meta.brace",
        "punctuation.definition.tag",
        "punctuation.separator",
        "punctuation.terminator",
        "punctuation.accessor",
      ],
      settings: { foreground: palette.punctuation },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call entity.name.function",
        "entity.name.command",
        "entity.other.attribute-name",
      ],
      settings: { foreground: palette.function },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "constant.other",
        "support.constant",
        "keyword.other.unit",
        "markup.deleted",
      ],
      settings: { foreground: palette.number },
    },
    {
      scope: [
        "entity.name.type",
        "entity.name.class",
        "entity.other.inherited-class",
        "support.type",
        "support.class",
        "entity.name.tag",
      ],
      settings: { foreground: palette.type },
    },
    {
      scope: [
        "variable",
        "variable.other.property",
        "variable.other.object.property",
        "meta.object-literal.key",
      ],
      settings: { foreground: palette.foreground },
    },
    {
      scope: [
        "support.type.property-name",
        "support.type.property-name.css",
        "support.type.property-name.json",
        "punctuation.support.type.property-name",
        "variable.css",
        "variable.argument.css",
      ],
      settings: { foreground: palette.keyword },
    },
    {
      scope: [
        "meta.property-value.css",
        "support.constant.property-value",
        "support.constant.property-value.css",
      ],
      settings: { foreground: palette.string },
    },
  ],
  type,
});

export const asciicnLight = createTheme({
  name: "asciicn-light",
  palette: lightPalette,
  type: "light",
});

export const asciicnDark = createTheme({
  name: "asciicn-dark",
  palette: darkPalette,
  type: "dark",
});
