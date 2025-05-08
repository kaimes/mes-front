<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="Section Type"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row align="center" wrap>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.code"
              label="Code"
              hint="Automatically generated from Dim1 and Dim2."
              required
              name="code"
              :clearable="false"
              :disabled="true"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col md="6" cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-combobox v-model="selected.mill_code" :items="millCodes" label="Mill Code"
                      hint="A Mill Code for your Section Type" clearable name="mill_code" :search-input.sync="search" @update:search-input="filterItems" :rules="[rules.required]" />
        </v-col>


        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.type"
              label="Type"
              hint="A type for your Product Code."
              required
              name="type"
              :clearable="!isEditFlag"
          />
        </v-col>

        <v-col cols="6" md="6">
          <v-text-field
              v-model="selected.dim1"
              label="Dim1"
              hint="A Dim1 for your item."
              clearable
              required
              name="dim1"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col cols="6" md="6">
          <v-text-field
              v-model="selected.dim2"
              label="Dim2"
              hint="A Dim2 for your item."
              clearable
              required
              name="dim2"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col cols="6" md="6">
          <v-text-field
              v-model="selected.dim3"
              label="Dim3"
              hint="A Dim3 No for your item."
              clearable
              required
              name="dim3"
          />
        </v-col>

        <v-col cols="6" md="6">
          <v-text-field
              v-model="selected.dim4"
              label="Dim4"
              hint="A Dim4 for your item."
              clearable
              name="dim4"
          />
        </v-col>

        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.desc"
              label="Desc"
              hint="A desc for your Product Code."
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
import { required } from "@/util/form";
import { useProductCategoryStore } from "./store";
import SectionTypeApi from "@/product_category/api"
import FormDialog from "@/components/FormDialog.vue";

export default {
  components: {FormDialog},
  setup() {
    return {
      rules: { required },
      siteCodes: [],
      millCodes: []
    };
  },
  name: "LocationNewEditSheet",

  computed: {
    ...mapWritableState(useProductCategoryStore, ["userInfo"]),
    ...mapState(useProductCategoryStore, ["isEditFlag", "dialogs", "selected"]),
  },

  watch: {
    "selected.dim1": function () {
      this.handleDimChange();
    },
    "selected.dim2": function () {
      this.handleDimChange();
    },
  },

  mounted() {
    this.getMillCodes()
  },

  methods: {
    ...mapActions(useProductCategoryStore, ["save", "closeCreateEdit"]),

    getMillCodes(){
      SectionTypeApi.commonRequestGet("/mill/item/codes")
      .then(response => {
        this.millCodes = response.data
      })
    },

    handleDimChange() {

      if (this.selected.dim1 && this.selected.dim2) {
        const formattedDim1 = this.selected.dim1;
        const formattedDim2 = this.selected.dim2;
        const $code = `${formattedDim1}-${formattedDim2}`;

        if ($code !== this.selected.code) {
          this.selected.code = $code;
        }
      }
    },
  },
};
</script>
