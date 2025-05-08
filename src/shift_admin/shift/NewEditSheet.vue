<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? $t('global.edit') : $t('global.new')"
      desc="Shift"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row wrap>

        <v-col cols="12">
          <MillCode v-model="selected.mill_id" :hide-details="false" />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.code"
              :label="$t('shift.edit.code')"
              hint="(Optional)Auto generated."
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.name"
              :label="$t('shift.edit.name')"
              hint="A name for your Shift."
              required
              :clearable="!isEditFlag"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.shift_day"
              :label="$t('shift.edit.shift_day')"
              hint=" Day for Shift."
              required
              name="ShiftDay"
              :clearable="!isEditFlag"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.shift_no"
              type="string"
              :label="$t('shift.edit.shift_no')"
              hint="Shift No."
              clearable
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.shift_start"
              type="string"
              :label="$t('shift.edit.shift_start')"
              hint="Time Start Shift"
              clearable
              required
              name="start"
          />
          <!-- </ValidationProvider> -->
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.shift_end"
              type="string"
              :label="$t('shift.edit.shift_end')"
              hint="Time End Shift"
              clearable
              required
              name="end"
          />
          <!-- </ValidationProvider> -->
        </v-col>
        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.desc"
              :label="$t('shift.edit.desc')"
              hint="A description for your Shift."
              clearable
              required
              name="desc"
          />
        </v-col>
      </v-row>
    </v-form>

  </FormDialog>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";

import { useAuthStore } from "../../auth/storePinia";

import { useShiftStore } from "./storePinia";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";
import MillCode from "@/components/picker/MillCode.vue";


export default {
  components: {FormDialog, MillCode},
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
    ...mapState(useShiftStore, ["isEditFlag", "dialogs", "selected"]),
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
    ...mapActions(useShiftStore, ["save", "closeCreateEdit"]),
  },
};
</script>
