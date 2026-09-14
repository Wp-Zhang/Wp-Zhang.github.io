// Muted ink colors on the same neutral surfaces as the editorial layout.
const theme = (name, type, colors) => ({
  name, type,
  colors: { 'editor.background': colors.background, 'editor.foreground': colors.text },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: colors.comment } },
    { scope: ['keyword', 'storage'], settings: { foreground: colors.keyword } },
    { scope: ['string', 'string.quoted', 'string.template'], settings: { foreground: colors.string } },
    { scope: ['constant', 'constant.numeric', 'constant.language'], settings: { foreground: colors.number } },
    { scope: ['entity.name.function', 'support.function'], settings: { foreground: colors.function } },
    { scope: ['entity.name.type', 'support.type', 'support.class', 'entity.name.class'], settings: { foreground: colors.type } },
    { scope: ['variable', 'entity.other.attribute-name'], settings: { foreground: colors.text } },
  ],
});
export const codeThemes = {
  light: theme('editorial-light', 'light', {
    background: '#eaeae5', text: '#343a3a', comment: '#676e6a', keyword: '#88504f',
    string: '#526c55', number: '#85603f', function: '#645984', type: '#496978',
  }),
  dark: theme('editorial-dark', 'dark', {
    background: '#262625', text: '#d8d9d2', comment: '#a0a5a2', keyword: '#ce9992',
    string: '#a7b99b', number: '#c5ab83', function: '#b9acd0', type: '#9db6c8',
  }),
};
