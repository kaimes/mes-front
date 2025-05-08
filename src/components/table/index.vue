<template>
  <FormDialog
      v-model="visible"
      :width="300"
      title="Table Column"
      desc="Setting Column"
      :loading="loading"
      body-class="pa-0"
      @close="handleClose"
      @save="handleSave"
  >
    <div class="column">
      <div class="column-selected">
        <div class="text-subtitle-1 font-weight-bold pa-4">Display Fields</div>
        <Draggable
            v-model="selected"
            item-key="title"
        >
          <template #item="{ element }">
            <div class="column-item pt-1 pb-1 pl-2 pr-4">
              <v-icon size="small" class="mr-2">mdi-drag</v-icon>
              <div class="column-item-title text-subtitle-1 bold">
                {{ element.title }}
              </div>
              <v-switch
                  color="primary"
                  :model-value="true"
                  density="compact"
                  hide-details
                  @change="handleToggle(element.key, true)"
              ></v-switch>
            </div>
          </template>
        </Draggable>
      </div>
      <v-divider></v-divider>
      <div class="column-unselected">
        <div class="text-subtitle-1 font-weight-bold pa-4">Field not shown</div>
        <div v-for="(element, index) in unselected" class="column-item pt-1 pb-1 pl-4 pr-4" :key="`${element.key}_${index}`">
          <div class="column-item-title text-subtitle-1 bold">
            {{ element.title }}
          </div>
          <v-switch
              color="primary"
              :model-value="false"
              density="compact"
              hide-details
              @change="handleToggle(element.key, false)"
          ></v-switch>
        </div>
      </div>
    </div>
  </FormDialog>
</template>

<script setup>
import {computed, ref, unref, toRaw, onMounted, onBeforeUnmount, getCurrentInstance} from "vue";
import Draggable from 'vuedraggable'
import { toast } from "vue3-toastify";
import {filter, includes, remove, find, uniq} from "lodash";
import FormDialog from "@/components/FormDialog.vue";
import useCommonStore from "@/app/common";
import store from "@/store";


const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  // 当前存储的key值 唯一 不能重复
  name: {
    type: String,
    required: true
  },
})
const { proxy } = getCurrentInstance()

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);

const selected = ref([]);
const unselected = ref([]);
let cacheData = unref([]);
let actionColumn = unref([]);

const emit = defineEmits(['update:modelValue']);

const commonSelected = computed(() => commonStore.table[props.name] || []);


const handleShow = () => {
  visible.value = true;
}

const handleClose = () => {
  visible.value = false;
}

// 如果是false说明是要隐藏
const handleToggle = (key, value) => {
  const $selected = toRaw(selected.value);
  const $unselected = toRaw(unselected.value);
  if (value) {
    const $filterSelectedItem = remove($selected, (item) => item.key === key);
    selected.value = $selected;
    unselected.value = [
      ...$unselected,
      ...$filterSelectedItem,
    ];
  } else {
    const $filterUnselectedItem = remove($unselected, (item) => item.key === key);
    unselected.value = $unselected;
    selected.value = [
      ...$selected,
      ...$filterUnselectedItem,
    ];
  }
}

const handleSave = () => {
  const $columns = toRaw(selected.value);
  if ($columns.length < 5) {
    toast.info("The number of columns displayed in the table must not be less than 5 columns", {
      position: "bottom-center",
    });
    return;
  }
  const params = {
    ...commonStore.table,
    [`${props.name}`]: $columns.map(item => item.key),
  };
  store.dispatch("org/save", {
    "work_calendar": params
  }).then(() => {
    emit("update:modelValue", [...actionColumn, ...$columns]);
    commonStore.setTableData(params);
  });
  handleClose();
}

const setColumnsData = (arr) => {
  if (arr.length > 0) {
    const $selected = uniq(arr);
    const $columnsSelected = [];
    $selected.forEach(item => {
      const $item = find(cacheData, (column) => item === column.key) || {};
      if ($item.title) {
        $columnsSelected.push($item);
      }
    });
    const $columnsUnselected = filter(cacheData, (item) => !includes($selected, item.key));
    selected.value = $columnsSelected;
    unselected.value = $columnsUnselected;
    return $columnsSelected;
  }
  return [];
}

const updateColumns = () => {
  const $selected = toRaw(commonSelected.value);
  const $columnsSelected = setColumnsData($selected);
  if ($columnsSelected.length > 0) {
    emit("update:modelValue", [...actionColumn, ...$columnsSelected]);
  } else {
    const $columns = filter(cacheData, item => !item.hidden);
    if ($columns.length !== cacheData.length) {
      emit("update:modelValue", [...actionColumn, ...$columns]);
    }
  }
}

const eventHandler = (res) => {
  const $config = commonStore.footer[props.name]
  if (res.name === props.name && $config) {
    if (res.type === "all") {
      // 重置后保持和表头设置一致的数据
      const $selected = toRaw(commonSelected.value);
      setColumnsData($selected);
      return
    }
    const $type = $config[res.type] || {}
    if ($type["column"]) {
      setColumnsData($type["column"]);
    }
  }
}

onBeforeUnmount(() => {
  proxy.$emitter.off('footerEvent', eventHandler)
})

onMounted(() => {
  if (cacheData.length === 0) {
    cacheData = toRaw(props.modelValue);
    actionColumn = remove(cacheData, (item) => item.key === "action");
  }
  // 处理数据里面设置了hidden的属性
  selected.value = filter(cacheData, item => !item.hidden);
  unselected.value = filter(cacheData, item => item.hidden);
  updateColumns();
  commonStore.$subscribe((res) => {
    updateColumns();
  });

  proxy.$emitter.on('footerEvent', eventHandler)
});

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
.column {
  &-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #ffffff;
    cursor: pointer;
    padding: 0 2px;
    &:hover {
      background-color: #f3f3f3;
    }
    &-title {
      display: flex;
      flex: 1;
      flex-shrink: 0;
    }
  }
}
</style>
