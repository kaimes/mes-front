<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? $t('global.edit') : $t('global.new')"
      desc="ShiftDelay"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row wrap>

        <v-col cols="12">
          <MillCode v-model="selected.mill_id" :mill='selected.mill' :hide-details="false" />
        </v-col>
        <v-col cols="12">
          <ShiftCode v-model="selected.shift_id" :shift='selected.shift' :hide-details="false" />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.delay_no"
              :label="$t('shift_delay.edit.no')"
              hint="Delay No."
              required
              clearable
          />
        </v-col>
        <v-col md="6" cols="6">
          <DictCode
              v-model="selected.area_code"
              code="shift_area_code"
              label="Area Code"
              variant="underlined"
              :hide-details="true"
              :clearable="false"
          />
        </v-col>

        <v-col md="6" cols="6">
          <DictCode
              v-model="selected.delay_code"
              code="shift_delay_code"
              label="Delay Code"
              variant="underlined"
              :hide-details="true"
              :clearable="false"
          />
        </v-col>

        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.delay_start"
              type="string"
              :label="$t('shift_delay.edit.delay_start')"
              hint="Delay Start."
              clearable
              required
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.delay_end"
              type="string"
              :label="$t('shift_delay.edit.delay_end')"
              hint="Delay End."
              clearable
              required
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.delay_duration"
              type="string"
              :label="$t('shift_delay.edit.delay_duration')"
              hint="Delay Duration."
              clearable
              required
          />
        </v-col>
      </v-row>
    </v-form>

  </FormDialog>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";

import { useAuthStore } from "@/auth/storePinia";

import { useShiftDelayStore } from "./storePinia";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";
import MillCode from "@/components/picker/MillCode.vue";
import DictCode from "@/components/picker/DictCode.vue";
import ShiftCode from "@/components/picker/ShiftCode.vue";


export default {
  components: {FormDialog, MillCode,DictCode,ShiftCode},
  setup() {
    return {
      rules: { required },
    };
  },
  name: "LocationNewEditSheet",

  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),
    ...mapState(useShiftDelayStore, ["isEditFlag", "dialogs", "selected"]),
  },
  mounted() {
    this.$watch(
      (vm) => [vm.showCreateEdit],
      () => {
        this.$refs.vform.validate(); // 手动触发表单校验
      }
    );
  },
  methods: {
    ...mapActions(useShiftDelayStore, ["save", "closeCreateEdit"]),
  },
};
</script>
