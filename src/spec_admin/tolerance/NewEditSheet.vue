<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="Tolerance"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row align="center" wrap>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              label="Code"
              hint="The code for the tolerance."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col md="12" cols="12">
          <MillCode
              v-model="selected.mill_code"
              label=""
              placeholder="Please select mill code"
              @change="handlePickMillCode"
          ></MillCode>
        </v-col>

        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.type"
              label="Type"
              hint="The type for the tolerance"
              name="type"
              :clearable="!isEditFlag"
          />
        </v-col>

        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.name"
              label="Name"
              hint="The name for the tolerance"
              name="name"
              :clearable="!isEditFlag"
          />
        </v-col>

        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.desc"
              label="Desc"
              hint="The desc for the tolerance"
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

import { useToleranceStore } from "./storePinia";

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
  name: "ToleranceNewEditSheet",

  data() {
    return {
      mill_code: '',
    };
  },
  computed: {
    ...mapState(useToleranceStore, ["isEditFlag", "dialogs", "selected"]),
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
    ...mapActions(useToleranceStore, ["save", "closeCreateEdit", "handlePickMillCode"]),
  },
};
</script>
