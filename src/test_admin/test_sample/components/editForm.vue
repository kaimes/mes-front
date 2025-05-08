<template>
  <FormDialog
    v-model="visible"
    :width="550"
    :title="form.id ? $t('test_sample.new.update') : $t('global.new')"
    :desc="$t('test_sample.new.desc')"
    :loading="loading"
    @close="handleClose"
    @save="handleSave"
    @forceSave="handleForceSave"
    v-if="visible"
    showForce
  >
    <v-form ref="editForm">
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="form.ref_code"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.ref_code')"
            bg-color="white"
            :rules="!form.id? rules.ref_code:[]"
          ></v-text-field>
        </v-col>


        <v-col cols="6">
          <MillCode
            v-model="form.mill_id"
            :mill="form.mill"
            :rules="rules.mill_id"
            :hide-details="false"
            @change="handleItemChange($event, 'mill_id')"
          />
        </v-col>
        <v-col cols="6">
          <SpecCode
            v-model="form.spec_id"
            :hide-details="false"
            :spec="form.spec"
            item-title="spec_code"
            @change="handleSpecChange"
            :rules="rules.spec_id"
          />
        </v-col>

        <v-col cols="6">
          <runout-code
            v-model="form.runout_id"
            :hide-details="false"
            :runout="form.runout"
            :rules="rules.runout_id"
            @change="handleRunoutChange"
          />
        </v-col>
        
        <v-col cols="6">
        <FinishedProductCode
            v-model="form.finished_product_id"
            :hide-details="false"
            :finished_product="form.finished_product"
            :runout_id="form.runout_id"
            @change="handleFinishedProductChange"
            :rules="!form.id? rules.finished_product_id:[]"
        />
        </v-col>

        <v-col cols="6">
          <cast-code
            v-model="form.cast_id"
            :hide-details="false"
            :cast="form.cast"
            :disabled="form.mill_id === 410"
            @change="handleItemChange($event, 'cast_id')"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.product_name"

            density="default"
            variant="underlined"
            :label="$t('test_sample.table.product_name')"
            bg-color="white"
            disabled="true"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.size_mm"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.size')"
            bg-color="white"
            type="number"
            placeholder="Filled if product has value"
            :rules="!form.id? rules.size:[]"
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <DictCode
            v-model="form.status"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.status')"
            code="test_sample_status"
            :hide-details="false"
            bg-color="white"
          />
        </v-col>

        <v-col cols="6">
          <DictCode
            v-model="form.reason_code"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.reason_code')"
            code="test_sample_reason_code"
            :hide-details="false"
            bg-color="white"
            clearable
            :rules="!form.id? rules.reason_code:[]"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="form.test_sample_code"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.test_sample_code')"
            bg-color="white"
            placeholder="default same as runout code"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.test_sample_part"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.test_sample_part')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.concast_code"
            :rules="rules.stringMax5"
            density="default"
            variant="underlined"
            :label="$t('test_sample.new.concast_code')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <DictCode
            v-model="form.source"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.source')"
            :code="`test_sample_source#${defaultMillCode}`"
            :hide-details="false"
            bg-color="white"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.sample_thickness"
            type="number"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.sample_thickness')"
            bg-color="white"
            placeholder="Select the Finished Product to view the value."
          ></v-text-field>
        </v-col>

        <v-col cols="6">
          <DictCode
            v-model="form.sample_info"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.sample_info')"
            code="test_sample_info"
            :hide-details="false"
            bg-color="white"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            v-model="form.retest"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.retest')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.orientation"
            :rules="rules.stringOne"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.orientation')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.standard"
            :rules="rules.stringMax4"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.standard')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="form.inspector_id"
            :items="inspectorOptions"
            item-title="desc"
            item-value="id"
            chips
            density="default"
            :hide-details="false"
            :label="$t('test_sample.table.inspector')"
            placeholder="Please select"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.spec_details"
            density="default"
            variant="underlined"
            :label="$t('test_sample.new.spec_details')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.spec_name"
            density="default"
            variant="underlined"
            :label="$t('test_sample.new.spec_short_name')"
            bg-color="white"
            placeholder="Select the Spec to view the value."
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.spec_full_name"
            density="default"
            variant="underlined"
            :label="$t('test_sample.new.spec_full_name')"
            bg-color="white"
            placeholder="Select the Spec to view the value."
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.comment"
            density="default"
            variant="underlined"
            :label="$t('test_sample.table.comment')"
            bg-color="white"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <AreaCode
            label="Area"
            v-model="form.area_id"
            :hide-details="false"
            :spec="form.area"
            @change="handleItemChange($event, 'area_id')"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.cut_code"
            density="default"
            variant="underlined"
            :label="$t('test_sample.new.cut_code')"
            bg-color="white"
            placeholder="Select the Finished Product to view the value."
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>
<script setup>
import {
  getCurrentInstance,
  inject,
  nextTick,
  reactive,
  readonly,
  ref,
  toRaw,
  toRefs,
  computed
} from "vue";
import { useStore } from "vuex";
import { toLower} from "lodash";
import FormDialog from "@/components/FormDialog.vue";
import API from "../api";
import SpecCode from "@/components/picker/SpecCode.vue";
import RunoutCode from "@/components/picker/RunoutCode.vue";
import CastCode from "@/components/picker/CastCode.vue";
import { useI18n } from "vue-i18n";
import useCommonStore from "@/app/common";
import MillCode from "@/components/picker/MillCode.vue";
import AreaCode from "@/components/picker/AreaCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import FinishedProductCode from "@/components/picker/FinishedProductCode.vue";
import specApi from "@/spec_admin/spec/api";

const store = useStore();
const { t } = useI18n()
const defaultMillCode = computed(() => toLower(store.state.auth.defaultMillCode));

const commonStore = useCommonStore();
const visible = ref(false);
const loading = ref(false);
const data = reactive({
  CurrentStatus:undefined,
  form: {
    id: undefined,
    ref_code: undefined,
    finished_product_id:undefined,
    finished_product: undefined,
    runout_id: undefined,
    runout: undefined,
    test_sample_code: undefined,
    test_sample_part: undefined,
    product_name: undefined,
    cast_id: undefined,
    cast: undefined,
    concast_code: undefined,
    sample_thickness: undefined,
    sample_info: undefined,
    retest: undefined,
    orientation: undefined,
    standard: undefined,
    inspector_id: undefined,
    inspector: undefined,
    spec_details: undefined,
    spec_id: undefined,
    spec: undefined,
    spec_name: undefined,
    spec_full_name: undefined,
    mill_id: undefined,
    mill: undefined,
    area_id: undefined,
    area: undefined,
    comment: undefined,
    status: undefined,
    cut_code: undefined,
    source: undefined,
    reason_code: undefined,
    size_mm: undefined,
    updated_at: undefined,
    created_at: undefined,
    created_by: undefined,
    updated_by: undefined,
  },
  rules: {
    mill_id: [
      (value) => {
        if (value) return true;
        return "Mill is required.";
      },
    ],
    runout_id: [
      (value) => {
        if (value) return true;
        return "Runout is required.";
      },
    ],
    finished_product_id: [
      (value) => {
        if (value) return true;
        return "Finished Product is required.";
      },
    ],
    spec_id: [
      (value) => {
        if (value) return true;
        return "Spec is required.";
      },
    ],
    size: [
      (value) => {
        if (value) return true;
        return "Size is required.";
      },
    ],
    reason_code: [
      (value) => {
        if (value) return true;
        return "Reason code is required.";
      },
    ],
    ref_code: [
      (value) => {
        if (value) return true;
        return "REF code is required.";
      },
    ],
    stringOne: [
      (value) => {
        if (value && value.length > 1) {
          return "Max 1 character.";
        }
        return true;
      },
    ],
    stringMax3: [
      (value) => {
        if (value && value.length > 3) {
          return "Max 3 character.";
        }
        return true;
      },
    ],
    stringMax4: [
      (value) => {
        if (value && value.length > 4) {
          return "Max 4 character.";
        }
        return true;
      },
    ],
    stringMax5: [
      (value) => {
        if (value && value.length > 5) {
          return "Max 5 character.";
        }
        return true;
      },
    ],
    stringMax6: [
      (value) => {
        if (value && value.length > 6) {
          return "Max 6 character.";
        }
        return true;
      },
    ],
  },
  inspectorOptions:[],
});

const { CurrentStatus,form, rules,inspectorOptions } = toRefs(data);
const { proxy } = getCurrentInstance();
const emit = defineEmits(["refresh"]);
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
import { toast } from "vue3-toastify";
import { de, it } from "date-fns/locale";
import { isNull } from "xe-utils";
import { fromUnixTime } from "date-fns";

const handleShow = (data) => {
  visible.value = true;  
  if (data) {    
    CurrentStatus.value=data.status
    form.value = {
      id: data.id,
      ref_code: data.ref_code,
      mill_id: data.mill?.id,
      mill: data.mill,
      runout_id: data.runout_id,
      runout: data.runout,
      finished_product_id: data.finished_product_id,
      finished_product:data.finished_product,
      test_sample_code: data.test_sample_code,
      test_sample_part: data.test_sample_part,
      product_name: data.product_name,
      cast_id: data.cast_id,
      cast: data.cast,
      concast_code: data.concast_code,
      sample_thickness: data.sample_thickness,
      sample_info: data.sample_info,
      retest: data.retest,
      orientation: data.orientation,
      standard: data.standard,
      inspector_id: data.inspector?.id,
      inspector: data.inspector,
      spec_details: data.spec_details,
      spec_id: data.spec_id,
      spec: data.spec,
      spec_name: data.spec?.short_name,
      spec_full_name: data.spec?.full_name,
      area_id: data.area?.id,
      area: data.area,
      comment: data.comment,
      status: data.status,
      cut_code: data.cut_code,
      source: data.source,
      reason_code: data.reason_code,
      size_mm: data.size_mm,
      updated_at: data.updated_at,
      created_at: data.created_at,
      created_by: data.created_by,
      updated_by: data.updated_by,
    };
  } else {
    CurrentStatus.value='A';
    form.value = {
      id: undefined,
      ref_code: undefined,
      mill_id: undefined,
      mill: undefined,
      runout_id: undefined,
      runout: undefined,
      finished_product_id:undefined,
      finished_product:undefined,
      test_sample_code: undefined,
      test_sample_part: undefined,
      product_name: undefined,
      cast_id: undefined,
      cast: undefined,
      concast_code: undefined,
      sample_thickness: undefined,
      sample_info: undefined,
      retest: undefined,
      orientation: undefined,
      standard: undefined,
      inspector_id: undefined,
      inspector: undefined,
      spec_details: undefined,
      spec_id: undefined,
      spec: undefined,
      spec_name: undefined,
      spec_full_name: undefined,
      area_id: undefined,
      area: undefined,
      comment: undefined,
      status: 'A',
      cut_code: undefined,
      source: 'manual',
      reason_code: undefined,
      size_mm: undefined,
      updated_at: undefined,
      created_at: undefined,
      created_by: undefined,
      updated_by: undefined,
    };
  }
  console.log("visible.value", visible.value);
};

const handleClose = () => {
  visible.value = false;
  CurrentStatus.value=undefined;
  form.value = {
    id: undefined,
    ref_code: undefined,
    finished_product_id:undefined,
    finished_product:undefined,
    runout_id: undefined,
    runout: undefined,
    test_sample_code: undefined,
    test_sample_part: undefined,
    product_name: undefined,
    cast_id: undefined,
    cast: undefined,
    concast_code: undefined,
    sample_thickness: undefined,
    sample_info: undefined,
    retest: undefined,
    orientation: undefined,
    standard: undefined,
    inspector: undefined,
    inspector_longname: undefined,
    spec_details: undefined,
    spec_id: undefined,
    spec: undefined,
    spec_name: undefined,
    spec_full_name: undefined,
    area_id: undefined,
    area: undefined,
    comment: undefined,
    reason_code: undefined,
    size_mm: undefined,
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

  if (CurrentStatus.value !== "A") {
    toast.error("Initial status must be A to save", { autoClose: 60000 });
    loading.value = false;
    return;
  }
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 500,
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || (params.id ?  "Update Fail" : "Create Fail"), { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};

const handleForceSave = async () => {
  const { valid } = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  const params = toRaw(form.value);
  if (params.status !== "A") {
    toast.error("Status must be A to save", { autoClose: 60000 });
    loading.value = false;
    return;
  }
  try {
    await API.add(params);
    handleClose();
    emit("refresh");
    toast.success(params.id ? "Update Success" : "Create Success", {
      position: "bottom-center",
      delay: 500,
    });
  } catch (res) {
    toast.error(res?.response?.data?.detail || (params.id ? "Update Fail" : "Create Fail"), { autoClose: 60000 });
  } finally {
    loading.value = false;
  }
};
const getinspectorSelect = () => {
  return specApi.getInspectorSelect()
      .then((res) => {
        const {status, data} = res
        if (status === 200) {
          inspectorOptions.value = (data.options || []).map(item => ({
            ...item,
            desc: `${item.code}-${item.name}`
          }))
        } else {
          inspectorOptions.value = [];
        }
      })
};

const handleItemChange = (item, key) => {
  form.value[`${key}`] = item.id;
}


const handleSpecChange = (item) => {
  form.value.spec= item
  form.value.spec_id = item?.id;
  form.value.spec_name = item?.short_name;
  form.value.spec_full_name = item?.full_name;
}
const handleRunoutChange = (item) => {
  form.value.runout= item
  form.value.runout_id = item?.id;
  form.value.cast_id = item.cast?.id;
  form.value.cast= item?.cast;
  form.value.finished_product = null;
  form.value.finished_product_id = null;

  form.value.concast_code=item.concast_code;
  form.value.product_name= item.product_code ;
  form.value.test_sample_code = item.code;
}

const handleFinishedProductChange = (item) => {
  form.value.finished_product = item;
  form.value.finished_product_id = item.id;
  form.value.runout_id = item.runout.id;
  form.value.runout = item.runout;
  form.value.cast_id = item.cast?.id;
  form.value.cast= item.cast;
  form.value.area_id = item.area?.id;
  form.value.area= item.area;

  form.value.concast_code=item.runout?.concast_code;
  form.value.sample_thickness=item.thickness_mm;
  form.value.cut_code=item.cut_code;
  form.size_mm=item.cut_sample_length_mm;
  form.value.product_name= item.product_type?.code ;
  form.value.test_sample_code = item.runout?.runout_code;
}

defineExpose({
  handleShow,
});
getinspectorSelect();
</script>
<style scoped>
</style>
