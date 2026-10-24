# AGENTS.md — admin（plus-ui 管理端）

> 本文件只写 **admin 仓特有、可执行、可验证** 的约定；权威内容按引用走，不在此复制：
> - 业务 / 接口 / 数据设计：`../docs/PRD.md`、`../docs/api-contract.md`、`../docs/database-design.md`
> - 领域红线：`../docs/redlines.md`（与 `../backend/AGENTS.md` §4 逐字一致）
> - 后端约定与**生成器坑位**：`../backend/AGENTS.md` §6（必读）
> - 前端通用技能包：`.codex/skills/frontend-crud-coding/SKILL.md` + `references/frontend.md`
> - 跨仓技能包：`../backend/.codex/skills/ruoyi-plus-ai-coding/references/frontend.md`
>
> **会话启动摘要（完整协议见 `../docs/AGENTS.md`）**
> - 切片须用户**显式开启**；一片做完即停，不自动进入下一片
> - 开工前出「开场卡 + 阅读回执（≥3 条约束带出处）」，无回执不开工
> - 本仓是会话根；`../docs/` 与 `../backend/` 在根外，按该文件 §4 清单显式读
> - 红线速记：四层路径 / 金额 VO 用 string / 两套状态标签 / 证件号禁打印
> - 验证：`vue-tsc --noEmit` → `oxlint src` → `build`（build 不做类型检查）

## 1. 仓库定位与运行

- plus-ui **6.X-Vue**（Vue 3 + TypeScript + Element Plus），本项目唯一管理端。
- 包管理器 **pnpm**（有 `pnpm-lock.yaml`）；本机也验证过 `npm run build` 可用，以 pnpm 为准。
- 本地开发：`pnpm dev` → 8083，`/dev-api` 代理到后端 8082（见 `vite.config.ts`）。
- 加密开关：`.env.development` 的 `VITE_APP_ENCRYPT` 必须与后端 `api-decrypt.enabled` **同开同关**，错配表现为 403 或 JSON 解析失败。
- 书写规范：UTF-8 / LF / 2 空格（`.editorconfig`）；格式化 `pnpm fmt`（oxfmt），lint `pnpm lint`（oxlint）。

## 2. 目录与命名

- 页面：`src/views/appt/{business}/index.vue`
- API：`src/api/appt/{business}/index.ts`（请求函数）+ `types.ts`（VO / Form / Query）
- `business` 与后端 `@RequestMapping` 段一致：`campus` / `clinicType` / `dept` / `staff` / `feeStandard` / `slotTemplate` / `schedule` / `slot` / `slotLedger` / `registration` / `payment` / `refund` / `patient` / `blacklist` / `notice` / `jobLog` / `paymentCallback` / `reconcileResult` / `suspend`
- 页面壳沿用生成器风格：`p-2 app-container <module>-<business>-page`、`search-panel`、`toolbar-shell`、`data-table`、`right-toolbar`、`pagination`
- 公共能力走项目既有 hooks：`useLoading` / `useSearchToggle` / `useSearchReset` / `useTableSelection` / `useFormDialog` / `useDateRangeQuery`；**不要**引入第二套状态管理、请求封装或样式体系

## 3. 与后端的硬约束

| 项 | 约定 |
|---|---|
| 接口路径 | `/appt/admin/{entity}/...`（`api.ts` 的 `url` 必须与后端一致） |
| 权限标识 | `appt:{entity}:{list,query,add,edit,remove,export}`，页面按钮用 `v-hasPermi` |
| 金额 | **字符串**（后端 `BigDecimal` 全局序列化为字符串，契约 §1.3 / §2.4） |
| 日期 / 时刻 | `yyyy-MM-dd` / `HH:mm:ss`（日期时间 `yyyy-MM-dd HH:mm:ss`） |
| 雪花 id | 接口返回**字符串**；展示、回填、下拉 value 一律按字符串处理 |
| 导出 | `requestDownload('appt/admin/{entity}/export', { ...queryParams.value }, '{entity}_<时间戳>.xlsx')` |

## 4. 类型规则（VO / Form / Query 三套，别混）

- **VO = 线值诚实**：id 类 `string | number`；金额 `string`；Boolean `boolean`；其余 `string`。
- **Form / Query = 输入侧**：数值输入 `number`；**引用字段（下拉值）`string | number`**；金额输入 `number`。
- 遇到类型报错先判断是"线值"还是"输入侧"，**不要**为了消错把类型改宽改窄。
- 生成器已按 `GenTableColumn.getTsInputType` 区分输入侧，手改保持同一口径。

## 5. 控件规则（每条都是踩过的坑）

1. **枚举字段用 `el-select` + 固定 options**（线值以 `database-design.md` §2 为准），不要让人背 `AM` / `NORMAL` / `CHIEF`。
2. **引用字段必须下拉，`:value` 直接用接口返回的字符串 id** —— 19 位雪花 id 超出 JS 安全整数，`el-input-number` 会压成 `9007199254740991`，存库即孤儿引用。
3. 日期用 `el-date-picker`（`value-format="YYYY-MM-DD"`）、时刻用 `el-time-picker`（`value-format="HH:mm:ss"`）；退化方案至少给文本框加格式提示。
4. **禁止无字典的 `el-select`** —— 只渲染一个"请选择字典生成"空选项，页面无法提交；要么给 options，要么用 `el-input`。
5. `el-switch` 绑 Boolean 必须给初值（`status: false` = DB `'0'` 正常），否则未触碰时 `undefined` 触发必填校验失败。
6. label 用 UI 文案（"状态" / "午别" / "职称"），**不要**直接拿 DDL 注释原文当标签。
7. 列表展示枚举/布尔时做中文映射（`AM`→上午、`true/false`→正常/停用）。
8. 引用下拉只列**正常项**（`useApptOptions` 内过滤 `status === true`）；科室父级树保留停用节点但标记 `disabled`，保证子节点仍挂在树上但不可被选为父级。
9. 图片字段用 `<image-upload v-model="form.xxx" :limit="1" />`——**该组件回填 ossId，不是 URL**。后端 VO 必须加 `<field>Url`（如 `avatarUrl`）并 `@Translation(type = TransConstant.OSS_ID_TO_URL, mapper = "<field>")`；列表绑 `scope.row.xxxUrl || scope.row.xxx`（后者兜底历史上存了 URL 的旧数据）；**导出不含图片列**（`@Translation` 只在 JSON 序列化时生效，导出对象上取不到值）。

## 6. 生成器产物纪律

- `src/views/appt` 与 `src/api/appt` 是**生成器产物 + 手工改造**的结果（路径 `/admin`、只读表删写 UI、坏控件替换、金额类型、下拉等），**不要重新生成覆盖**。
- 确需重新生成：先提交基线 → 重新生成 → 按 `../backend/AGENTS.md` §6 的坑位清单重做改造 → 再提交。
- 新增表沿用同一套改造：路径改 `/appt/admin`、只读表删写按钮/操作列/对话框、枚举控件、引用字段下拉、`types.ts` 三套类型。

## 7. 验证门槛（按顺序，全过才算完）

1. `pnpm exec vue-tsc --noEmit` —— **必须 0 错**（`vite build` **不做类型检查**，不能替代）
2. `pnpm lint`（oxlint src）—— **必须 0 错**；本项目已按 `no-underscore-dangle` 把生成器的 `_id`/`_ids` 统一改为 `rowId`/`rowIds`，新代码不要再用下划线前缀局部变量
3. `pnpm build` —— 构建通过
4. 改动页面手测：列表 / 新增 / 编辑 / 删除 / 导出；F12 确认请求路径是 `/dev-api/appt/admin/...`
- `vite build` 报 `SAFE_DELETE_BULK_CONFIRM_REQUIRED` 是 IDE 安全删除护栏拦截清空 `dist`，先 `rm -rf dist` 再构建。
- 提交前 `git status --short` 确认没有 `.codebuddy/`、`*.code-workspace` 等 IDE 数据被带上。

## 8. 技能包与角色提示词怎么用

- 做标准 CRUD / 页面增强 / 只补 API 前：先读 `.codex/skills/frontend-crud-coding/SKILL.md`，再按任务类型读 `references/frontend.md`（页面/类型/导出/树表）或 `references/examples.md`。
- `.claude/agents/frontend-*.md` 是角色提示词（`frontend-crud-page` / `frontend-crud-coding` / `frontend-page-enhancement` / `frontend-api-types`），本客户端不注册为可调用 agent，按其内容自检即可。
- 跨仓任务（改接口同时改页面）先读 `../backend/.codex/skills/ruoyi-plus-ai-coding/references/frontend.md`。
- 冲突时优先级：**目标目录最近似页面 > 项目公共 hooks/组件 > 生成器模板 > 通用 Vue 习惯**。

## 9. 已知待办（当前差距，勿当 bug）

- **枚举副本有三处**：`docs/database-design.md` §2 + 契约 §2.7（权威）、本仓 `src/views/appt/options.ts`（筛选/表单/列表）、后端 VO 的 `@ExcelDictFormat(readConverterExp=...)`（导出）。改枚举必须三处同步，改完跑 `python3 backend/script/enum_sync_audit.py` 验证（未采用 sys_dict，避免第四份副本）

## 10. 提交纪律

- 提交信息：`feat(s{切片})` / `fix(s{切片})` / `docs(s{切片})` / `chore(s{切片})`，正文写"改了什么 + 为什么 + 验证命令"。
- 一个提交只做一件事；生成器基线、改造、修 bug 分开提交，便于回溯。

## 11. 协作节奏（跨仓规则见 `../docs/AGENTS.md`）

- **切片闸门**：新切片必须由用户**显式开启**；切片收尾后停下等指令，**不得自动进入下一个切片**。
- **开场卡**：新会话先复述「任务类型 / 目标切片 / 目标 / 范围（含明确不做）/ 验收 / 涉及仓库」，信息不足先问再动手。
- 一个目标一次会话；跨仓改动按仓分别提交，提交信息互相引用。
## 12. 红线（【公共】部分，摘自 `../docs/redlines.md`）

> 权威文本在 `../docs/redlines.md`；本节按该文件 §27「公共核心」复制第 6/10/15/16/17 条，**改任何一条须三处同步**（redlines.md + 本节 + backend §4）。其余属后端领域，需要时读 `../docs/redlines.md`。

- **#6 两套状态标签严禁混用**：科室排班页只有「有排班/无排班」；医生主页只有「满诊/无号」。
- **#10 服务端强制校验权限与限购，不信任前端任何判断**；四层 API 边界（public / patient / triage / admin）不混用。
- **#15 PII**：身份证/就诊卡号演示数据可明文，代码预留加密接口位，日志禁止打印证件号（M11）。
- **#16 明确不做**（被问及时按「为什么不上」回答，不主动实现）：候补队列、改约、真实渠道签约、医保、问诊/开方/药品、检查治疗预约、报告/账单/地址/评价、多医院、ES、微服务、MQ（PRD §1.4 / §13.2）。
- **#17 命名纪律（PRD D10）**：简历用中文名「号源」；仓库 / README 用英文代号 QueueDepth；**演示 UI 仅中文 + 虚构医院名，不得出现 QueueDepth 或任何英文代号**；代码层缩写统一 `appt`（表前缀 `appt_` / 包 `org.dromara.appt` / API `/appt/**` / Redis `appt:*`）。

**工程规范（摘自同文件 §3，各仓通用）**：

- 契约先行：API 契约先于代码；实现与契约冲突时先报告再修订，不得默默偏离。
- 切片化：一个切片一个提交周期；开工前建 Git checkpoint；commit 标注切片号（切片排期见 `../docs/ROADMAP.md`）。
- 分层边界：Controller 接参校验权限 → Service 业务规则与事务 → Mapper；跨模块仅走 Service 接口。
- 发现设计与实现冲突，先报告再动手；文档冲突先识别，由最新明确决定裁决。
- CI：编译 + 单元测试（前端为 `vue-tsc` + `oxlint` + `build`）。
## 13. 后台视觉基线（S12.5 定，2026-10-24）

> 权威链：**移动端唯一视觉源是 `../app/DESIGN.md`**；后台没有独立 DESIGN 文档，本节是后台的对应物。
> 冲突时：颜色/字号/间距/圆角一律回 DESIGN §2–§4 的取值，本节只做「后台怎么用」的补充，不新造色值。

### 13.1 主题色（Element Plus 三层同源，缺一层就会一半蓝一半青）

| 层 | 文件 | 作用 |
|---|---|---|
| 编译期 SCSS | `src/assets/styles/tokens/_sass-vars.scss` | `$color-primary` 等，供 `_exports.scss` 与 Element 覆盖使用 |
| 运行前默认值 | `src/settings.ts` | `theme: '#1F7A8C'`，首屏渲染前注入，避免闪一下框架蓝 |
| 运行时 CSS 变量 | `src/utils/theme.ts` | `--el-color-primary` 全阶 + 派生 light/dark 阶 |

语义色（只取 `DESIGN §2.1`）：主色 `#1F7A8C`、主色暗 `#16636F`、成功 `#2E9E6B`、警告 `#D98E04`、危险 `#D14343`、信息 `#3B82C4`。
中性色：画布 `#F5F7FA`、卡片 `#FFFFFF`、浅表面 `#EEF2F6`、描边 `#E6EBF2`、文字三级 `#1F2D3D / #5A667E / #8A94A6`。
圆角：卡片 `16px`、输入与按钮 `8px`、标签 `4px`、胶囊 `999px`。阴影只两档：卡片 `0 2px 8px rgba(31,45,61,.04)`、浮层 `0 8px 32px rgba(31,45,61,.12)`。

### 13.2 状态标签（唯一出处：`src/views/appt/options.ts` 的 options + `type` 字段）

- 业务状态**不再以纯文本渲染**，统一走 `el-tag`（`size="small"`、`effect="light"`、`:type` 取映射），`type` 语义也只从下表派生：

| 业务 | 线值 → type |
|---|---|
| 挂号 | `WAIT_PAY`→warning、`BOOKED`→primary、`SIGNED`→success、`COMPLETED`→success、`CLOSED`→info、`CANCELED_ACTIVE`→info、`CANCELED_PASSIVE`→info、`NOSHOW`→danger |
| 支付 | `WAIT_PAY`→warning、`PAID`→success、`CLOSED`→info、`REFUNDED`→info |
| 退款 | `WAIT_REFUND`→warning、`REFUNDED`→success、`FAILED`→danger |
| 停诊登记 | `PENDING`→warning、`HANDLED`→success |
| 支付回调 | `PENDING`→warning、`SUCCESS`→success、`IGNORED`→info |
| 布尔状态 | `status === true`（停用/已解除）→ danger，`false`（正常/生效）→ success |

- 新增业务状态时**先补 options 的 `type`，再改页面**；页面里禁止再出现 `:type="row.x === 'X' ? 'danger' : 'success'"` 这种内联三元。

### 13.3 表格与空态

- 列表统一 `el-table`：默认 `size`、行高约 `48px`、表头底色 `#F5F7FA` + `13px` 次色文字；金额列右对齐且沿用字符串渲染。
- 空态写「业务主语 + 条件」：如「今日暂无预约数据」「该院区暂未开放科室」，不写裸「暂无数据」。
- 分页靠右；工具栏按钮顺序沿用 `search-panel` / `toolbar-shell` 现有壳，不新增第三套布局类。

### 13.4 表单与弹窗

- `el-form` 统一 `label-width`，必填项由 `rules` 自动出红星；错误文案在控件下方 `12px` 危险色。
- 弹窗（`el-dialog`）宽度按内容定但不超过 `720px`，标题 `16px`/600，底部按钮右侧对齐，主按钮在右。
- 危险操作（删除、停诊处理、解除限制）必须二次确认，确认按钮 `type="danger"`。

### 13.5 登录页与兜底页

- 登录页：左 `46%` **平面** `#1F7A8C` 品牌区（母标 + 标语 + 四项能力 + 三端角色卡），右 `54%` 白卡表单；控件只用 `el-form` / `el-input` / `el-checkbox` / `el-button` / `el-divider`，不引第三方 UI 库；验证码保留后端 `codeUrl` 图片。
- 404 页：与移动端同口径——母标水印（主色 20%）+「页面不存在」+ 一句说明 +「返回首页」；**禁止**卡通插画与框架默认蓝按钮。
- 渐变只允许移动端首页品牌区一处；后台任何页面不用渐变（含按钮、卡片、背景光斑）。

### 13.6 禁止

上游框架色 `#409EFF` 与 `rgba(53,109,255,…)` 蓝调、紫色、霓虹/外发光、彩色投影、卡片套卡片、emoji、界面出现上游框架名称。

