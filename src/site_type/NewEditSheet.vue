<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? $t('global.edit') : $t('global.new')"
      desc="Site Type"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="handleSave"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="siteEditForm">
      <v-row wrap align="center" justify="center">
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              :label="$t('site_type.edit.code')"
              hint="A name for your location."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="rules.code"
          />
        </v-col>

        <v-col md="12" cols="12">

          <MillCode v-model="selected.mill_id" :mill="selected.mill" :rules="rules.millCode" :hide-details="false" />
        </v-col>

        <v-col md="6" cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-text-field
              v-model="selected.name"
              :label="$t('site_type.edit.name')"
              hint="A name for your SiteType."
              required
              name="name"
              :clearable="!isEditFlag"
              :rules="rules.name"
          />
        </v-col>

        <v-col md="6" cols="6">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-select
              v-model="selected.business_type"
              :items="business_type_list"
              label="Business Type"
              hint="A Business Type for your Site Type"
              clearable
              name="business_type"
              :rules="[rules.required]"
          />
        </v-col>

        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.longitude"
              type="number"
              :label="$t('site_type.edit.longitude')"
              hint="x, or longitude."
              clearable
              required
          />
          <!-- </ValidationProvider> -->
        </v-col>
        <v-col md="6" cols="6">
          <!-- <ValidationProvider
            name="geo_latitude"
            rules="required"
            immediate
          > -->
          <v-text-field
              v-model="selected.latitude"
              type="number"
              :label="$t('site_type.edit.latitude')"
              hint="y, or geo_latitude."
              clearable
              required
              name="latitude"
          />
          <!-- </ValidationProvider> -->
        </v-col>


        <v-col md="12" cols="12">
          <!-- <ValidationProvider
            name="geo_address_text"
            rules="required"
            immediate
          > -->
          <v-textarea
              v-model="selected.desc"
              :label="$t('site_type.edit.desc')"
              hint="A description for your site."
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
import SiteTypeApi from "./api"
import { useAuthStore } from "../auth/storePinia";

import { useSiteTypeStore } from "./storePinia";

import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";
import MillCode from "@/components/picker/MillCode.vue";


export default {
  components: {FormDialog, MillCode},
  // setup() {
  //   return {
  //     rules: { required },
  //   };
  // },
  name: "LocationNewEditSheet",

  data() {
    return {
      rules: {
        code: [
          value => {
            if (value) return true
            return 'Code is required.'
          }
        ],
        millCode: [
          value => {
            if (value) return true
            return 'Mill Code is required.'
          }
        ],
        name: [
          value => {
            if (value) return true
            return 'Name is required.'
          }
        ],
      },
      millCodes: [],
      business_type_list: ["f-finished product", "s-semi"]
    };
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),

    ...mapState(useSiteTypeStore, ["isEditFlag", "dialogs", "selected"]),
  },
  mounted() {
    this.getMillCodes()
  },
  methods: {
    // ...mapActions("location", ["save", "closeCreateEdit"]),
    ...mapActions(useSiteTypeStore, ["save", "closeCreateEdit"]),
    async handleSave() {
      const {valid} = await this.$refs["siteEditForm"].validate();
      if (!valid) {
        return;
      }
      this.save();
    },

    getMillCodes(){
      SiteTypeApi.commonRequestGet("/mill/item/codes")
      .then(response => {
        this.millCodes = response.data
      })
    }

  },

};
</script>
