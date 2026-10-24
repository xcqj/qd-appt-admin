<template>
  <div class="login">
    <div class="login-shell">
      <section class="login-brand">
        <img class="brand-logo" src="@/assets/logo/logo-white.png" alt="号源" />
        <span class="brand-pill">门诊预约挂号 · 技术演示</span>
        <h1 class="brand-title">号源 · 门诊预约挂号管理后台</h1>
        <p class="brand-desc">
          院区科室、排班号源、限购与黑名单、支付退款、分诊签到与停诊处理，全链路自研业务模块。
          <br />
          演示数据全部虚构，支付走模拟渠道，不提供真实医疗服务。
        </p>
        <div class="brand-highlights">
          <span v-for="item in highlights" :key="item" class="highlight-chip">{{ item }}</span>
        </div>
        <div class="brand-metrics">
          <article v-for="item in quickStats" :key="item.label" class="metric-card">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </article>
        </div>
      </section>

      <section class="login-panel">
        <lang-select class="panel-lang" />
        <header class="panel-head">
          <p class="eyebrow">演示环境登录</p>
          <h2 class="title">{{ title }}</h2>
          <p class="subtitle">使用演示账号登录运营工作台。</p>
        </header>

        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.username')"
            >
              <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.password')"
              @keyup.enter="handleLogin"
            >
              <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
            </el-input>
          </el-form-item>

          <el-form-item v-if="captchaEnabled" prop="code" class="captcha-row">
            <el-input
              v-model="loginForm.code"
              size="large"
              auto-complete="off"
              :placeholder="$t('login.code')"
              @keyup.enter="handleLogin"
            >
              <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" class="login-code-img" @click="getCode" />
            </div>
          </el-form-item>

          <div class="form-meta">
            <el-checkbox v-model="loginForm.rememberMe">{{ $t('login.rememberPassword') }}</el-checkbox>
            <router-link v-if="register" class="link-type" :to="'/register'">
              {{ $t('login.switchRegisterPage') }}
            </router-link>
          </div>

          <el-form-item class="submit-row">
            <el-button :loading="loading" size="large" type="primary" class="submit-button" @click.prevent="handleLogin">
              <span v-if="!loading">{{ $t('login.login') }}</span>
              <span v-else>{{ $t('login.logging') }}</span>
            </el-button>
          </el-form-item>
        </el-form>
      </section>
    </div>

    <footer class="login-footer">Copyright © 2016-{{ currentYear }} 号源演示系统 · 数据全部虚构</footer>
  </div>
</template>

<script setup lang="ts">
import { to } from 'await-to-js';
import { useI18n } from 'vue-i18n';
import { getCodeImg } from '@/api/login';
import { LoginData } from '@/api/types';
import { useUserStore } from '@/store/modules/user';

const title = import.meta.env.VITE_APP_TITLE;
const currentYear = new Date().getFullYear();
const quickStats = [
  { label: '预约挂号主链路', value: '患者端' },
  { label: '签到与停诊', value: '分诊台' },
  { label: '运营与对账', value: '管理端' }
];
const highlights = ['院区科室排班', '限购与黑名单', '支付与退款', '分诊签到与停诊'];
const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();

const loginForm = ref<LoginData>({
  username: 'admin',
  password: 'admin123',
  rememberMe: false,
  code: '',
  uuid: ''
} as LoginData);

const loginRules: ElFormRules = {
  username: [
    {
      required: true,
      trigger: 'blur',
      message: t('login.rule.username.required')
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: t('login.rule.password.required')
    }
  ],
  code: [
    {
      required: true,
      trigger: 'change',
      message: t('login.rule.code.required')
    }
  ]
};

const codeUrl = ref('');
const loading = ref(false);
const captchaEnabled = ref(true);
const register = ref(false);
const redirect = ref('/');
const loginRef = ref<ElFormInstance>();

watch(
  () => router.currentRoute.value,
  (newRoute: any) => {
    redirect.value = newRoute.query && newRoute.query.redirect && decodeURIComponent(newRoute.query.redirect);
  },
  { immediate: true }
);

const handleLogin = () => {
  loginRef.value?.validate(async (valid: boolean, fields: any) => {
    if (valid) {
      loading.value = true;
      if (loginForm.value.rememberMe) {
        localStorage.setItem('username', String(loginForm.value.username));
        localStorage.setItem('rememberMe', String(loginForm.value.rememberMe));
      } else {
        localStorage.removeItem('username');
        localStorage.removeItem('rememberMe');
      }
      localStorage.removeItem('password');
      const [err] = await to(userStore.login(loginForm.value));
      if (!err) {
        const redirectUrl = redirect.value || '/';
        await router.push(redirectUrl);
        loading.value = false;
      } else {
        loading.value = false;
        if (captchaEnabled.value) {
          await getCode();
        }
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};

const getCode = async () => {
  const res = await getCodeImg();
  const { data } = res;
  captchaEnabled.value = data.captchaEnabled === undefined ? true : data.captchaEnabled;
  if (captchaEnabled.value) {
    loginForm.value.code = '';
    codeUrl.value = 'data:image/gif;base64,' + data.img;
    loginForm.value.uuid = data.uuid;
  }
};

const getLoginData = () => {
  const username = localStorage.getItem('username');
  const rememberMe = localStorage.getItem('rememberMe');
  localStorage.removeItem('password');
  loginForm.value = {
    username: username === null ? String(loginForm.value.username) : username,
    password: username === null ? String(loginForm.value.password) : '',
    rememberMe: rememberMe === 'true'
  } as LoginData;
};

onMounted(() => {
  getCode();
  getLoginData();
});
</script>
<style lang="scss" scoped>
/*
 * 登录页版式（admin/AGENTS §13.5，S12.5 定）：
 * 左 46% 平面深潭青品牌区 + 右 54% 白卡表单；控件全部是 Element Plus 既有组件，
 * 不用渐变、不用玻璃拟态（渐变只留移动端首页一处）。
 */
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 40px 24px 24px;
  background-color: #f7fafa;
  /*
   * 页面级背景纹样（2026-10-24 按 Stitch 出图加）：
   * 极低对比的同心弧线 + 右下斜线，只用线条不用渐变、不引图片素材；
   * 全站唯一的装饰性背景，仅登录页可用（admin AGENTS §13.5）。
   */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800' preserveAspectRatio='xMidYMid slice'%3E%3Cg fill='none' stroke='%231F7A8C' stroke-opacity='.07' stroke-width='1.2'%3E%3Ccircle cx='-140' cy='60' r='420'/%3E%3Ccircle cx='-140' cy='60' r='520'/%3E%3Ccircle cx='-140' cy='60' r='620'/%3E%3Ccircle cx='90' cy='880' r='300'/%3E%3Ccircle cx='90' cy='880' r='400'/%3E%3Ccircle cx='1250' cy='740' r='380'/%3E%3Ccircle cx='1250' cy='740' r='480'/%3E%3Cpath d='M980 800 1200 580M1046 800 1200 646M1112 800 1200 712' stroke-opacity='.05'/%3E%3C/g%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.login-shell {
  display: grid;
  grid-template-columns: 46% 54%;
  width: min(960px, 100%);
  overflow: hidden;
  border: 1px solid #e6ebf2;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 18px 48px rgba(31, 45, 61, 0.1),
    0 2px 8px rgba(31, 45, 61, 0.04);
}

.login-brand {
  display: flex;
  flex-direction: column;
  padding: 40px;
  background: #1f7a8c;
  color: #ffffff;
}

.brand-logo {
  display: block;
  width: 40px;
  height: 40px;
}

.brand-pill {
  align-self: flex-start;
  margin-top: 16px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 12px;
}

.brand-title {
  margin: 20px 0 0;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.brand-desc {
  margin: 16px 0 0;
  font-size: 14px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.86);
}

.brand-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.highlight-chip {
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 8px;
  font-size: 12px;
  color: #ffffff;
}

.brand-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: auto;
  padding-top: 32px;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);

  strong {
    font-size: 15px;
    font-weight: 600;
  }

  span {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.72);
  }
}

.login-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
}

.panel-lang {
  position: absolute;
  top: 40px;
  right: 40px;
}

.panel-head {
  padding-right: 48px;
}

.eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.04em;
  color: #8a94a6;
}

.title {
  margin: 8px 0 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;
  color: #1f2d3d;
}

.subtitle {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #8a94a6;
}

.login-form {
  margin-top: 24px;

  :deep(.el-input__wrapper) {
    border-radius: 8px;
    box-shadow: 0 0 0 1px #e6ebf2 inset;
  }

  :deep(.el-input__inner) {
    height: 44px;
  }
}

.captcha-row {
  :deep(.el-form-item__content) {
    display: flex;
    flex-wrap: nowrap;
  }
}

.login-code {
  flex: none;
  margin-left: 12px;
}

.login-code-img {
  display: block;
  width: 96px;
  height: 44px;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  cursor: pointer;
}

.form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0 16px;
}

.link-type {
  font-size: 13px;
}

.submit-row {
  margin-bottom: 8px;
}

.submit-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
}

.login-footer {
  margin-top: 24px;
  font-size: 12px;
  color: #8a94a6;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }

  .login-brand {
    display: none;
  }
}
</style>
