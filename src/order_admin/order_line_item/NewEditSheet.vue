<template>
  <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
    <v-navigation-drawer
      v-model="dialogs.showCreateEdit"
      location="right"
      width="500"
    >
      <template v-slot:prepend>
        <v-list-item lines="two">
          <v-list-item-title v-if="isEditFlag" class="text-h6"
            >Edit</v-list-item-title
          >
          <v-list-item-title v-else class="text-h6">New</v-list-item-title>
          <v-list-item-subtitle>Site</v-list-item-subtitle>
          <template #append>
            <v-btn
              icon
              :loading="selected.loading"
              :disabled="!isValid.value"
              @click="save()"
              variant="text"
            >
              <v-icon icon="mdi-content-save" color="primary" />
            </v-btn>
            <v-btn
              variant="text"
              icon
              color="secondary"
              @click="closeCreateEdit()"
            >
              <v-icon icon="mdi-close" />
            </v-btn>
          </template>
        </v-list-item>
      </template>
      <v-card flat>
        <v-card-text>
          <v-container grid-list-md>
            <v-row wrap>
              <v-col md="12" cols="12">
                <span class="subtitle-2">Details</span>
              </v-col>
              <v-col md="12" cols="12">
                <!-- <ValidationProvider name="code" rules="required" immediate> -->
                <v-text-field
                  v-model="selected.code"
                  label="code"
                  hint="A name for your location."
                  required
                  name="code"
                  :clearable="!isEditFlag"
                  :disabled="isEditFlag"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col md="12" cols="12">
                <v-text-field
                  v-model="selected.type"
                  label="type"
                  hint="A type for your Area."
                  required
                  name="type"
                  :clearable="!isEditFlag"
                  :rules="[rules.required]"
                />
              </v-col>

              <v-col md="12" cols="12">
                <!-- <ValidationProvider name="code" rules="required" immediate> -->
                <v-text-field
                  v-model="selected.site_id"
                  label="site_id"
                  hint="A site_id for your Area."
                  required
                  name="site_id"
                  :clearable="!isEditFlag"
                  :rules="[rules.required]"
                />
              </v-col>
              <!-- <v-col md="12" cols="12">
                <team-select
                  v-if="'Customer' != userInfo.role"
                  v-model="team"
                  :rules="[rules.required]"
                ></team-select>
              </v-col> -->

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
                  label="Latitude"
                  hint="y, or geo_latitude."
                  clearable
                  required
                  name="latitude"
                  :rules="[rules.required]"
                />
                <!-- </ValidationProvider> -->
              </v-col>
              <v-col xs12>
                <v-text-field
                  v-model="selected.flex_form_data"
                  label="flex_form_data"
                  hint="flex_form_data"
                  clearable
                  required
                />
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
          </v-container>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </v-form>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";

import { useAuthStore } from "../auth/storePinia";

import { useSemiDetailStore } from "./storePinia";
import { required } from "@/util/form";

export default {
  setup() {
    return {
      rules: { required },
    };
  },
  name: "LocationNewEditSheet",

  components: {
    // ValidationObserver,
    // ValidationProvider,
    TeamSelect,
  },

  data() {
    return {};
  },
  computed: {
    // ...mapState('auth', ['userInfo']),
    ...mapWritableState(useAuthStore, ["userInfo"]),

    ...mapState(useSemiDetailStore, ["isEditFlag", "dialogs", "selected"]),
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
    // ...mapActions("location", ["save", "closeCreateEdit"]),
    ...mapActions(useSemiDetailStore, ["save", "closeCreateEdit"]),
  },
};
</script>
