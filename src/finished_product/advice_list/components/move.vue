<template>
  <v-dialog
      v-model="visible"
      max-width="700"
      :close-on-back="false"
      persistent
  >
    <v-card
        title="Advice Move"
        prepend-icon="mdi-alert-circle-outline"
    >
      <v-divider></v-divider>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4 mt-4">Move</div>
      <div class="d-flex justify-start ga-2 pa-4">
        <!-- <v-chip v-for="(item, index) in form.codes" :key="index">
          {{ item }}
        </v-chip> -->
        <v-chip>
          {{ form.code }}
        </v-chip>
      </div>
      <div class="text-subtitle-1 font-weight-bold ml-4 mr-4">To</div>
      <div class="pa-4">
        <v-form ref="moveForm">
          <v-row align="center">
            <!-- <v-col cols="4">
              <BusinessType
                v-model="form.business_type"
                bg-color="white"
                density="default"
                variant="underlined"
                color="#333"
                label="Business Type"
                code="business_type"
                disabled
            />
            </v-col> -->
            <v-col cols="4">
                <v-text-field v-model="form.business_type" density="default" variant="underlined" placeholder="Transport Type"
                    bg-color="white" clearable disabled label="Business Type"></v-text-field>
            </v-col>
            <v-col cols="4">
              <Location v-model="form.to_area_id" label="Location" :rules="rules.to_area_id"  />
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
          Cancel
        </v-btn>
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :loading="loading"
            @click="handleSave"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, computed} from "vue";
import {toast} from "vue3-toastify";
import {map} from "lodash";
import SiteType from "./picker/SiteType.vue";
import Site from "./picker/Site.vue";
import Area from "./picker/Area.vue";
import Location from "../../../components/picker/Location.vue";
import API from "../api";
import BusinessType from "../../../components/picker/BusinessType.vue";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);
const visible = ref(false);
const loading = ref(false);

const data = reactive({
  form: {
    // codes: [],
    code: undefined,
    to_area_id: undefined,
    business_type: undefined
  },
  rules: {
    to_area_id: [
      value => {
        if (value) return true
        return 'Location is required.'
      }
    ],
  }
});

const { form, rules } = toRefs(data);

const handleShow = (data) => {
  
  // 处理数组
  // form.value.codes = map(data, (item) => item.code);
  console.log('dadawdawta', data);
  form.value.code = data.advice_code;
  form.value.business_type = data.business_type;
  form.value.to_area_id = data.to_area_id;
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    // codes: [],
    code: undefined,
    business_type: undefined,
    to_area_id: undefined,
  };
  nextTick(() => {
    proxy.$refs["moveForm"].resetValidation();
  })
}

const handleSave = async () => {
  const {valid} = await proxy.$refs["moveForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  console.log('params值', params);
  try {
    await API.move(params); 
    handleClose();
    emit("refresh");
    toast.success("Move Success", {
      position: "bottom-center"
    });
  } catch (res) {
    toast.error("Move Fail", { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
</style>
