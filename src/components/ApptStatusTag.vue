<script setup lang="ts">
/**
 * 业务状态标签（唯一出处：views/appt/options.ts 的 `type` 字段 + admin/AGENTS §13.2）
 *
 * 为什么要有这个组件：状态在列表里原本是纯文本（`labelOf(...)`），
 * 与移动端的彩色状态标签是两套观感；这里统一走 `el-tag`，语义色只从 options 的 `type` 取，
 * 页面里不再出现 `:type="row.x === 'X' ? 'danger' : 'success'"` 这种内联三元。
 */
import { computed } from 'vue';

import type { ApptOption, StatusTagType } from '@/views/appt/options';

const props = withDefaults(
  defineProps<{
    options: ApptOption[];
    value?: string | number | boolean | null;
    /** 找不到映射时的兜底文案 */
    fallback?: string;
  }>(),
  { value: undefined, fallback: '—' }
);

const hit = computed(() => props.options.find((item) => String(item.value) === String(props.value)));

const label = computed(() => hit.value?.label ?? props.fallback);

/** 未知线值不猜颜色，统一走 info（灰蓝），避免误用危险色 */
const type = computed<StatusTagType>(() => hit.value?.type ?? 'info');
</script>

<template>
  <el-tag :type="type" size="small" effect="light">{{ label }}</el-tag>
</template>
