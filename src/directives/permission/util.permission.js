/*
 * @创建文件时间: 2021-06-27 10:14:26
 * @Auther: 猿小天
 * @最后修改人: 猿小天
 * @最后修改时间: 2021-08-09 21:51:29
 * 联系Qq:1638245306
 * @文件介绍: 权限控制
 */
import XEUtils from 'xe-utils'
import router from '@/router'
import {CACHE_KEY, useCache} from "@/hooks/useCache";
// 添加缓存变量
export let cachedMenuData = []
const { wsCache } = useCache()
export default {
  hasPermissions(value) {

    const path = router.currentRoute._value.path
    const need = Array.isArray(value) ? [...value] : typeof value === 'string' ? [value] : []

    if (need.length === 0) {
      // 生产环境下返回false避免页面崩溃
      console.error('need permissions! Like v-permission="usersphere:user:view"');
      return {
        hasPermission: false,
        menu: {}
      };
    }

    // 缓存处理
    if (!cachedMenuData || cachedMenuData.length === 0) {
      cachedMenuData = XEUtils.toTreeArray(wsCache.get(CACHE_KEY.PERMISSION) || [])
      // 添加storage监听更新缓存
      window.addEventListener('storage', (e) => {
        console.log("e.key", e.key)
        if (e.key === CACHE_KEY.PERMISSION && e.newValue) {
          cachedMenuData = XEUtils.toTreeArray(wsCache.get(CACHE_KEY.PERMISSION) || [])
          console.log("cachedMenuData", cachedMenuData)
        }
      })
    }

    // 使用数组方法优化遍历
    const $menu = cachedMenuData.filter(item =>
      item.path === path && item.permission && need.includes(item.permission)
    );
    return {
      hasPermission: $menu.length > 0,
      menu: XEUtils.first($menu) || {}
    };
  },
  clearCachedMenuData() {
    cachedMenuData = null; // 清除缓存    
  }
}
