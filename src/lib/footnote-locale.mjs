// Match the same filename suffix that determines an article's language.
export function footnoteLocale() {
  return (tree, file) => {
    const english = /\.en\.md$/i.test(file.path ?? '');
    const visit = (node, inFootnotes = false) => {
      const section = inFootnotes || node.properties?.dataFootnotes !== undefined;
      if (section && node.tagName === 'h2' && node.properties?.id === 'footnote-label') {
        node.children = [{ type: 'text', value: english ? 'References' : '参考文献' }];
      }
      if (node.properties?.dataFootnoteBackref !== undefined) {
        node.properties.ariaLabel = english ? 'Back to citation' : '返回引用位置';
      }
      for (const child of node.children ?? []) visit(child, section);
    };
    visit(tree);
  };
}
