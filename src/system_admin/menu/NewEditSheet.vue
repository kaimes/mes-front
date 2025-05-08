<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="Menus"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="handleSave"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row wrap align-center>
        <v-col md="12" cols="12">
          <v-select
              v-model="selected.parent_id"
              label="Menu"
              :items="menuTopOptions"
              item-title="label"
              item-value="id"
              hint="The user's current role."
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.name"
              label="name"
              hint="A name for your item."
              required
              name="name"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.title"
              label="Title"
              hint="A title for your item."
              required
              name="title"
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
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.icon"
              label="icon"
              hint="A icon for your item."
              required
              name="icon"
          />
        </v-col>

        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.is_link"
              hint="is_link."
              label="is_link"
          /></v-col>
        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.is_catalog"
              hint="is_catalog."
              label="is_catalog"
          /></v-col>

        <v-col
            md="12"
            cols="12"
            v-if="!selected.is_catalog && !selected.is_link"
        >
          <v-text-field
              v-model="selected.component"
              label="component"
              hint="A component for your item."
              required
              name="component"
          />
        </v-col>
        <v-col
            md="6"
            cols="6"
            v-if="!selected.is_catalog && !selected.is_link"
        >
          <v-text-field
              v-model="selected.component_name"
              label="component_name"
              hint="A component_name for your item."
              required
              name="component_name"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col
            md="6"
            cols="6"
            v-if="!selected.is_catalog && !selected.is_link"
        >
          <v-text-field
              v-model="selected.web_path"
              label="web_path"
              hint="A web_path for your item."
              required
              name="web_path"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col
            md="12"
            cols="12"
            v-if="!selected.is_catalog && selected.is_link"
        >
          <v-text-field
              v-model="selected.web_path"
              label="link"
              hint="A link url for your item."
              required
              name="link"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.status"
              hint="status."
              label="status"
          /></v-col>
        <v-col cols="6" sm="6">
          <v-switch
              v-model="selected.visible"
              hint="visible."
              label="visible"
          /></v-col>
        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.desc"
              label="desc"
              hint="desc."
              clearable
              required
              name="desc"
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

import { useMenuStore } from "./storePinia";

import { required } from "@/util/form";

import Treeselect from "vue3-treeselect";
import "vue3-treeselect/dist/vue3-treeselect.css";
import FormDialog from "@/components/FormDialog.vue";

export default {
  setup() {
    return {
      rules: { required },
    };
  },
  components: { FormDialog, Treeselect },
  name: "MenuNewEditSheet",

  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),
    ...mapState(useMenuStore, [
      "isEditFlag",
      "dialogs",
      "selected",
      "menuTopOptions",
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
    ...mapActions(useMenuStore, ["save", "closeCreateEdit"]),
    handleSave() {
      this.$refs.vform.validate().then((isValid) => {
        if (isValid) {
          this.save();
        }
      });
    },
  },
};
</script>