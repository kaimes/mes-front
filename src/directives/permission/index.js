import permission from './permission'
import permissionUtil from './util.permission'
const install = function (Vue) {
  Vue.directive('permission', permission)
}

if (window.Vue) {
  window.permission = permission
  Vue.use(install); // eslint-disable-line
}

permission.install = install
export default permission
