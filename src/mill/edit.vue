<template>
  <v-container class="semi-load-content" fluid>
    <v-form ref="millEditForm" @submit.prevent="handleSave">
      <v-card class="pa-4 mt-3" elevation="0" variant="outlined">
        <div class="d-flex align-center ga-4 justify-end">
          <span class="text-subtitle-2 font-weight-regular">{{ save ? "Save" : "View" }}</span>
          <v-switch
              v-model="save"
              density="default"
              hide-details
              inset
          ></v-switch>
          <v-btn @click="handleSave" class="text-none" :loading="loading" :disabled="!save" variant="flat" color="primary">
            {{ !save ? "Update" : "Save" }}
          </v-btn>
        </div>
        <v-row align="center">
          <v-col cols="6">
            <v-text-field
                v-model="form.code"
                :rules="rules.code"
                :disabled="!!form.id"
                label="Code"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
                v-model="form.type"
                :rules="rules.type"
                label="Type"
                clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-card class="pa-4" elevation="0" variant="outlined">
              <div class="d-flex align-center mb-4 justify-space-between">
                <span class="text-body-1 font-weight-bold">Users</span>
                <v-btn variant="flat" color="primary" @click="handleAddBar" :disabled="!save">
                  ADD
                </v-btn>
              </div>
              <v-divider/>
              <v-data-table-server
                  min-height="300"
                  :headers="tableHeaders"
                  :items="form.dispatch_user"
                  :loading="loading"
              >
                <template v-slot:item.action="{ item }">
                  <v-dialog
                      max-width="400"
                      persistent
                  >
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-btn
                          variant="text"
                          icon="mdi-delete"
                          v-bind="activatorProps"
                      />
                    </template>
                    <template v-slot:default="{ isActive }">
                      <v-card
                          prepend-icon="mdi-help-circle-outline"
                          text="Deletion is irreversible"
                          title="Confirm to delete data?"
                      >
                        <template v-slot:actions>
                          <v-spacer></v-spacer>
                          <v-btn
                              class="text-none"
                              color="#e3e3e3"
                              variant="flat"
                              @click="isActive.value = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                              class="text-none"
                              color="primary"
                              variant="flat"
                              @click="handleDelete(isActive, item)"
                          >
                            Confirm
                          </v-btn>
                        </template>
                      </v-card>
                    </template>
                  </v-dialog>
                </template>
                <template #bottom>
                </template>
              </v-data-table-server>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-textarea
                v-model="form.desc"
                :rules="rules.desc"
                label="Description"
                rows="3"
                clearable
            />
          </v-col>
        </v-row>
      </v-card>
    </v-form>
    <AddUserBar ref="userBarRef" @change="handlePickBar"></AddUserBar>
  </v-container>
</template>
<script setup>
import {getCurrentInstance, reactive, ref, toRaw, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {filter, includes, map} from "lodash";
import { toast } from "vue3-toastify";
import {formatDate} from "@/util/util";
import API from "./api";
import AddUserBar from "./components/addUserBar.vue";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const save = ref(true);
const tableHeaders = ref([
  {title: "Action", key: "action", width: 50, sortable: false, fixed: true},
  {title: "Email", key: "email", sortable: false},
  {title: "Mill Code", key: "current_mill_code", sortable: false},
  {title: "Created At", key: "created_at", sortable: false, value: (item) => formatDate(item['created_at'])},
]);

const {proxy} = getCurrentInstance();

const data = reactive({
  form: {
    id: undefined,
    code: undefined,
    desc: undefined,
    type: undefined,
    user_ids: [],
    dispatch_user: [],
  },
  rules: {
    code: [
      value => {
        if (value) return true
        return 'Code is required.'
      }
    ],
    type: [
      value => {
        if (value) return true
        return 'Type is required.'
      }
    ],
    user_ids: [
      value => {
        if (value && value.length > 0) return true
        return 'User is required.'
      }
    ],
  }
});

const {form, rules} = toRefs(data);

const getDetailById = (id) => {
  console.log("idididididid", id)
  API.get(id).then(res => {
    console.log("resresresresresresresres", res)
    const { status, data } = res
    if (status === 200) {
      save.value = false;
      form.value = data
    }
  }).catch(res => {
    toast.error(res?.response?.data?.detail || "Get Detail Fail", { autoClose: 60000 });
  });
}

const handleAddBar = () => {
  proxy.$refs["userBarRef"].handleShow(form.value.dispatch_user);
}

const handlePickBar = (arr) => {
  const ids = map(form.value.dispatch_user, "id");
  const $arr = filter(arr, item => !includes(ids, item.id));
  if ($arr.length > 0) {
    form.value.dispatch_user.push(...$arr);
  }
}

const handleDelete = (isActive, item) => {
  isActive.value = false;
  let deleteIndex = form.value.dispatch_user.findIndex(elem => elem.id === item.id)
  if (deleteIndex !== -1) {
    form.value.dispatch_user.splice(deleteIndex, 1);
  }
  isActive.value = false;
}

const handleSave = async () => {
  const { valid } = await proxy.$refs["millEditForm"].validate();
  if (!valid) {
    return;
  }
  const user_ids = map(form.value.dispatch_user, "id");
  if (user_ids.length === 0) {
    toast.info("Please Choose User");
    return;
  }
  const params = toRaw(form.value);
  loading.value = true;
  API.save({
    ...params,
    user_ids,
  }).then(res => {
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 2000,
      onClose: () => router.back()
    });
  }).catch(() => {
    toast.error(params.id ? "Update Fail" : "Create Fail", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false;
  });
}

// 进入页面根据ID获取数据详情
if (route.query.id) {
  getDetailById(route.query.id)
}



</script>
<style lang="scss" scoped>
</style>
