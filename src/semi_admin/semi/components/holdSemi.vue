<template>
  <v-dialog v-model="visible" max-width="800" :close-on-back="false" persistent>
    <v-card :title="$t('semi.hold_button.semi_hold')">
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">{{$t('semi.hold_button.list_of_selected')}}</div>
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-data-table
           fixed-header
          :headers="tableHeaders"
          :items="tableList"
          density="default"
          height="300"
          item-value="id"
        >
          <template #bottom>
            <!-- Leave this slot empty to hide pagination controls -->
          </template>
        </v-data-table>
      </div>
      <div class="text-subtitle-2 ml-4 mr-4 mb-2 mt-2">{{$t('semi.hold_button.list_of_hold_type')}}</div>
      <div class="pa-4 border rounded ml-4 mr-4 mb-4">
        <v-form ref="editForm">
          <v-row
            v-for="(item, index) in form.items"
            align="center"
            :key="item.key"
          >
            <v-col cols="4">
              <SemiHoldReasonCode
                v-model="item.hold_id"
             
                :hideDetails="false"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="item.comment"
                density="default"
                variant="underlined"
                label="Comment"
                bg-color="white"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <template v-if="index + 1 === form.items.length">
                <v-btn
                  density="comfortable" variant="outlined" flat
                  icon="mdi-plus"
                  @click="handleAddItem"
                ></v-btn>
              </template>
              <template v-else>
                <v-btn
                  density="comfortable" variant="outlined" flat
                  icon="mdi-minus"
                  @click="handleRemoveItem(item)"
                ></v-btn>
              </template>
            </v-col>
          </v-row>
        </v-form>
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
          @click="handleSave"
        >
        {{$t('global.confirm')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
  toRaw,
  toRefs,
  computed
} from "vue";
import { toast } from "vue3-toastify";
import { v4 as uuidv4 } from "uuid";
import { reject } from "lodash";
import XEUtils from "xe-utils";
import SemiHoldReasonCode from "@/components/picker/SemiHoldReasonCode.vue";
import API from "../api";
import { fi } from "date-fns/locale";
import { useI18n } from "vue-i18n";
const { t } = useI18n()
const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
const visible = ref(false);
const tableHeadersDefinition = ref([
  { title: "semi.hold_button.code", key: "cast.cast_code", sortable: false },
  { title: "semi.hold_button.skelp_code", key: "skelp_code", sortable: false },
  { title: "semi.hold_button.type", key: "semi_type", sortable: false },
  { title: "semi.hold_button.quality", key: "quality_code", sortable: false },
  { title: "semi.hold_button.quantity", key: "quantity", minWidth: 120, sortable: false },
  
]);
const tableHeaders = computed(() => {
    return tableHeadersDefinition.value.map(header => ({
      ...header,
      title: header.title.includes('.') ? t(header.title) : header.title
    }));
  });
const tableList = ref([]);
const loading = ref(false);
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

const data = reactive({
  form: {
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  },
  rules: {

    hold_id: [
      (value, item) => {
        // 获取所有的菜单路由(包含权限)
        if (value && value.code) {
          let parts = value.code.split("-");
          let code = parts[0]; // "K"

          let hold_code = 'hold-'+code
          if (filteredArrayCode.indexOf(hold_code) >= 0) {      
            return true;
          }
          return "Not Authorized. Please contact IT.";
        }
        return "Hold Reason is required.";
      },
    ],

  },
});

const { form, rules } = toRefs(data);

const handleShow = (data) => {
  console.log("hhhhold")
  console.log(data)
  visible.value = true;
  tableList.value = data;
};

const handleAddItem = () => {
  const { items } = toRaw(form.value);
  form.value.items = [
    ...items,
    {
      key: uuidv4(),
      hold_id: undefined,
      comment: undefined,
    },
  ];
};

const handleRemoveItem = (item) => {
  const { items } = toRaw(form.value);
  form.value.items = reject(items, { key: item.key });
};

const handleClose = () => {
  visible.value = false;
  form.value = {
    items: [
      {
        key: uuidv4(),
        hold_id: undefined,
        comment: undefined,
      },
    ],
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  });
};

const handleSave = async () => {
  const { valid } = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  try {
    await API.hold({
      semi_ids: tableList.value.map((item) => item.id),
      hold_list: Object.values(params.items).reduce(function (pre, cur, index) {
        return [
          ...pre,
          { key: cur.key, hold_id: cur.hold_id.id, comment: cur.comment },
        ];
      }, []),
    });
    handleClose();
    emit("refresh");
    toast.success("Hold Success", {
      position: "bottom-center",
    });
  } catch (res) {
    toast.error("Hold Fail", { autoClose: 60000 });
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
