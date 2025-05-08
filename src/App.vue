<template>
  <div class="app-root">
    <router-view v-if="isRouterActive" />
    <div ref="topButton" class="app-root-up">
      <v-btn icon="mdi-chevron-up" color="primary" @click="handleScrollToTop" />
    </div>
  </div>
</template>

<script setup>
import {provide, nextTick, ref, unref, onMounted, onUnmounted, inject} from 'vue'
import axios from "axios";

const isRouterActive = ref(true)
const topButton = ref(null)
let checkInterval = null;

provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})

const handleScrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const onScroll = () => {
  if (document.documentElement.scrollTop > 200) {
    topButton.value?.classList.add('app-root-up--visible')
  } else {
    topButton.value?.classList.remove('app-root-up--visible')
  }
}

const checkVersion = () => {
  const currentVersion = inject('VUE_APP_VERSION');
  checkInterval = setInterval(async () => {
    try {
      // 添加时间戳或随机数防止缓存 version.json
      const response = await axios.get(`/version.json?t=${new Date().getTime()}`);
      const latestVersion = response.data.version;
      console.log("latestVersion", latestVersion)
      if (latestVersion && latestVersion !== currentVersion) {
        // 版本不一致，提示用户刷新
        console.log('New version detected! Please refresh.');
        clearInterval(checkInterval); // 停止检查
        window.location.reload(true);
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }
  }, 60 * 1000); // 每 1 分钟检查一次

}

onMounted(() => {
  window.addEventListener('scroll', onScroll)
  const isProduction = import.meta.env.PROD;
  if (isProduction) {
    checkVersion();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
</script>

<style lang="scss" scoped>
.app-root {
  &-up {
    display: none;
    opacity: 0;
    position: fixed;
    right: 24px;
    bottom: 88px;
    z-index: 99;
    transition: opacity 0.3s ease, transform 0.3s ease;
    transform: translateY(10px);
    &--visible {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    ::v-deep .v-btn {  // 穿透scoped样式
      .v-icon {
        color: white !important;
      }
    }
  }
}
</style>

