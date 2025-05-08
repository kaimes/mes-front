<template>
  <FormDialog
      v-model="dialogs.showCreateEdit"
      :width="500"
      :title="isEditFlag ? 'Edit' : 'New'"
      desc="Area"
      :loading="selected.loading"
      @close="closeCreateEdit"
      @save="handleSave"
  >
    <v-form @submit.prevent ref="areaEditForm">
      <v-row wrap>
        <v-col md="12" cols="12">
          <v-text-field
              v-model="selected.code"
              label="Code"
              hint="A name for your location."
              required
              name="code"
              :clearable="!isEditFlag"
              :disabled="isEditFlag"
              :rules="rules.code"
          />
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
          <Site
              v-model="selected.site_code"
              :type="selected.type === 's-semi' ? 'semi' : 'f-finished_product'"
              label="Site Code"
              item-value="site_code"
              :rules="rules.siteCode"
          />
        </v-col>

        <v-col md="12" cols="12">
          <v-select
              v-model="selected.charge_status"
              label="Charge Status"
              hint="Area charge status."
              required
              name="charge_status"
              clearable
              :items="['Y', 'N']"
          />
        </v-col>
        <v-col md="12" cols="12">
          <MillCode v-model="selected.mill_id" :mill="selected.mill" :rules="rules.millCode" :hide-details="false" />
        </v-col>
        <v-col md="6" cols="6">
          <v-text-field
              v-model="selected.longitude"
              type="number"
              label="Longitude"
              hint="x, or longitude."
              clearable
              required
              name="longitude"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="6" cols="6">

          <v-text-field
              v-model="selected.latitude"
              type="number"
              label="Latitude"
              hint="y, or geo_latitude."
              clearable
              required
              name="latitude"
              :rules="[rules.required]"
          />
        </v-col>
        <v-col md="12" cols="12">
          <v-textarea
              v-model="selected.desc"
              label="Description"
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
import {mapState, mapWritableState} from "pinia";
import {mapActions} from "pinia";
import areaApi from "@/area/api";
import {required} from "@/util/form";
import FormDialog from "@/components/FormDialog.vue";
import DictCode from "@/components/picker/DictCode.vue";
import Site from  "@/components/picker/Site.vue"
import {useAuthStore} from "@/auth/storePinia";
import {useAreaStore} from "./storePinia";
import MillCode from "@/components/picker/MillCode.vue";

export default {
  components: {FormDialog, DictCode, Site, MillCode},
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
        type: [
          value => {
            if (value) return true
            return 'Type is required.'
          }
        ],
        siteCode: [
          value => {
            if (value) return true
            return 'Site Code is required.'
          }
        ],
        siteType: [
          value => {
            if (value) return true
            return 'Site Type is required.'
          }
        ],
        millCode: [
          value => {
            if (value) return true
            return 'Mill Code is required.'
          }
        ],
      },
    };
  },
  computed: {
    ...mapWritableState(useAuthStore, ["userInfo"]),
    ...mapState(useAreaStore, ["isEditFlag", "dialogs", "selected"]),
  },
  mounted() {
    this.getSiteCode();
  },
  methods: {
    ...mapActions(useAreaStore, ["save", "closeCreateEdit"]),
    async handleSave() {
      const {valid} = await this.$refs["areaEditForm"].validate();
      if (!valid) {
        return;
      }
      this.save();
    },
    getSiteCode() {
      areaApi.getSiteCode("/site/item/codes").then((response) => {
        if (response.data && response.data.length) {
          console.log(response.data);
          this.siteCodes = response.data;
        }
      });
    },
  },
};
</script>
