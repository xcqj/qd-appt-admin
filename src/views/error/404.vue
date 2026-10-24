<template>
  <div class="not-found">
    <img class="not-found__mark" src="@/assets/logo/logo-cross.png" alt="" />
    <h1 class="not-found__title">页面不存在</h1>
    <p class="not-found__desc">该页面可能已下线，或链接地址有误</p>
    <el-button type="primary" size="large" class="not-found__action" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push('/index');
}
</script>

<style lang="scss" scoped>
/* 与移动端 404 同口径（admin/AGENTS §13.5）：母标水印 + 一句说明 + 主按钮，无插画 */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: calc(100vh - 120px);
  padding: 0 24px 80px;
  text-align: center;

  &__mark {
    width: 96px;
    height: 96px;
    opacity: 0.2;
  }

  &__title {
    margin: 24px 0 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 1.4;
    color: #1f2d3d;
  }

  &__desc {
    margin: 12px 0 0;
    font-size: 14px;
    line-height: 1.7;
    color: #5a667e;
  }

  &__action {
    margin-top: 32px;
    min-width: 160px;
  }
}
</style>
