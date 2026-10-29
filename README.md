# 号源 QueueDepth · 管理后台

> **技术演示项目**：所有院区 / 科室 / 医生 / 就诊人 / 挂号 / 支付数据**全部虚构**，支付走 Mock 渠道，
> **不提供任何真实医疗服务**，不接入任何真实医院系统。

门诊预约挂号系统的管理端：20 张业务表维护、运营看板、号源台账、停诊处理、七查对账、黑名单与限购。

- 基于 **RuoYi-Vue-Plus 6.0.0 的 plus-ui**（Vue 3 + TS + Element Plus + Vite）做业务二开；
- 业务页面集中在 `src/views/appt/`，接口在 `src/api/appt/`；
- 演示地址、截图与五分钟剧本在门面仓 [qd-appt-showcase](https://github.com/xcqj/qd-appt-showcase)。

## 技术栈

| 项 | 选型 |
|---|---|
| 框架 | Vue **3.5.42** + TypeScript + Vite |
| UI | Element Plus **2.14.5** |
| 状态 / 路由 | Pinia 4 · Vue Router 5.3 |
| 请求 | axios 1.20（统一拦截器：RSA+AES 加解密、token、错误提示） |
| 门禁 | `vue-tsc --noEmit` → `oxlint` → `vite build` |

## 快速启动

```bash
pnpm install          # Node ≥ 20.19，pnpm ≥ 10
pnpm dev              # http://localhost:8083
```

**后端要先跑起来**：开发态请求 `/dev-api`，由 Vite 代理到 `http://localhost:8082`
（可用 `VITE_PROXY_TARGET` 覆盖，截图脚本就指向 `18082` 那套演示栈）。

```bash
# 最省事的方式：整套起来（含后端、数据库、演示数据）
cd ../showcase && ./demo.sh        # 管理后台 http://localhost:18083
```

演示账号：`admin / admin123`（患者端与分诊台共用同一套账号体系，见 `../app/README.md`）。

## 与后端的约定

| 项 | 开发态 | 生产（容器） |
|---|---|---|
| 接口前缀 | `/dev-api` → 代理到 `localhost:8082` | `/prod-api` → 由 nginx 反代到 `APPT_API_UPSTREAM` |
| 加密 | `VITE_APP_ENCRYPT=true`，请求用后端公钥加密、响应用前端私钥解密 | 同左（**前后端密钥必须配对，换就一起换**） |
| 客户端 id | `VITE_APP_CLIENT_ID`，用于 Sa-Token 多端区分 | 同左 |
| 实时消息 | SSE `/resource/message`（`VITE_APP_MESSAGE_ENABLED=true`） | 同左，走同一域名经 nginx 反代 |
| SnailJob 控制台 | 直连 `http://localhost:8800/snail-job` | nginx 把 `/snail-job/` 转到 `APPT_SNAILJOB_UPSTREAM` |

nginx 模板见 [`docker/nginx/default.conf.template`](./docker/nginx/default.conf.template)：`/prod-api/`、`/snail-job/` 两条运行时反代，
用 `envsubst` 在容器启动时注入上游地址——**同一个镜像可以指向不同后端，不用重新构建**。

## 目录结构

```
src/
├── api/appt/          ★ 业务接口（20 张表 + 看板 + 对账 + 停诊）
├── views/appt/        ★ 业务页面（台账 / 看板 / 排班 / 对账 / 黑名单 …）
├── views/{system,monitor,tool}/   框架自带（用户、角色、菜单、任务、缓存）
├── views/{ai,demo,workflow}/      框架示例页（**保留文件，菜单已隐藏**）
├── components/        通用组件（含 ApptStatusTag：8 状态色映射）
├── utils/request.ts   请求拦截器（加密 / token / 错误码）
└── store/             Pinia（用户、权限、通知）
```

规模：121 个 `.vue` + 177 个 `.ts`。

## 构建与门禁

```bash
pnpm exec vue-tsc --noEmit     # 类型
pnpm lint                      # oxlint
pnpm build                     # 产物 → dist/
```

CI（`.github/workflows/ci.yml`）在 push main / PR 时依次跑上述三条，与本地一致。
**本仓无单元测试**：门禁靠类型 + lint + 构建，业务正确性由 `qd-appt-docs/test-evidence.md` 的后端集成测试覆盖。

## 镜像与部署

- 镜像：`ghcr.io/xcqj/appt-admin`，多阶段构建（pnpm build → nginx alpine）；
- 构建参数 `VITE_APP_BASE_API=/prod-api` 在构建期写死，运行期靠 nginx 模板换上游；
- tag 与部署见 `qd-appt-showcase/deploy/deploy.sh`（`vX.Y.Z` 不可变 tag，禁止 `latest`）。

## 边界与已知现象

- **菜单不在代码里**：新增页面要同时写菜单 SQL（`qd-appt-docs` 的 `script/sql/appt_s*_menu*.sql`），否则页面存在但后台看不见；
- **演示密钥**：`.env.production` 里的 RSA 公私钥是上游默认演示值，**不得用于真实业务**；
- 框架示例页（`views/ai`、`views/demo`、`views/workflow`）文件保留但菜单已隐藏，属已知冗余；
- 实时消息（SSE）在 Named Tunnel 下约 55 s 重连一次，属已知现象，业务功能不受影响。

## 文档索引

| 需要什么 | 去哪看 |
|---|---|
| 接口契约（字段级） | `qd-appt-docs/api-contract.md` |
| 后台视觉与交互基线 | [`AGENTS.md`](./AGENTS.md) §13、`qd-appt-docs/DESIGN.md` |
| 实测数字 | `qd-appt-docs/test-evidence.md` |
| 切片排期 | `qd-appt-docs/ROADMAP.md` |
