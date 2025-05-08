import { hasPermission } from "./permission/permission";

export const setupAuth = (app) => {
  // 注册全局指令
  hasPermission(app)
}
