import {onMounted, onBeforeUnmount, getCurrentInstance, toRaw, unref} from 'vue'
import {useStore} from "vuex";
import useCommonStore from '@/app/common'
import {filter, find, includes} from "lodash";  // 新增导入

export default function useFooterEvent(configName, {
  handleReset,
  fields,
  column,
  columnRef,
  queryFields,
  queryParams,
}) {
  const { proxy } = getCurrentInstance()
  const store = useStore();
  const commonStore = useCommonStore()
  const $column = unref(toRaw(column || []));

  const handleTableColumn = (values) => {
    if (values.length === 0) {
      return;
    }
    const actionColumn = find($column, (item) => item.key === "action");
    const $columnsSelected = [];
    values.forEach(item => {
      const $item = find($column, (column) => item === column.key) || {};
      if ($item.title) {
        $columnsSelected.push($item);
      }
    });
    if (actionColumn) {
      columnRef.value = [actionColumn, ...$columnsSelected];
    } else {
      columnRef.value = $columnsSelected;
    }
  }

  const resetTableColumn = () => {
    const $selected = commonStore.table[configName] || [];
    if ($selected.length > 0) {
      const $columnsSelected = [];
      $selected.forEach(item => {
        const $item = find($column, (column) => item === column.key) || {};
        if ($item.title) {
          $columnsSelected.push($item);
        }
      });
      const actionColumn = find($column, (item) => item.key === "action");
      columnRef.value = [actionColumn, ...$columnsSelected];
    } else {
      columnRef.value = $column;
    }
  }

  const eventHandler = (res) => {
    const $config = commonStore.footer[configName]

    if (res.name === configName && $config) {
      if (res.type === "all") {
        // 重置后保持和表头设置一致的数据
        resetTableColumn();
        queryFields.value = fields;
        handleReset && handleReset();
        return
      }
      const $type = $config[res.type] || {}
      if ($type["fields"]) {
        queryFields.value = $type["fields"]
        queryParams.value = {
          ...toRaw(queryParams.value),
          ...$type["query"],
        }
        handleTableColumn($type["column"] || []);
      }
    }
  }

  onMounted(() => {
    proxy.$emitter.on('footerEvent', eventHandler)
  })

  onBeforeUnmount(() => {
    proxy.$emitter.off('footerEvent', eventHandler)
  })
}
