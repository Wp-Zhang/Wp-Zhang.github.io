# 博客前端 · 本地设计稿

## 参考研究

参考仓库：https://github.com/larashero3-dotcom/lieflat-charts

阅读了 `color-presets.js` 的 WIRE 配色和 `templates/color/lupi-wire.html` 的实际样式。Wire 本质上是黑灰阶加单一强调色的配色方案，并不是博客模板。其纸色为 `#F0F0EE`，正文为 `#1F1E1C`，强调色为 `#F5572F`；次级文字、网格与标注依靠灰阶区分。模板使用 Inter / Noto Sans SC，无衬线字、细线与紧凑标注构成编辑风格。

本次借鉴灰阶层次、留白、细线和克制的强调方式；重新设计博客首页、目录、关于与正文。英文正文使用自托管 Source Serif 4 可变字体，界面使用自托管 Inter。中文标题及正文使用系统黑体回退。不同设备的中文字体会因本机字体而略有差异。

## 版式

- 外框最大 1120px；桌面左右至少 56px，手机 24px。
- 首页与目录采用 1:3 栏位，左侧放索引或日期，右侧承载内容；手机改为单栏。
- 正文最大 900px，文章标题区 940px；英文正文 19px / 1.55，手机 18px / 1.55；中文正文 17.5px / 1.7，手机 17px / 1.65。
- 纸面 `#f5f5f2`、墨色 `#20201e`；深色模式采用中性黑灰。
- `src/styles/global.css` 的 `--accent: #000000` 是独立强调色入口，用于小标记和文字选区。两种主题均保留纯黑值。交互焦点使用主题正文色确保可见。
- 无卡片阴影、彩色标签或装饰插图。分隔线、字体大小和空间表达层级。

## 本地预览

运行 `npm run dev -- --host 0.0.0.0 --port 4321`，访问首页、文章目录与关于页的中英文版本。设计审核样张未提交到仓库。当前没有公开文章，正式首页与目录展示空状态，历史文章仍不发布。

## 字体阅读性修订

不存在对所有读者都最优的单一字体。本轮选择结合官方设计说明、现有视觉风格与用户关于细笔画的反馈。

| 候选 | 依据与取舍 |
| --- | --- |
| Source Serif 4 | Adobe 提供文本到展示字号的光学尺寸，适合保留出版物气质并调整细笔画。选作英文正文与标题。 |
| Inter | 官方强调较高 x-height 对混合大小写文字的阅读帮助。选作导航和界面；不用于替代全文的出版物字体。 |
| IBM Plex Serif | 同家族包含 Sans、Serif、Mono 和多个字重，技术与人文兼具；本轮作为备选。 |

实施：正文 450、标题 650、strong/b 700；正文 opsz 固定 20，标题 opsz 24，避免大标题自动切换到更精细的 Display 造型。英文斜体使用真实字体文件。中文标题使用黑体 650，系统缺少对应字重时允许合成加粗。移除强制 antialiased 设置，由平台采用原生文字渲染。导航增至 14px、550 字重，辅助文本适当放大。强调色保持纯黑。

字体由 Fontsource 包提供，通过 Astro 打包到本站；仅引入 Latin / Latin Extended，按需加载，font-display: swap。OFL 授权文本随 public/fonts 发布。

资料：
- https://fonts.adobe.com/fonts/source-serif-4
- https://blog.adobe.com/en/publish/2021/03/04/source-serif-gets-optical-sizes
- https://github.com/rsms/inter
- https://www.ibm.com/design/language/typography/typeface/
- https://blog.adobe.com/en/publish/2022/06/23/letting-machine-learning-choose-the-right-font-for-everyone

## 富文本阅读能力

正文增宽至 900px；Shiki 明暗高亮随主题切换。使用 remark-math + rehype-katex 渲染公式，GFM 脚注生成角标与文末参考文献。标签链接到静态筛选页，仅包含公开内容。写作语法见 [writing.md](writing.md)。构建检查阻止 design 样张路径进入生产输出。

## 技术长文密度

内容定位为技术讨论与思考，密度介于论文与普通文章之间。字号小幅缩减，主要压缩行高、段落、标题、代码与公式的垂直空白。正文段落间距 1em，二级标题上间距 1.6em、下间距 0.6em，公式上下间距 0.8em。参考文献标题及回链的无障碍文案按文章文件的 .zh.md / .en.md 后缀生成，不同时展示双语。
