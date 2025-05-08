import { createRouter, createWebHistory } from "vue-router";
import {getAccessToken} from "@/util/util";
import store from "@/store";
import { publicRoute, protectedRoute, Route404 } from "./config";


const routes = protectedRoute.concat(publicRoute).concat(Route404);
const router = createRouter({
    history: createWebHistory(import.meta.env.VUE_APP_BASE_ENV),
    routes
});

// 路由不重定向白名单
const whiteList = [
  '/login',
  '/register'
]

router.beforeEach(async (to, from, next) => {
  const token = getAccessToken();
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' , replace: true})
    } else {
      // 确保permission接口调用完成
      await store.dispatch('app/getPermission');
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
});

export default router;
