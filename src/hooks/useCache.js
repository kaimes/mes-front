/**
 * 配置浏览器本地存储的方式，可直接存储对象数组。
 */

import WebStorageCache from 'web-storage-cache'

export const CACHE_KEY = {
  // 用户相关
  ROLE_ROUTERS: 'roleRouters',
  TOKEN: 'ACCESS_TOKEN',
  PERMISSION: 'PERMISSION_TOKEN',
  // 系统设置
  IS_DARK: 'isDark',
  LANG: 'lang',
  THEME: 'theme',
  LAYOUT: 'layout',
  DICT_CACHE: 'dictCache',
  // 登录表单
  LoginForm: 'loginForm',
  TenantId: 'tenantId'
}

export const useCache = (type = 'localStorage') => {
  const wsCache = new WebStorageCache({
    storage: type
  })

  return {
    wsCache
  }
}

export const deleteUserCache = () => {
  const { wsCache } = useCache()
  wsCache.delete(CACHE_KEY.TOKEN)
  wsCache.delete(CACHE_KEY.PERMISSION)
  // 注意，不要清理 LoginForm 登录表单
}
