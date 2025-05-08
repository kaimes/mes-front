<template>
  <FormDialog
      v-model="dialogs.PermissionShow"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      :desc="`Current role: ${selected.name}`"
      :loading="selected.loading"
      @close="closePermission"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <vue-tree
          :tree="menuOptions"
          ref="tree"
          class="tree"
          :defaultAttrs="{ checkbox: { show: true } }"
          @check="refresh"
          @uncheck="refresh"
      />
    </v-form>
  </FormDialog>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";

import { useAuthStore } from "../../auth/storePinia";

import { useRoleStore } from "./storePinia";

import { required } from "@/util/form";
import VueTree from "@tinywisp/vue-tree";
import FormDialog from "@/components/FormDialog.vue";

export default {
  setup() {
    return {
      rules: { required },
    };
  },
  name: "PermissionSheet",
  components: {
    FormDialog,
    VueTree,
  },
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),

    ...mapState(useRoleStore, [
      "isEditFlag",
      "dialogs",
      "selected",
      "menuOptions",
      "menuPermissions",
    ]),
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
    ...mapActions(useRoleStore, ["save", "closePermission"]),
    refresh() {
      let tree = this.$refs.tree;
      this.menuPermissions.checked = tree.getChecked();
      this.menuPermissions.unchecked = tree.getUnchecked();
      this.menuPermissions.undetermined = tree.getUndetermined();
    },
  },
};
</script>
