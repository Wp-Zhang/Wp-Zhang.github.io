import { unified } from '@astrojs/markdown-remark';
import { footnoteLocale } from './footnote-locale.mjs';
import { codeThemes } from './code-themes.mjs';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export const markdown = {
  processor: unified({
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: 'warn', trust: false }], footnoteLocale],
    remarkRehype: {
      footnoteLabel: '参考文献',
      footnoteBackLabel: '返回引用位置',
    },
  }),
  shikiConfig: {
    themes: codeThemes,
    wrap: false,
  },
};
