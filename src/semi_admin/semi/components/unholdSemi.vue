<template>
  <v-dialog v-model="visible" max-width="500" :close-on-back="false" persistent>
    <v-card :title="$t('semi.unhold_button.bar_unhold')">
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">{{$t('semi.unhold_button.list_of_hold_type')}}</div>
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-data-table
          v-model="selected"
          :headers="tableHeaders"
          :items="tableList"
          show-select
          density="default"
          max-height="100"
          item-value="id"
        >
          <template #bottom>
            <!-- Leave this slot empty to hide pagination controls -->
          </template>
        </v-data-table>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="text-none mr-4"
          color="#e3e3e3"
          variant="flat"
          @click="handleClose"
        >
        {{$t('global.cancel')}}
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="selected.length === 0"
          @click="handleSave"
        >
        {{$t('global.confirm')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { getCurrentInstance, nextTick, ref, toRaw, toRefs, computed} from "vue";
import { toast } from "vue3-toastify";
import { concat, map, unionBy } from "lodash";
import API from "../api";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableHeadersDefinition = ref([
  { title: "semi.unhold_button.code", key: "semi_code", sortable: false },
  { title: "semi.unhold_button.hold_code", key: "code", sortable: false },
  { title: "semi.unhold_button.hold_type", key: "type", sortable: false },
  { title: "semi.unhold_button.comment", key: "comment", sortable: false },
]);
const tableHeaders = computed(() => {
  return tableHeadersDefinition.value.map(header => ({
    ...header,
    title: header.title.includes('.') ? t(header.title) : header.title
  }));
});
const tableList = ref([]);
const selected = ref([]);
const loading = ref(false);
const semi = ref([]);
// 获取所有的菜单路由(包含权限)
let menuTree = localStorage.getItem("menuButtonPermission");
menuTree = JSON.parse(menuTree);
let filteredArrayCode = Object.values(menuTree).reduce(function (
  pre,
  cur,
  index
) {
  if (cur.name === "Semi Hold Reason") {
    return [...pre, cur.permission];
  } else {
    return pre;
  }
},
[]);

const handleShow = (data, id) => {
  visible.value = true;
  // 处理数组
  const holdReasonList = map(data, (item) => {
    const $arr = item.semi_hold_reason || [];
    $arr.forEach((hold) => {
      hold.semi_code = item.code;
    });
    return $arr;
  });
  const $tableData = concat(...holdReasonList);
  tableList.value = unionBy($tableData, "id");
  semi.value = map(data, (item) => item.id);
  if (id) {
    nextTick(() => {
      selected.value = [id];
    });
  }
};

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    selected.value = [];
    semi.value = [];
  });
};

const handleSave = async () => {
  loading.value = true;

  for (let key in selected.value){

    let selected_value = tableList.value.find(item => item.id == selected.value[key])

    let unhold_code = 'unhold-'+selected_value.code

    if (selected_value) {
      if (filteredArrayCode.indexOf(unhold_code) < 0) {
        toast.error(
          "You do not have permission to perform this action , Hold Reason:" +
          selected_value.code,
          {
            position: "bottom-center",
          }
        , { autoClose: 60000 });
        loading.value = false;
        return;
        
      }
    }
    
  }



  // 添加hold 权限判断
  // const notAllowData = Object.values(tableList.value).reduce(function (
  //   pre,
  //   cur,
  //   index
  // ) {
  //   console.log('cur',cur);
  //   console.log(filteredArrayCode);
    
    
  //   if (filteredArrayCode.indexOf(cur.code) < 0) {
  //     return [...pre, cur.code];
  //   } else {
  //     return pre;
  //   }
  // },
  // []);
  // console.log('notAllowData',notAllowData);
  
  // if (notAllowData.length > 0) {
  //   toast.error(
  //     "You do not have permission to perform this action , Hold Reason:" +
  //       notAllowData,
  //     {
  //       position: "bottom-center",
  //     }
  //   , { autoClose: 60000 });
  //   loading.value = false;
  //   return;
  // }

  try {
    await API.unHold({
      semi_ids: semi.value,
      hold_list: selected.value,
    });
    handleClose();
    emit("refresh");
    toast.success("UnHold Success", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error("UnHold Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
