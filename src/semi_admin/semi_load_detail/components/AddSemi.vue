<template>
  <v-dialog
      v-model="visible"
      max-width="600"
      :close-on-back="false"
      persistent
  >
    <v-card
        :title="$t('semi_load_detail.add_button.add_semi')"
        prepend-icon="mdi-alert-circle-outline"
        class="re-work-card"
        style="overflow: visible"
    >
      <v-divider></v-divider>
      <div class="pa-4 border ma-4">
        <!-- <SemiCode
            v-model="semi_id"
            label="Semi Code"
            :hide-details="false"
            persistent-placeholder
            multiple
            chips
            @change="handlePickSemiCode"
        /> -->
        <CastCode
            v-model="cast_id"
            :label="$t('semi_load_detail.add_button.cast_code')"
            :hide-details="false"
            persistent-placeholder
            multiple
            chips
            @change="handlePickSemiCode"
        />
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
            :disabled="selections.length === 0"
            @click="handleAddSemi"
        >
          {{$t('global.confirm')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs, watch} from "vue";
import SemiCode from "@/components/picker/multiple/SemiCode.vue";
import CastCode from "@/components/picker/multiple/CastCode.vue";
import {filter, map} from "lodash";
import { toast } from "vue3-toastify";

const {proxy} = getCurrentInstance();
const emit = defineEmits(['change']);
const visible = ref(false);
const loading = ref(false);
const selections = ref([]);

const data = reactive({
  form: {
    id: null,
  },
  cast_id: [],
  cast_code: null,
});

const {
  form,
  cast_id,
  cast_code,
} = toRefs(data);


const handleShow = (data) => {
  form.value.id = data.semi_load_id;
  nextTick(() => {
    visible.value = true;
  })
}

const handleClose = () => {
  visible.value = false;
  nextTick(() => {
    cast_id.value = undefined;
    selections.value = [];
  })
}

const handleClear = (index) => {
  selections.value.splice(index, 1)
}

const handleAddSemi = async () => {
  emit('change', toRaw(selections.value));
  handleClose();
}

const handlePickSemiCode = (item) => {
  console.log("item", item);
  const emptyItems = filter(item, item => item.cast_semis.length === 0).map(item => item.cast_code);
  if (emptyItems.length > 0) {
    toast.warning(`The following casts do not have semi ${emptyItems}`, { autoClose: 60000 });
  }
  selections.value = item;
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped>
.re-work-card {
  overflow-y: visible !important;
}
</style>
