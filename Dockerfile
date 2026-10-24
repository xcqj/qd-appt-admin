# 号源 QueueDepth · 管理后台镜像（S14）
#
# 两阶段：Node 构建静态产物 → nginx 托管。
# 接口前缀在**构建期**固定为 /prod-api（`.env.production` 默认值，可用 build-arg 覆盖）；
# 后端地址在**运行期**由 APPT_API_UPSTREAM 注入 nginx 模板（见 docker/nginx/default.conf.template），
# 因此同一个镜像可以指向任意后端，不需要重新构建。
#
# 构建：docker build -t ghcr.io/xcqj/appt-admin:v0.1.0 .
# 运行：docker run --rm -p 8083:80 -e APPT_API_UPSTREAM=http://<host>:8082 ghcr.io/xcqj/appt-admin:v0.1.0

FROM node:22-alpine AS build
WORKDIR /app

# 版本取自 package.json 的 packageManager 字段
RUN npm install -g pnpm@10.34.5

# pnpm-workspace.yaml 是 pnpm 10 的 overrides / allowBuilds 来源，缺它会报
# ERR_PNPM_LOCKFILE_CONFIG_MISMATCH（lockfile 里有 overrides: esbuild）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# 构建期只需要「接口前缀」；密钥与客户端 id 来自仓库内的 .env.production
ARG VITE_APP_BASE_API=/prod-api
ENV VITE_APP_BASE_API=${VITE_APP_BASE_API} \
    CI=true

RUN pnpm build

FROM nginx:1.31-alpine

# APPT_API_UPSTREAM：后端地址（运行时注入）；NGINX_ENVSUBST_FILTER 限定只替换 APPT_* 变量，
# 避免官方入口脚本把 $uri / $http_host 等 nginx 变量一起替换掉
ENV APPT_API_UPSTREAM=http://api:8082 \
    APPT_SNAILJOB_UPSTREAM=http://host.docker.internal:8800 \
    NGINX_ENVSUBST_FILTER=^APPT_

COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=12 \
    CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
