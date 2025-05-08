<template>
  <FormDialog
    v-model="dialogs.showCreateEdit"
    :width="500"
    :title="isEditFlag ? 'Edit' : 'New'"
    desc="Menu Button"
    :loading="selected.loading"
    @close="closeCreateEdit"
    @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row wrap align-center>
        <v-col md="12" cols="12">
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
            v-model="selected.value"
            label="value"
            hint="value."
            clearable
            required
            name="value"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
            v-model="selected.api"
            label="api"
            hint="A api for your item."
            required
            name="api"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-select
            v-model="selected.method"
            :items="items_method"
            item-title="title"
            item-value="value"
            density="default"
            label="Method"
          ></v-select>
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
            v-model="selected.remark"
            label="remark"
            hint="A remark for your item."
            required
            name="remark"
          />
        </v-col>
      </v-row>
    </v-form>
  </FormDialog>
</template>

<script>
import { mapState, mapWritableState, mapActions } from "pinia";

import { useAuthStore } from "../../auth/storePinia";

import { useMenuButtonStore } from "./storePinia";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";

export default {
  components: { FormDialog },
  setup() {
    return {
      rules: { required },
    };
  },
  name: "RoleNewEditSheet",

  data() {
    return {
      items_method: [
        { title: "GET", value: 0 },
        { title: "POST", value: 1 },
        { title: "PUT", value: 2 },
        { title: "DELETE", value: 3 },
      ],
    };
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),

    ...mapState(useMenuButtonStore, ["isEditFlag", "dialogs", "selected"]),
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
    ...mapActions(useMenuButtonStore, ["save", "closeCreateEdit"]),
  },
};
</script>
