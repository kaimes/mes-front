<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="Product Code"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row align="center" wrap>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              label="Code "
              hint="A name for your location."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col md="12" cols="12">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-combobox v-model="selected.mill_code" :items="millCodes" label="Mill Code"
                      hint="A Mill Code for your Product Code" clearable name="mill_code" :search-input.sync="search" @update:search-input="filterItems" :rules="[rules.required]" />
        </v-col>

        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.type"
              label="Type"
              hint="A type for your Product Code."
              required
              name="type"
              :clearable="!isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>


        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.desc"
              label="Desc"
              hint="A desc for your Product Code."
              clearable
              required
              name="desc"
              :rules="[rules.required]"
          />
          <!-- </ValidationProvider> -->
        </v-col>




      </v-row>
    </v-form>

  </FormDialog>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";
import ProductClassApi from "@/product_class/api"



import { useProductClassStore } from "./store";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";

export default {
  components: {FormDialog},
  setup() {
    return {
      rules: { required },
      siteCodes: [], 
    };
  },
  name: "LocationNewEditSheet",

  data() {
    return {
      millCodes: []
    };
  },
  computed: {
    // ...mapState('auth', ['userInfo']),
    ...mapWritableState(useProductClassStore, ["userInfo"]),

    // ...mapFields("location", [
    //   "isEditFlag",
    //   "dialogs.showCreateEdit",
    //   "selected.loading",
    //   "selected.code",
    //   "selected.location_group_code",
    //   "selected.geo_longitude",
    //   "selected.geo_latitude",
    //   "selected.geo_address_text",
    //   "selected.geo_json",
    //   "selected.team",
    // ]),

    ...mapState(useProductClassStore, ["isEditFlag", "dialogs", "selected"]),
  },
  mounted() {
    this.$watch(
      (vm) => [vm.showCreateEdit],
      () => {
        this.$refs.vform.validate(); // 手动触发表单校验
      }
    );
      this.getMillCodes();


    
  },
  methods: {
    // ...mapActions("location", ["save", "closeCreateEdit"]),
    ...mapActions(useProductClassStore, ["save", "closeCreateEdit"]),

    getMillCodes(){
      ProductClassApi.commonRequestGet("/mill/item/codes")
      .then(response => {
        this.millCodes = response.data
      })
    }
  },
};
</script>
