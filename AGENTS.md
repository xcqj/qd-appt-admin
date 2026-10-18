# AGENTS.md — admin（plus-ui 管理端）

> 本文件只写 **admin 仓特有、可执行、可验证** 的约定；权威内容按引用走，不在此复制：
> - 业务 / 接口 / 数据设计：`../docs/PRD.md`、`../docs/api-contract.md`、`../docs/database-design.md`
> - 领域红线：`../docs/redlines.md`（与 `../backend/AGENTS.md` §4 逐字一致）
> - 后端约定与**生成器坑位**：`../backend/AGENTS.md` §6（必读）
> - 前端通用技能包：`.codex/skills/frontend-crud-coding/SKILL.md` + `references/frontend.md`
> - 跨仓技能包：`../backend/.codex/skills/ruoyi-plus-ai-coding/references/frontend.md`

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

- 枚举控件：午别 / 门诊类型 / 职称 / 人员类型 / 证件类型仍是文本框（待改固定 options 下拉）
- 时间/日期：`start_time` / `end_time` / `visit_date` 仍是文本框（待改 picker）
- label 仍是 DDL 注释原文；列表值未做中文映射
- 引用下拉未过滤停用项（服务端有存在性校验兜底）
- 科室父级为数字输入（树选择待做）；头像/封面图为 URL 文本框（契约 §2.6 占位图过渡）
- 导出仍输出 `TRUE/FALSE` 与线值（待翻译）；菜单 `order_num` 全 1；`timePoint` 列表显示为日期（契约要求 `HH:mm`）

## 10. 提交纪律

- 提交信息：`feat(s{切片})` / `fix(s{切片})` / `docs(s{切片})` / `chore(s{切片})`，正文写"改了什么 + 为什么 + 验证命令"。
- 一个提交只做一件事；生成器基线、改造、修 bug 分开提交，便于回溯。
