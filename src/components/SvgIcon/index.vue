<template>
  <Icon v-if="isIconify" :icon="normalizedIcon" :class="svgClass" :style="iconStyle" aria-hidden="true" />
  <svg v-else :class="svgClass" aria-hidden="true" :style="iconStyle">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { propTypes } from '@/utils/propTypes';

const props = defineProps({
  iconClass: propTypes.string.isRequired,
  className: propTypes.string.def(''),
  color: propTypes.string.def(''),
  size: propTypes.string.def('')
});
const normalizedIcon = computed(() => props.iconClass?.replace(/^i-/, ''));
const isIconify = computed(() => normalizedIcon.value?.includes(':'));
const iconName = computed(() => `#icon-${normalizedIcon.value}`);
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  }
  return 'svg-icon';
});
const iconStyle = computed(() => ({
  color: props.color || undefined,
  fontSize: props.size || undefined
}));
</script>

<style lang="scss" scoped>
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
  flex-shrink: 0;
}

/*
 * Element Plus 有 `.el-input .el-input__icon { height: inherit }`（权重 0,2,0）。
 * dev 下组件样式后注入，`.svg-icon` 的 1em 生效；**生产构建里 EP 样式排在后面**，
 * 同权重被覆盖 → svg 失去 height，退回替换元素默认 300×150，把 el-input 撑到 152px
 * （登录页输入框特别高就是这个原因，2026-10-25 定位）。
 * 这里加类组合 + scoped 属性，权重 0,3,0，使尺寸不再依赖样式加载顺序。
 */
.svg-icon.el-input__icon,
.svg-icon.input-icon {
  width: 1em;
  height: 1em;
}
</style>
