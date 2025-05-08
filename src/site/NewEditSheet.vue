<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? $t('global.edit') : $t('global.new')"
      desc="Site"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="save"
  >
    <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
      <v-row wrap align="center">
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              :label="$t('site.edit.code')"
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
          <v-combobox v-model="selected.site_type_code" :items="siteTypeCodes" label="Site Type Code"
                      hint="A Site Type Cdoe for your Site" clearable name="site_type_code" :search-input.sync="search" @update:search-input="filterItems" :rules="[rules.required]" />
        </v-col>

        <v-col md="12" cols="12">
          <DictCode
              v-model="selected.type"
              code="area_type"
              label="Type"
              variant="underlined"
              :hide-details="false"
              :rules="rules.type"
              :clearable="false"
          />
        </v-col>

        <v-col md="12" cols="12">
          <MillCode v-model="selected.mill_id" :mill="selected.mill" :rules="rules.mill_id" :hide-details="false" />
        </v-col>

        <v-col md="12" cols="12">
          <!-- <ValidationProvider name="code" rules="required" immediate> -->
          <v-text-field
              v-model="selected.name"
              :label="$t('site.edit.name')"
              hint="A name for your Site."
              required
              name="name"
              :clearable="!isEditFlag"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.longitude"
              type="number"
              :label="$t('site.edit.longitude')"
              hint="x, or longitude."
              clearable
              required
              name="longitude"
              :rules="[rules.required]"
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
              :label="$t('site.edit.latitude')"
              hint="y, or geo_latitude."
              clearable
              required
              name="latitude"
              :rules="[rules.required]"
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
              label="Description"
              hint="A description for your site."
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
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";
import SiteApi from "./api"
import { useAuthStore } from "../auth/storePinia";

import { useSiteStore } from "./storePinia";
import DictCode from "@/components/picker/DictCode.vue";
import { required } from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";
import MillCode from "@/components/picker/MillCode.vue";

export default {
  components: {FormDialog, DictCode, MillCode},
  setup() {
    return {
      rules: { required },
    };
  },
  name: "LocationNewEditSheet",

  data() {
    return {
      siteTypeCodes: []
    };
  },
  computed: {
    // ...mapState('auth', ['userInfo']),
    ...mapWritableState(useAuthStore, ["userInfo"]),

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

    ...mapState(useSiteStore, ["isEditFlag", "dialogs", "selected"]),
  },
  mounted() {
    this.$watch(
      (vm) => [vm.showCreateEdit],
      () => {
        this.$refs.vform.validate(); // 手动触发表单校验
      }
    );

    this.getSiteTypeCodes()
  },
  methods: {
    // ...mapActions("location", ["save", "closeCreateEdit"]),
    ...mapActions(useSiteStore, ["save", "closeCreateEdit"]),

    getSiteTypeCodes(){
      SiteApi.commonRequestGet("/site_type/item/codes")
      .then(response => {
        this.siteTypeCodes = response.data
      })
    },

    
  },
};
</script>
