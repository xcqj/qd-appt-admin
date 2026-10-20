<template>
  <div class="p-2 page-shell appt-dashboard-page">
    <el-card shadow="hover" class="dashboard-hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h3>数据看板</h3>
          <p class="hero-desc">
            统计口径：今日 = 就诊日等于 <b>{{ data?.date || '-' }}</b>；放号 = 今日新增号源；
            支付成功率 = 今日创建支付单中已支付/已退款占比。
          </p>
        </div>
        <div class="hero-actions">
          <el-button icon="Refresh" :loading="loading" @click="getData">刷新</el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="16" class="mt-3">
      <el-col v-for="card in cards" :key="card.label" :xs="24" :sm="12" :md="8">
        <el-card shadow="hover" class="metric-card">
          <div class="metric-label">{{ card.label }}</div>
          <div class="metric-value">
            {{ card.value }}<span class="metric-unit">{{ card.unit }}</span>
          </div>
          <div class="metric-hint">{{ card.hint }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="mt-4">
      <template #header>
        <div class="chart-heading">
          <h3>科室预约 TOP5</h3>
          <span class="chart-sub">按今日挂号单数倒序</span>
        </div>
      </template>
      <div v-if="!data?.deptTop5?.length" class="chart-empty">暂无今日数据</div>
      <div v-show="data?.deptTop5?.length" ref="chartRef" class="chart-box"></div>
    </el-card>
  </div>
</template>

<script setup name="Dashboard" lang="ts">
import * as echarts from 'echarts';
import { getDashboard } from '@/api/appt/dashboard';
import { DashboardVO } from '@/api/appt/dashboard/types';
import { useLoading } from '@/hooks/async/useLoading';

const data = ref<DashboardVO>();
const chartRef = ref<HTMLDivElement>();
let chart: echarts.ECharts | undefined;
const { loading, withLoading } = useLoading(true);

const cards = computed(() => [
  { label: '今日放号', value: data.value?.todaySlots ?? 0, unit: '个', hint: '今日新增号源' },
  { label: '今日已预约', value: data.value?.todayBooked ?? 0, unit: '单', hint: '已预约 / 已签到 / 已完成' },
  { label: '今日已签到', value: data.value?.todaySigned ?? 0, unit: '单', hint: '已签到 / 已完成' },
  { label: '爽约率', value: data.value?.noShowRate ?? 0, unit: '%', hint: '已爽约 / 今日就诊总量' },
  { label: '退号率', value: data.value?.cancelRate ?? 0, unit: '%', hint: '主动退号 + 停诊退号 / 今日总量' },
  { label: '支付成功率', value: data.value?.paySuccessRate ?? 0, unit: '%', hint: '今日支付单已支付/已退款占比' }
]);

const getData = async () => {
  await withLoading(async () => {
    const res = await getDashboard();
    data.value = res.data;
    renderChart();
  });
};

const renderChart = () => {
  if (!chartRef.value) {
    return;
  }
  const rows = data.value?.deptTop5 ?? [];
  if (!rows.length) {
    chart?.clear();
    return;
  }
  if (!chart) {
    chart = echarts.init(chartRef.value);
  }
  chart.setOption({
    grid: { left: 16, right: 24, top: 24, bottom: 16, containLabel: true },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: rows.map((r) => r.deptName ?? String(r.deptId)) },
    yAxis: { type: 'value', name: '挂号数', minInterval: 1 },
    series: [
      {
        type: 'bar',
        barMaxWidth: 48,
        itemStyle: { borderRadius: [6, 6, 0, 0], color: '#409EFF' },
        data: rows.map((r) => r.count)
      }
    ]
  });
  chart.resize();
};

const handleResize = () => chart?.resize();

onMounted(() => {
  getData();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  chart?.dispose();
  chart = undefined;
});
</script>

<style scoped>
.dashboard-hero {
  border-radius: 8px;
}

.hero-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-text h3 {
  margin: 0 0 6px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.hero-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #909399;
}

.metric-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.metric-label {
  font-size: 14px;
  color: #606266;
}

.metric-value {
  margin-top: 8px;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.2;
  color: #303133;
}

.metric-unit {
  margin-left: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #909399;
}

.metric-hint {
  margin-top: 6px;
  font-size: 12px;
  color: #a8abb2;
}

.chart-heading {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.chart-heading h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.chart-sub {
  font-size: 12px;
  color: #909399;
}

.chart-box {
  width: 100%;
  height: 320px;
}

.chart-empty {
  padding: 60px 0;
  text-align: center;
  color: #909399;
}
</style>
