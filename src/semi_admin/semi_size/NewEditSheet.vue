<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="SemiSize"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row align="center" wrap>
        <v-col md="12" cols="12">
          <MillCode
              v-model="selected.mill_id"
              :rules="[rules.required]"
              :hide-details="false"
              :placeholder="'Please select mill code'"
              @change="handlePickMillCode"
          />
        </v-col>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              label="Code"
              hint="The code for the semi size."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>


        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.width_mm"
              label="Width(mm)"
              hint="The width for the semi_size"
              name="Width(mm)"
              :clearable="!isEditFlag"
          />
        </v-col>

        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.thick_mm"
              label="Thick(mm)"
              hint="The thick for the semi size"
              name="Thick(mm)"
              :clearable="!isEditFlag"
          />
        </v-col>

        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.norm_suffix"
              label="Norm Suffix"
              hint="The Norm Suffix for the Semi Size"
              clearable
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

// import { useAuthStore } from "../../auth/storePinia";

import { useSemiSizeStore } from "./storePinia";

import { required } from "@/util/form";

import MillCode from "@/components/picker/MillCode.vue";
import FormDialog from "@/components/FormDialog.vue";

export default {
  components: {MillCode, FormDialog},
  setup() {
    return {
      rules: { required },
    };
  },
  name: "SemiSizeNewEditSheet",

  data() {
    return {
      mill_code: '',
    };
  },
  computed: {
    ...mapState(useSemiSizeStore, ["isEditFlag", "dialogs", "selected"]),
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
    ...mapActions(useSemiSizeStore, ["save", "closeCreateEdit", "handlePickMillCode"]),
  },
};
</script>
