<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? $t('global.edit') : $t('global.new')"
      desc="Defect Reason"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="handleSave"
  >
    <v-form ref="editForm" @submit.prevent>
      <v-row wrap>
        <v-col cols="6">
          <MillCode
              v-model="selected.mill_id"
              :mill="selected.mill"
              :rules="rules.mill_id"
              :hide-details="false"
          />
          <!-- <MillCode v-model="selected.mill_id" :mill="selected.mill" :rules="rules.mill_id" :hide-details="false" /> -->
        </v-col>
        <v-col cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-text-field
              v-model="selected.code"
              :label="$t('defect_reason.edit.code')"
              hint="defect code."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="rules.code"
          />
        </v-col>
        <v-col cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-text-field
              v-model="selected.name"
              :label="$t('defect_reason.edit.name')"
              hint="defect name."
              required
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="rules.name"
          />
        </v-col>
        <v-col cols="6">
          <v-select
              v-model="selected.type"
              :label="$t('defect_reason.edit.type')"
              :items="types"
              item-title="name"
              item-value="id"
              hint="select the type. "
              required
          />
        </v-col>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.required_roles"
              type="string"
              :label="$t('defect_reason.edit.required_roles')"
              hint="required roles"
              clearable
              name="required roles"
          />
        </v-col>

        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.desc"
              :label="$t('defect_reason.edit.desc')"
              hint="A description for your DefectReason."
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
import {mapState, mapWritableState} from "pinia";
import {mapActions} from "pinia";

import {useAuthStore} from "@/auth/storePinia";

import {useDefectReasonStore} from "./storePinia";
import {required} from "@/util/form";
import MillCode from "@/components/picker/MillCode.vue";
import FormDialog from "@/components/FormDialog.vue";

export default {
  components: {MillCode, FormDialog},
  name: "LocationNewEditSheet",
  data() {
    return {
      types: [
        {type: "finished", name: 'finished'},
        {type: "semi", name: "semi"}
      ],
      rules: {
        mill_id: [
          (value) => {
            if (value) return true;
            return "Mill is required.";
          },
        ],
        code: [
          value => {
            if (value) return true
            return 'Code is required.'
          }
        ],
        name: [
          value => {
            if (value) return true
            return 'Name is required.'
          }
        ],
      }
    };

  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),
    ...mapState(useDefectReasonStore, ["isEditFlag", "dialogs", "selected"]),
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
    ...mapActions(useDefectReasonStore, ["save", "closeCreateEdit"]),
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
