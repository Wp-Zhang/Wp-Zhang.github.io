# 文章写作格式

文章仍位于 `content/posts/`，通过 `example.zh.md` / `example.en.md` 配对。只有 `status: public` 且日期不在未来的文章会发布。

## 标签

```yaml
---
title: 一则机器学习笔记
date: 2026-09-14
status: draft
tags:
  - 机器学习
  - Python
---
```

标题下方和文章目录中的标签都可点击。筛选页按标签精确匹配，区分大小写；只收录公开文章，并优先展示当前界面语言的匹配版本。中文与英文可以共用同一个标签名称；不自动翻译标签。中文、C++、带斜杠的标签均支持，URL 使用稳定的 Unicode 编码避免冲突。

## 代码高亮

围栏后写语言名，例如 python、javascript、typescript、bash、json：

````markdown
```python
def square(x):
    return x * x
```
````

代码使用 Shiki，使用自定义 Editorial Light / Dark 低饱和配色（灰绿、砖红、灰紫）；代码区背景随博客纸面主题变化。长代码可横向滚动。

## 公式

行内公式用单个美元符号：

```markdown
概率为 $p = \sigma(z)$。
```

独立公式用单独成行的双美元符号：

```markdown
$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$
```

使用 KaTeX 支持的 TeX 语法，在构建时渲染，包含供辅助技术使用的 MathML。长公式在手机上横向滚动。美元金额可写成 `\$20`，避免被识别为公式分隔符。

## 文献引用与脚注

```markdown
这个方法在相关研究中有详细介绍。[^bishop]
再次引用同一来源。[^bishop]

[^bishop]: Bishop, C. M. (2006). *Pattern Recognition and Machine Learning*. Springer. [出版社页面](https://link.springer.com/book/9780387310732)。
```

按首次引用顺序自动编号。正文显示角标，点击跳到文末独立的“参考文献”（中文）或“References”（英文）列表；文献条目后的回链返回对应的引用位置。重复引用会生成多个回链。文献条目支持斜体、链接及多段文字；编号由系统生成，不要手写编号。

这是 Markdown 文献条目系统，作者填写作者、年份、书名等信息；暂不自动读取 BibTeX、DOI 元数据或套用 CSL 引用格式。

## 页内链接

Markdown 标题会生成锚点。英文示例：

```markdown
跳转到[实验结果](#results)。

## Results
```

需要稳定、不受标题修改影响的锚点时，可以显式添加：

```markdown
<a id="experiment-results"></a>

## 实验结果
```

随后使用 `[实验结果](#experiment-results)`。锚点名在同一篇文章中保持唯一。

上述示例使用 Markdown 源文；编辑器需保存原始 `$`、围栏和 `[^key]` 语法。可通过仓库编辑器直接编辑 Markdown。
