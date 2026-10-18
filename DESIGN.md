---
name: 网络社区实验室
description: 明亮科学图谱中的社区关系探索与中文实验解读
colors:
  ground: "#f3f6fa"
  paper: "#fff"
  ink: "#172b45"
  muted: "#526781"
  line: "#d7e1ee"
  blue: "#245bc0"
  soft: "#eaf1fc"
  focus: "#245bc0"
  graph-paper: "#fcfdff"
  aside-paper: "#fafbfd"
  selection: "#c8dbff"
  scrollbar: "#9eafc6"
  error: "#9b342c"
  edge: "#7890a9"
  community-01: "#287c79"
  community-02: "#bd6144"
  community-03: "#5875b2"
  community-04: "#9874ac"
  community-05: "#a48224"
  community-06: "#5b8c48"
  community-07: "#b65078"
  community-08: "#438fbb"
  community-09: "#827048"
  community-10: "#bc864c"
  community-11: "#557a67"
  community-12: "#8c5d59"
  community-13: "#6871a0"
  community-14: "#9b6c88"
  community-15: "#647f32"
  community-16: "#358b99"
  community-17: "#a35151"
  community-18: "#6f60a5"
  community-19: "#8f7a51"
  community-20: "#437a9e"
  community-21: "#b66c8e"
  community-22: "#698c6f"
  community-23: "#ac713c"
  community-24: "#547b83"
  community-25: "#927db4"
  community-26: "#8c6542"
  community-27: "#657492"
typography:
  display:
    fontFamily: "PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.4
  title:
    fontFamily: "PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: "6px"
  row: "5px"
  panel: "12px"
  swatch: "50%"
spacing:
  control-gap: "6px"
  compact: "12px"
  panel-inset: "18px"
  section-gap: "20px"
  group-gap: "24px"
components:
  button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    typography: "{typography.body}"
  button-selected:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
  button-hover:
    backgroundColor: "{colors.soft}"
  search-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "7px 12px"
    width: "100%"
  community-row-selected:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.blue}"
    rounded: "{rounded.row}"
  detail-panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
    padding: "22px"
---

# Design System: 网络社区实验室

## Overview

**Creative North Star: "明亮科学图谱"**

以明亮、清晰的科学图谱承载可操作的数据关系。灰蓝背景衬托白色工作面，细边界组织信息，分类色服务社区识别。中文系统字体与直接的操作标签使探索和阅读保持连续。

本文件记录 frontend/style.css、frontend/index.html、frontend/app.js 和 frontend/graph.js 的现有实现。页面的 Operate / Read 任务和首屏策略由 surface brief 维护。

**Key Characteristics:**

- 白色工作面与灰蓝底色
- 分类色与编号共同标识社区
- 平面分区、细边界、清晰焦点
- 图形探索与中文说明互相补充

## Colors

### Primary

交互蓝用于视图选中态、链接、输入光标和键盘焦点；柔和蓝用于悬停及社区行选中背景。选中的视图按钮使用白色文字。

### Secondary

社区分类色由 `community-01` 至 `community-27` 按 app.js 中的顺序使用，编号超出时循环。节点、列表圆点和概览始终使用同一映射。关系线使用 edge 色，以透明度和宽度表达联系。

### Neutral

ground 承载页面，paper 承载工作台和详情，graph-paper 承载图，aside-paper 区分侧栏。ink 用于标题和主要文字，muted 用于解释，line 用于边界。selection 与 scrollbar 保持蓝灰基调。error 是加载失败容器的前景色；其段落仍继承 muted。

**The Category Rule.** 社区颜色表示身份，编号和文字共同传达信息，不表示优劣。

## Typography

显示、正文和标签采用同一中文系统无衬线字体栈，具体尺寸见前置 tokens。标题紧凑，正文行距较宽；统计值与社区规模采用等宽数字。统计大字为 19px，图标题为 16px，Canvas 标签使用 600 的 12px sans-serif，缩放时保持屏幕字号。

阅读段落行高为 1.85，段落最大宽度为 75ch。手机主标题为 24px，统计大字为 17px。原始属性使用浏览器默认 pre 等宽字体，并允许长文本换行。

## Layout

页面最大宽度 1600px，居中，默认内边距 30px 36px。工作台为弹性图区域加 300px 侧栏；图高 540px。社区列表高 310px，搜索结果最大高 160px，邻居列表最大高 170px，原始属性最大高 180px，超出时内部滚动。

1000px 以下，页面内边距改为 24px 20px，侧栏改为 260px，工具栏可换行。720px 以下，页面内边距为 20px 14px，图和侧栏上下排列，图高 420px，社区列表高 190px，标题、详情标题和图底说明纵向排列。

实验阅读区默认两列，比例 1.1:1，间隔 56px，右列有分隔线与 32px 内边距。1000px 以下间隔 24px；720px 以下单列并移除内部分隔线。间距以控件、分组与阅读层级区分密度，不强行统一成单一倍数网格。

## Elevation & Depth

界面无阴影和渐变。白色、浅灰蓝色层次与 1px 细边界区分工作区。图上标题采用半透明浅色背景保证可读性，焦点外框提供独立于颜色填充的状态提示。

## Shapes

工作台和详情使用 panel 圆角，按钮及输入使用 control 圆角，社区行使用 row 圆角。小色点与数据节点为圆形。圆形编码仅承担数据和分类角色；分区边界使用细直线。

## Components

### Buttons and view navigation

默认按钮白底深色文字、细边框，最小高度 40px。悬停用柔和蓝色，视图按钮 aria-pressed 状态使用实心交互蓝。禁用态透明度为 0.5。全局键盘焦点为 3px 交互蓝外框，外移 3px；没有装饰性过渡。下载链接复用按钮外观。

### Community rows

社区行为三列：14px 色点槽、弹性文字、节点数量，间隔 9px；最小高度 43px。选中时浅蓝底与蓝色文字，仍保留社区色点。色点直径 10px，选中状态由 aria-pressed 传达。

### Search and neighbor buttons

搜索框有可见标签，输入节点编号或类型后显示总命中数与前 30 项。结果与邻居使用原生按钮，允许键盘进入详情。邻居文本标出跨社区关系；原始记录在可展开区域中保留。

### Panels and reading

详情面板使用白底、细边界与 22px 内边距，手机改为 18px。阅读区直接排在页面背景上；算法层级行使用细下边界，复现参数使用原生 details/summary。

### Network canvas

社区概览用圆半径 `10 + sqrt(size) × 1.6` 表示规模，节点图用 `2.7 + sqrt(degree) × 0.65` 表示度。概览连线宽度随跨社区连接数增加并封顶；节点关系线固定基础宽度。聚焦节点使用深色外描边，其余节点透明度降至 0.3，非关联关系降至 0.04。标签避免局部重叠，并使用白描边提高可读性。

D3 力导向布局支持暂停、继续、适应画布、滚轮缩放、拖动画布与按钮缩放。手动移动或按钮缩放后，布局结束不会重置视图；切换数据时重置此标记。缩放范围为 0.1 至 8。减少动画偏好下，初始预计算后不自动继续模拟；用户仍可主动继续布局。布局属于空间呈现，不编码算法距离。

### Feedback and accessibility

加载状态、视图状态、搜索结果和详情提供状态或 live region。加载失败提供重新加载按钮。跳转链接在聚焦时出现。Canvas 提供中文说明，社区列表与搜索提供文字访问路径；不依赖仅靠颜色识别。

## Do's and Don'ts

### Do:

- Do 保持社区编号、颜色和文字说明在不同视图中一致。
- Do 为图形提供社区列表、搜索与详情等文字访问路径。
- Do 用明确的暂停、缩放和适应画布操作支持探索。
- Do 保留中文解释中的数据含义和限制。

### Don't:

- Don't 用社区颜色的深浅暗示质量或优劣。
- Don't 将布局距离描述为相似度或算法准确率。
- Don't 引入装饰插画、浮动阴影或覆盖数据的装饰层。
