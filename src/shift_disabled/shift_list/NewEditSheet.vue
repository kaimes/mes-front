<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
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
              label="code"
              hint="A name for your location."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col md="6" cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-text-field
              v-model="selected.name"
              label="Name"
              hint="A name for your Shift."
              required
              name="name"
              :clearable="!isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="6" cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-text-field
              v-model="selected.shift_day"
              label="Shift Day"
              hint=" Day for Shift."
              required
              name="ShiftDay"
              :clearable="!isEditFlag"
          />
          <!-- </ValidationProvider> -->

        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.shift_no"
              type="string"
              label="Shift Number"
              hint="Number for Shift"
              clearable
              required
              name="longitude"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.shift_start"
              type="string"
              label="Shift Start"
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
              label="Shift End"
              hint="Time End Shift"
              clearable
              required
              name="end"
          />
          <!-- </ValidationProvider> -->
        </v-col>
        <!-- <v-col xs12>
          <v-text-field
            v-model="selected.flex_form_data"
            label="flex_form_data"
            hint="flex_form_data"
            clearable
            required
          />
        </v-col> -->

        <v-col md="12" cols="12">
          <!-- <ValidationProvider
            name="geo_address_text"
            rules="required"
            immediate
          > -->
          <v-textarea
              v-model="selected.desc"
              label="Description"
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
