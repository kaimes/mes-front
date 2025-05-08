<template>
  <v-dialog v-model="visible" max-width="500" :close-on-back="false" persistent>
    <v-card title="Bar Unhold">
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">List of hold type</div>
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
          Cancel
        </v-btn>
        <v-btn
          class="text-none"
          color="primary"
          variant="flat"
          :loading="loading"
          :disabled="selected.length === 0"
          @click="handleSave"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { getCurrentInstance, nextTick, ref, toRaw, toRefs } from "vue";
import { toast } from "vue3-toastify";
import { concat, map, unionBy } from "lodash";
import API from "../api";

const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableHeaders = ref([
  { title: "Code", key: "finished_product_code", sortable: false },
  { title: "Hold Code", key: "code", sortable: false },
  { title: "Hold Type", key: "type", sortable: false },
  { title: "Comment", key: "comment", sortable: false },
]);
const tableList = ref([]);
const selected = ref([]);
const loading = ref(false);
const finishedProduct = ref([]);
// 获取所有的菜单路由(包含权限)
let menuTree = localStorage.getItem("menuButtonPermission");
menuTree = JSON.parse(menuTree);
let filteredArrayCode = Object.values(menuTree).reduce(function (
  pre,
  cur,
  index
) {
  if (cur.name === "Hold Reason List") {
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
    const $arr = item.hold_reason || [];
    $arr.forEach((hold) => {
      hold.finished_product_code = item.code;
    });
    return $arr;
  });
  const $tableData = concat(...holdReasonList);
  tableList.value = unionBy($tableData, "id");
  finishedProduct.value = map(data, (item) => item.id);
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
    finishedProduct.value = [];
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
      finished_ids: finishedProduct.value,
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
