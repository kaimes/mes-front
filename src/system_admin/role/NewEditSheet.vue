<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="Role"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row wrap align="center" justify="center">
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.name"
              label="name"
              hint="A name for your item."
              required
              name="name"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>

        <!-- <v-col cols="12" sm="12">
          <v-select
              v-model="selected.mill"
              label="Mill"
              :items="millOptions"
              hint="The role's current mill."
              item-title="code"
              item-value="id"
              multiple
              chips
          />
        </v-col> -->

        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.key"
              label="key"
              hint="A key for your item."
              required
              name="key"
              :clearable="!isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.sort"
              type="number"
              label="sort"
              hint="sort 1."
              clearable
              required
              name="sort"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md='12' cols="12">
                <MenuCode 
                v-if="selected.id"
                v-model="selected.homepage_id" 
                density="default" 
                label="Homepage"
                :hide-details="false" 
                :roleID="selected.id"
                />
        </v-col>
        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.status"
              hint="status."
              label="status"
              :rules="[rules.required]"
          /></v-col>
        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.admin"
              hint="admin."
              label="admin"
              :rules="[rules.required]"
          /></v-col>

        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.remark"
              label="remark"
              hint="remark."
              clearable
              required
              name="remark"
              :rules="[rules.required]"
          />
        </v-col>

      </v-row>
    </v-form>
  </FormDialog>

</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";

import { useAuthStore } from "../../auth/storePinia";

import { useRoleStore } from "./storePinia";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";
import MenuCode from "@/components/picker/MenuCode.vue";

export default {
  components: {FormDialog,MenuCode},
  setup() {
    return {
      rules: { required },
    };
  },
  name: "RoleNewEditSheet",

  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),

    ...mapState(useRoleStore, ["isEditFlag", "dialogs", "selected", "millOptions"]),
    
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
    ...mapActions(useRoleStore, ["save", "closeCreateEdit"]),
  },
};
</script>
