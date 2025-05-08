<template>
  <FormDialog
      v-model="visible"
      :width="460"
      :title="form.id ? 'Update' : 'Add'"
      desc="Editor Notes"
      :loading="loading"
      @close="handleClose"
      @save="handleSave"
  >
    <v-form ref="editForm">
      <v-row align="center">
        <v-col cols="qw">
          <v-combobox
              v-model="data.remarkCode"
              :rules="rules.code"
              :items="codes"
              :search-input.sync="search" 
              @update:search-input="filterItems"
              persistent-placeholder
              variant="underlined"
              label="Remark Code"
              clearable
              disabled
          ></v-combobox>
        </v-col>
        <v-col cols="6">
          <v-text-field
              v-model="form.remark_type"
              variant="underlined"
              label="Remark Type"
              bg-color="white"
              disabled
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="qw">
          <v-textarea v-model="form.text" density="default" variant="underlined"
                        placeholder="Editors Notes" bg-color="white" clearable label="Text"></v-textarea>
        </v-col>
      </v-row>


 
    </v-form>
  </FormDialog>
</template>
<script setup>
import {getCurrentInstance, inject, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import FormDialog from "@/components/FormDialog.vue";
import useCommonStore from "@/app/common";
import {greaterThan, isThanZero} from "@/util/util";
import API from "../api";
import {useRoute, useRouter} from "vue-router";
const route = useRoute()
// const remarkCode = ref(""); // 当前选中的 remarkCode
const commonStore = useCommonStore();
const visible = ref(false);
const tab = ref("one");
const loading = ref(false);
const data = reactive({
  form: {
    "id": undefined,
    "mill_id": undefined,
    "mill": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "code": undefined,
    "type": undefined,
    "group": undefined,
    "name": undefined,
    "desc": undefined,
    "remark_type": 'e'
  },
  remarkCode: "",
  rules: {
    thick_from: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness From is required.'
      },
      value => {
        if (form.value.thick_to && greaterThan(value, form.value.thick_to)) {
          return 'thickness from must be smaller than thickness to'
        }
        return true
      },
      value => {
        if (value && form.value.thick_to && value === form.value.thick_to) {
          return 'thickness from cannot be equal thickness to'
        }
        return true
      },
    ],
    thick_to: [
      value => {
        if (isThanZero(value)) return true
        return 'Thickness To is required.'
      },
      value => {
        if (form.value.thick_from && greaterThan(form.value.thick_from, value)) {
          return 'thickness to must be greater than thickness from'
        }
        return true
      },
      value => {
        if (value && form.value.thick_from && value === form.value.thick_from) {
          return 'thickness to cannot be equal thickness from'
        }
        return true
      },
    ],
  }
});

const { form, rules } = toRefs(data);
const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const handleShow = (data) => {
  if (data) {
    const value = toRaw(data);
    form.value = { ...value };
  } else {
    form.value.spec = commonStore.spec;
    form.value.spec_id = commonStore.spec.id;
  }
  visible.value = true;
}

const handleSpecCodeChange = (data) => {
  form.value.summary_name = data.summary_name;
}

const handleClose = () => {
  visible.value = false;
  form.value = {
    "id": undefined,
    "mill_id": undefined,
    "mill": undefined,
    "spec_id": commonStore.spec.id,
    "spec": commonStore.spec,
    "code": undefined,
    "type": undefined,
    "group": undefined,
    "name": undefined,
    "desc": undefined,
    "text": undefined,
    "remark_type": 'e'
  };
  nextTick(() => {
    proxy.$refs["editForm"].resetValidation();
  })
}


const handleBlur = (field) => {
  let value = form.value[field];

  if (value === null || value === '' || isNaN(value)) {
    form.value[field] = undefined;
  } else {
    form.value[field] = parseFloat(value).toFixed(2);
  }
}

const getIdByCode = (code) => {
  const remark = remarkCodes.find(item => item.code === code);
  return remark ? remark.id : null; // 如果没有找到对应的 code，返回 null
};

const codes = ref([])
const remarkCodes = []
const getAllCode = () => {
  API.commonGetRequest("/remark/get_all/").then(reponse => {
    // console.log(reponse.data.items[0].code);
    if (!reponse.data.items){
        return;
    }
    for (let i = 0; i < reponse.data.items.length; i++){
      remarkCodes.push({"id": reponse.data.items[i].id ,"code":reponse.data.items[i].code});
      
    }
    codes.value = remarkCodes.map(item => item.code)  
  })
}


const handleSave = async () => {
  const {valid} = await proxy.$refs["editForm"].validate();
  if (!valid) {
    return;
  }
  loading.value = true;
  console.log(form.value.id)

  if (form.value.id) {
    let payload = {
      "text": form.value.text
    }
    API.commonUpdateRequest(`/remark/spec_remark/update_editor_notes/${form.value.id}`, payload).then(reponse => {
      handleClose();
      emit("refresh");
      toast.success("Update Success", {
        position: "bottom-center"
      });
    }).catch(err => {
      toast.error("Update Fail!", { autoClose: 60000 });
    }).finally(() => {
      loading.value = false
    })
  } else {
    const requestData = {
    "spec_id": route.query.id,
    "text": form.value.text
  }

  API.commonAddRequest("/remark/spec_remark/create_editor_notes",requestData).then(reponse => {
  handleClose();
  emit("refresh");
  toast.success("Create Success", {
    position: "bottom-center"
  });
  
  }).catch(err => {
    toast.error("Create Fail!", { autoClose: 60000 });
  }).finally(() => {
    loading.value = false
  })
  }
    

}

const getAllEditorNotes = () =>{
  API.commonGetRequest(`/remark/spec_remark/get_editor_notes/${route.query.id}`).then(reponse => {
    tableList.value = reponse.data 
    console.log(reponse.data);
  })
}


defineExpose({
  handleShow,
});


getAllCode()
</script>
<style scoped>

</style>
