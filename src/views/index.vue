<template>
  <div class="p-2 home-page">
    <section class="board-head">
      <div class="board-head__text">
        <h2 class="board-title">今日运营</h2>
        <p class="board-sub">
          统计口径：就诊日为今天 · 数据截至 <span class="num">{{ data?.date || '—' }}</span>
        </p>
      </div>
      <el-button icon="Refresh" :loading="loading" @click="load">刷新</el-button>
    </section>

    <div v-if="error" class="board-error">
      <span class="board-error__text">看板加载失败：{{ error }}</span>
      <el-button link type="primary" @click="load">重新加载</el-button>
    </div>

    <el-row :gutter="16" class="metric-row">
      <el-col v-for="item in metrics" :key="item.key" :xs="24" :sm="12" :lg="6">
        <div class="metric-card">
          <div class="metric-label">
            {{ item.label }}
            <i v-if="item.alert && !loading" class="metric-dot" />
          </div>
          <div v-if="loading" class="metric-skeleton" />
          <div v-else class="metric-value">
            <span class="num">{{ item.value }}</span>
            <span class="metric-unit">{{ item.unit }}</span>
          </div>
          <p class="metric-hint">{{ item.hint }}</p>
        </div>
      </el-col>
    </el-row>

    <div class="board-grid">
      <section class="board-card">
        <header class="board-card__head">
          <h3>科室预约排行</h3>
          <span class="board-card__sub">按今日挂号单数倒序，最多 5 项</span>
        </header>
        <div v-if="loading" class="dept-skeleton">
          <div v-for="row in 3" :key="row" class="dept-skeleton__row" />
        </div>
        <div v-else-if="!deptTop5.length" class="board-empty">
          今日暂无预约数据
          <span class="board-empty__desc">患者下单后此处按科室汇总</span>
        </div>
        <div v-else class="dept-list">
          <div v-for="(dept, index) in deptTop5" :key="dept.deptId" class="dept-row">
            <span class="dept-rank num">{{ index + 1 }}</span>
            <span class="dept-name">{{ dept.deptName }}</span>
            <span class="dept-bar"><i :style="{ width: barWidth(dept.count) }" /></span>
            <span class="dept-count num">{{ dept.count }}</span>
          </div>
        </div>
      </section>

      <section class="board-card">
        <header class="board-card__head">
          <h3>快捷入口</h3>
          <span class="board-card__sub">日常运营四个高频页</span>
        </header>
        <div class="shortcut-grid">
          <button v-for="item in shortcuts" :key="item.path" type="button" class="shortcut" @click="goShortcut(item.path)">
            <el-icon class="shortcut__icon"><component :is="item.icon" /></el-icon>
            <span class="shortcut__label">{{ item.label }}</span>
          </button>
        </div>
      </section>
    </div>

    <section class="about-card">
      <h3 class="about-title">关于本项目</h3>
      <p><b>技术栈</b>Vue 3 + Element Plus / Spring Boot / MySQL + Redis / uni-app</p>
      <p class="about-strong"><b>数据声明</b>演示数据全部虚构，支付走模拟渠道，不提供真实医疗服务。</p>
      <p><b>实现边界</b>后端沿用上游开源脚手架 6.0.0 的鉴权与租户基建，挂号 / 支付 / 分诊 / 对账等业务模块全部自研。</p>
      <p><b>演示账号</b>管理端 admin / admin123；分诊台与患者端账号见移动端登录页提示。</p>
    </section>
  </div>
</template>

<script setup name="Index" lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { PageResult } from '@/api/types';
import { getDashboard } from '@/api/appt/dashboard';
import type { DashboardVO } from '@/api/appt/dashboard/types';
import { listSuspend } from '@/api/appt/suspend';
import type { SuspendVO } from '@/api/appt/suspend/types';

const router = useRouter();

const data = ref<DashboardVO>();
const pendingSuspend = ref<number>();
const loading = ref(false);
const error = ref('');

/** 空值统一显示破折号，不把 undefined 渲染成 "undefined" */
const dash = (value: string | number | null | undefined) => (value === null || value === undefined ? '—' : String(value));

const metrics = computed(() => [
  {
    key: 'booked',
    label: '今日预约',
    value: dash(data.value?.todayBooked),
    unit: '单',
    hint: '就诊日为今天的已预约 / 已签到 / 已完成',
    alert: false
  },
  {
    key: 'signed',
    label: '今日签到',
    value: dash(data.value?.todaySigned),
    unit: '单',
    hint: '今日已完成签到的挂号单',
    alert: false
  },
  {
    key: 'pay',
    label: '支付成功率',
    value: dash(data.value?.paySuccessRate),
    unit: '%',
    hint: '今日创建的支付单中已支付 / 已退款占比',
    alert: false
  },
  {
    key: 'pending',
    label: '待处理停诊',
    value: dash(pendingSuspend.value),
    unit: '条',
    hint: '停诊登记中尚未处理的数量',
    alert: (pendingSuspend.value ?? 0) > 0
  }
]);

const deptTop5 = computed(() => data.value?.deptTop5 ?? []);

/** 条形宽度按最大值归一，最小 6% 保证可点可见 */
function barWidth(count: number): string {
  const max = Math.max(...deptTop5.value.map((item) => item.count), 0);
  if (!max || !count) {
    return '6%';
  }
  return `${Math.max(Math.round((count / max) * 100), 6)}%`;
}

const shortcuts = [
  { label: '预约单', path: '/appt/registration', icon: 'Tickets' },
  { label: '支付单', path: '/appt/payment', icon: 'Wallet' },
  { label: '停诊处理', path: '/appt/suspend', icon: 'Bell' },
  { label: '号源台账', path: '/appt/slot', icon: 'Calendar' }
];

function goShortcut(path: string) {
  if (router.currentRoute.value.path !== path) {
    router.push(path);
  }
}

/** 看板与停诊计数并行取，任一失败只在区块内提示，不整页报错 */
async function load() {
  loading.value = true;
  error.value = '';
  const [board, pending] = await Promise.allSettled([
    getDashboard(),
    listSuspend({ pageNum: 1, pageSize: 1, status: 'PENDING' })
  ]);
  if (board.status === 'fulfilled') {
    data.value = board.value.data;
  } else {
    error.value = (board.reason as Error)?.message || '接口异常';
  }
  if (pending.status === 'fulfilled') {
    pendingSuspend.value = (pending.value.data as PageResult<SuspendVO>)?.total ?? 0;
  }
  loading.value = false;
}

onMounted(load);
</script>

<style lang="scss" scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.num {
  font-variant-numeric: tabular-nums;
}

.board-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e6ebf2;
}

.board-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #1f2d3d;
}

.board-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: #5a667e;
}

.board-error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(209, 67, 67, 0.08);
  border: 1px solid rgba(209, 67, 67, 0.24);

  &__text {
    font-size: 13px;
    color: #d14343;
  }
}

.metric-row {
  row-gap: 16px;
}

.metric-card {
  height: 100%;
  padding: 20px 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e6ebf2;
  box-shadow: 0 2px 8px rgba(31, 45, 61, 0.04);
}

.metric-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #5a667e;
}

.metric-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d98e04;
}

.metric-value {
  margin-top: 10px;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  color: #1f7a8c;
}

.metric-unit {
  margin-left: 4px;
  font-size: 13px;
  font-weight: 400;
  color: #8a94a6;
}

.metric-skeleton {
  height: 34px;
  margin-top: 10px;
  width: 60%;
  border-radius: 8px;
  background: #eef2f6;
}

.metric-hint {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: #8a94a6;
}

.board-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  gap: 16px;
}

.board-card {
  padding: 20px 24px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e6ebf2;
}

.board-card__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1f2d3d;
  }
}

.board-card__sub {
  font-size: 12px;
  color: #8a94a6;
}

.dept-list,
.dept-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
}

.dept-row {
  display: grid;
  grid-template-columns: 20px 96px minmax(0, 1fr) 40px;
  align-items: center;
  gap: 10px;
}

.dept-rank {
  font-size: 12px;
  color: #8a94a6;
}

.dept-name {
  font-size: 13px;
  color: #1f2d3d;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.dept-bar {
  height: 8px;
  border-radius: 999px;
  background: rgba(31, 122, 140, 0.12);
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: #1f7a8c;
  }
}

.dept-count {
  font-size: 13px;
  text-align: right;
  color: #5a667e;
}

.dept-skeleton__row {
  height: 12px;
  border-radius: 8px;
  background: #eef2f6;
}

.board-empty {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 28px 0;
  font-size: 14px;
  color: #5a667e;

  &__desc {
    font-size: 12px;
    color: #8a94a6;
  }
}

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.shortcut {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 12px;
  border: 1px solid #e6ebf2;
  background: #f5f7fa;
  color: #1f2d3d;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(31, 122, 140, 0.32);
    background: #ffffff;
  }
}

.shortcut__icon {
  font-size: 20px;
  color: #1f7a8c;
}

.shortcut__label {
  font-size: 13px;
}

.about-card {
  padding: 20px 24px;
  border-radius: 16px;
  background: #eef2f6;

  b {
    display: inline-block;
    min-width: 72px;
    margin-right: 8px;
    font-weight: 600;
    color: #1f2d3d;
  }

  p {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.8;
    color: #5a667e;
  }
}

.about-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.about-strong {
  color: #16636f !important;
}

@media (max-width: 1000px) {
  .board-grid {
    grid-template-columns: 1fr;
  }
}
</style>
