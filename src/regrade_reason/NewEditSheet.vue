<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? $t('global.edit') : $t('global.new')"
      desc="Regrade Reason"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="handleSave"
  >
    <v-form @submit.prevent ref="editForm">
      <v-row wrap>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              :label="$t('regrade_reason.edit.code')"
              hint="regrade code."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="rules.code"
          />
        </v-col>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.desc"
              type="string"
              :label="$t('regrade_reason.edit.desc')"
              hint="desc"
              clearable
              required
              name="desc"
              :rules="rules.desc"
          />
        </v-col>
        <v-col md="12" cols="12">
          <v-select
              v-model="selected.type"
              :label="$t('regrade_reason.edit.type')"
              :items="types"
              item-title="type"
              item-value="type"
              required
          />
        </v-col>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.supp_recalc"
              type="string"
              :label="$t('regrade_reason.edit.supp_recalc')"
              hint="supp recalc"
              clearable
              name="supp_recalc"
          />
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";

import { useAuthStore } from "../auth/storePinia";

import { useRegradeReasonStore } from "./storePinia";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";

export default {
  components: {FormDialog},

  data() {
    return {
      types: [
        { type: "Finished Product" },
        { type: "Semi" }
      ],
      rules: {
        code: [
          value => {
            if (value) return true
            return 'Code is required.'
          }
        ],
        desc: [
          value => {
            if (value) return true
            return 'Desc is required.'
          }
        ],
      },
    };
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),
    ...mapState(useRegradeReasonStore, ["isEditFlag", "dialogs", "selected"]),
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
    ...mapActions(useRegradeReasonStore, ["save", "closeCreateEdit"]),
    async handleSave() {
      const {valid} = await this.$refs["editForm"].validate();
      if (!valid) {
        return;
      }
      this.save();
    },
  },
};
</script>
