<template>
  <v-container class="shift-content" fluid>
    <v-form ref="shiftForm" @submit.prevent="handleSave">
      <v-row align="center">
        <v-col cols="4">
          <v-autocomplete
              v-model="query.shiftCode"
              @update:search="handleSearch"
              @update:model-value="handleChoose"
              label="Shift Code"
              prepend-inner-icon="mdi-file-document-refresh"
              append-inner-icon="mdi-magnify"
              item-title="code"
              item-value="id"
              hide-details
              :loading="searching"
              :items="shiftNoList"
              clearable
          ></v-autocomplete>
        </v-col>
        <v-col cols="4">
          <VueDatePicker @update:model-value="formatDate">
            <template #trigger>
              <v-text-field
                  v-model="date"
                  label="Programmed Date"
                  placeholder="Please select date"
                  bg-color="white"
                  hide-details
                  clearable
                  readonly
              ></v-text-field>
            </template>
          </VueDatePicker>
        </v-col>
      </v-row>
      <div class="panel">
        <div class="panel-action">
          <span class="text-subtitle-2 font-weight-regular mr-2">Save</span>
          <v-switch
              v-model="save"
              width="123"
              density="default"
              hide-details
              inset
          ></v-switch>
          <span class="text-subtitle-2 font-weight-regular ml-2">Edit</span>
        </div>
        <v-row>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Code</div>
            <v-text-field
                v-model="form.code"
                :rules="rules.code"
                disabled
                type="number"
                color="#333"
                density="default"
                variant="underlined"
                hint="cannot be changed"
                persistent-hint
                placeholder="shift code"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Name</div>
            <v-text-field
                v-model="form.name"
                :rules="rules.name"
                density="default"
                variant="underlined"
                placeholder="Please enter the name"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Description</div>
            <v-text-field
                v-model="form.desc"
                :rules="rules.desc"
                density="default"
                variant="underlined"
                placeholder="Please enter the description"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Shift Day</div>
            <v-text-field
                v-model="form.shift_day"
                :rules="rules.shift_day"
                density="default"
                variant="underlined"
                placeholder="Please enter the shift day"
                bg-color="white"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Shift No.</div>
            <v-text-field
                v-model="form.shift_no"
                :rules="rules.shift_no"
                density="default"
                variant="underlined"
                placeholder="Please enter the shift number"
                bg-color="white"
                required
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Shift Start</div>
            <v-text-field
                v-model="form.shift_start"
                :rules="rules.shift_start"
                color="#333"
                density="default"
                variant="underlined"
                placeholder="Please enter the start time"
                bg-color="white"
                required
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <div class="text-subtitle-2 font-weight-regular	mb-2">Shift End</div>
            <v-text-field
                v-model="form.shift_end"
                :rules="rules.shift_end"
                color="#333"
                density="default"
                variant="underlined"
                placeholder="Please enter the end time"
                bg-color="white"
                required
                clearable
            ></v-text-field>
          </v-col>
         
        </v-row>
        <div v-show="save" class="text-end pt-2 pb-2 pr-4">
          <v-btn :loading="loading" size="large" color="primary" type="submit">Save</v-btn>
        </div>
      </div>
    </v-form>
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import moment from "moment";
import API from "./api";

const route = useRoute();
const store = useStore();
const router = useRouter();
const searching = ref(false);
const loading = ref(false);
const date = ref("Select Date");
const save = ref(false);

const shiftNoList = ref([]);

const {proxy} = getCurrentInstance();

const data = reactive({
  query: {
    shiftCode: undefined,
    date: undefined
  },
  form: {
    id: undefined,
    code:undefined,
    name:undefined,
    decs:undefined,
    shift_day: undefined,
    shift_no: undefined,
    shift_start: undefined,
    shift_end: undefined,
    
  },
  rules: {
    id: [
      value => {
        if (value) return true
        return 'Name is required.'
      },
      value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
      },
    ],
    name: [
      value => {
        if (value) return true
        return 'Name is required.'
      },
      value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
      },
    ],
  }
});

const {query, form, rules} = toRefs(data);

const handleSearch = async (val) => {
  console.log('val>>>>>', val)
  // if (val && val.length > 2) {
    searching.value = true;
    try {
      const { status, data } = await API.getAll(val)

      // if (status === 200) {
      //   shiftNoList.value = data.items || [];
      // } else {
      //   shiftNoList.value = [];
      // }
      shiftNoList.value = data.items || [];
    } finally {
      searching.value = false;
    }
  // }
}


const formatDate = (res) => {
  if (!res) {
    query.date = moment(res).format("YYYY-MM-DD");
  }
}
const getDetailById = (id) => {
  API.getDetailById(id).then(res => {
    const { status, data } = res
    if (status === 200) {
      form.value = {
        id: data.id,
        code:data.code,
        name: data.name,     
        decs: data.decs,
        shift_day: data.shift_day,
        shift_no: data.shift_no,
        shift_start:data.shift_start,
        shift_end:data.shift_end

      };
      if (query.value.shiftCode != data.code) {
        query.value.shiftCode = data.code;
      }
    } else {
      // TODO: 添加错误异常提示

    }
  });
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["shiftForm"].validate();
  if (!valid) {
    return;
  }
  const { code, ...rest } = toRaw(form.value);
  loading.value = true;
  API.save({
    ...rest,
    code: code,
  }).then(res => {
    router.back();
  }).finally(() => {
    loading.value = false;
  });
}

const handleChoose = (id) => {
  if (id) {
    getDetailById(id)
  }
}

const resetForm = () => {
  proxy.$refs["shiftForm"].reset();
}

const resetValidation = () => {
  proxy.$refs["shiftForm"].resetValidation();
}

// // 事件业务处理
// const handleActionshift = (isActive, status) => {
//   isActive.value = false;
//   const { id } = toRaw(form.value);
//   API.updateStatus(id, status).then(res => {
//     if (status === "Open") {
//       router.push({ path: "/shift_status", query: { code: id } });
//       return;
//     }
//     getDetailById(id);
//   })
// }

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getDetailById(route.query.id)
}

</script>
<style lang="scss" scoped>
.shift-content {
  .panel {
    position: relative;
    background-color: #D9D9D9;
    padding: 42px 12px 12px 12px;
    min-height: 440px;
    &-action {
      position: absolute;
      top: 10px;
      right: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      z-index: 1;
    }
  }
}
</style>