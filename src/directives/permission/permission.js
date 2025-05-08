import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import permissionUtil from './util.permission'

export function hasPermission(app) {
  app.directive('permission', {
    mounted(el, binding) {
      const { value } = binding

      const { hasPermission,menu } = permissionUtil.hasPermissions(value)
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
        return;
      }
      // 仅在remark存在时创建提示
      if (menu?.remark) {
        el._tippyInstance = tippy(el, {
          content: menu.remark,
          placement: 'top',
          theme: 'light-border',
          appendTo: () => document.body,
          onShow(instance) {
            return !!instance.props.content
          }
        })
      }
    },
    updated(el, binding) {
      const { value } = binding
      const { hasPermission,menu } = permissionUtil.hasPermissions(value)
      if (!hasPermission) {
        if (el._tippyInstance) {
          el._tippyInstance.destroy()
          delete el._tippyInstance
        }
        el.parentNode && el.parentNode.removeChild(el)
        return;
      }
      // 动态更新提示内容
      if (el._tippyInstance) {
        el._tippyInstance.setContent(menu?.remark || '')
      }
    },
    beforeUnmount(el) {
      if (el._tippyInstance) {
        el._tippyInstance.destroy()
      }
    }
  })
}
