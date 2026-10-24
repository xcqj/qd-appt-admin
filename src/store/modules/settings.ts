import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { NavTypeEnum } from '@/enums/NavTypeEnum';
import defaultSettings from '@/settings';
import { useDynamicTitle } from '@/utils/dynamicTitle';

export const useSettingsStore = defineStore('setting', () => {
  const storageSetting = useStorage<LayoutSetting>('layout-setting', {
    tagsView: defaultSettings.tagsView,
    tagsViewPersist: defaultSettings.tagsViewPersist,
    tagsIcon: defaultSettings.tagsIcon,
    fixedHeader: defaultSettings.fixedHeader,
    sidebarLogo: defaultSettings.sidebarLogo,
    dynamicTitle: defaultSettings.dynamicTitle,
    sideTheme: defaultSettings.sideTheme,
    theme: defaultSettings.theme,
    navType: defaultSettings.navType,
    radiusBase: defaultSettings.radiusBase,
    fullHeightTable: defaultSettings.fullHeightTable
  });
  /*
   * S14：侧栏默认值从 `theme-light` 改回 `theme-dark`（与项目既有观感一致）。
   * 但布局设置按 origin 存在 localStorage，老浏览器会一直沿用旧值 —— 刷新、强刷都不会变。
   * 这里做一次性对齐：只重置 sideTheme，其余偏好（主题色 / 标签页 / 导航模式等）保留。
   * 对齐之后用户再手动切浅色，仍会正常记住（版本标记已写，不会重复覆盖）。
   */
  const SETTINGS_VERSION = '2';
  const SETTINGS_VERSION_KEY = 'layout-setting-version';
  try {
    if (localStorage.getItem(SETTINGS_VERSION_KEY) !== SETTINGS_VERSION) {
      storageSetting.value.sideTheme = defaultSettings.sideTheme;
      localStorage.setItem(SETTINGS_VERSION_KEY, SETTINGS_VERSION);
    }
  } catch {
    // 隐私模式 / 存储被禁用时忽略：退回代码默认值即可
  }

  const title = ref<string>(defaultSettings.title);
  const theme = ref<string>(storageSetting.value.theme);
  const sideTheme = ref<string>(storageSetting.value.sideTheme);
  const showSettings = ref<boolean>(defaultSettings.showSettings);
  const tagsView = ref<boolean>(storageSetting.value.tagsView);
  const tagsViewPersist = ref<boolean>(storageSetting.value.tagsViewPersist);
  const tagsIcon = ref<boolean>(storageSetting.value.tagsIcon);
  const fixedHeader = ref<boolean>(storageSetting.value.fixedHeader);
  const sidebarLogo = ref<boolean>(storageSetting.value.sidebarLogo);
  const dynamicTitle = ref<boolean>(storageSetting.value.dynamicTitle);
  const animationEnable = ref<boolean>(defaultSettings.animationEnable);
  const dark = ref<boolean>(defaultSettings.dark);
  const navType = ref<NavTypeEnum>(storageSetting.value.navType || NavTypeEnum.LEFT);
  const radiusBase = ref<number>(storageSetting.value.radiusBase ?? defaultSettings.radiusBase);
  const fullHeightTable = ref<boolean>(storageSetting.value.fullHeightTable ?? defaultSettings.fullHeightTable);

  const setTitle = (value: string) => {
    title.value = value;
    useDynamicTitle();
  };
  return {
    title,
    theme,
    sideTheme,
    showSettings,
    tagsView,
    tagsViewPersist,
    tagsIcon,
    fixedHeader,
    sidebarLogo,
    dynamicTitle,
    animationEnable,
    dark,
    navType,
    radiusBase,
    fullHeightTable,
    setTitle
  };
});
