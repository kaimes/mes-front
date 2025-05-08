<template>
  <!-- <ValidationObserver v-slot="{ invalid, validated }"> -->
  <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
    <v-navigation-drawer
      v-model="showCreateEdit"
      app
      clipped
      location="right"
      width="500"
    >
      <template v-slot:prepend>
        <v-list-item lines="two">
          <!-- <v-list-item-content> -->
          <v-list-item-title v-if="id" class="text-h6">{{$t("global.edit")}}</v-list-item-title>
          <v-list-item-title v-else class="text-h6">{{$t("global.new")}}</v-list-item-title>
          <v-list-item-subtitle>{{$t('menu.planner_service')}}</v-list-item-subtitle>
          <!-- </v-list-item-content> -->

          <template #append>
            <v-btn
              icon
              :loading="loading"
              :disabled="!isValid.value"
              @click="save()"
              variant="text"
            >
              <v-icon color="primary" icon="mdi-content-save" />
            </v-btn>
            <v-btn
              icon
              color="secondary"
              @click="closeCreateEdit()"
              variant="text"
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
              <v-col cols="12" md="12">
                <span class="subtitle-2">
                  {{ $t('global.detail') }}
                  </span>
              </v-col>
              <v-col cols="12" md="12">
                <!-- <ValidationProvider name="ServiceCode" rules="required" immediate> -->
                <v-text-field
                  v-model="code"
                  :rules="[rules.required]"
                  :label="$t('services.edit.service_code')"
                  hint="A code for your planner service."
                  clearable
                  required
                />
                <!-- </ValidationProvider> -->
              </v-col>
              <v-col cols="12" md="12">
                <!-- <ValidationProvider name="ServiceName" rules="required" immediate> -->
                <v-text-field
                  v-model="name"
                  :label="$t('services.edit.service_name')"
                  hint="Name for your planner service."
                  clearable
                  required
                  :rules="[rules.required]"
                />
                <!-- </ValidationProvider> -->
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="description"
                  :label="$t('services.edit.description')"
                  :hint="$t('services.edit.description_hint')"
                  clearable
                />
              </v-col>
              <!-- Disable type (default to pager duty) until we have a way to validate. -->

              <!-- <v-col xs12>
                <v-switch
                  v-model="is_active"
                  :label="is_active ? 'Active' : 'Inactive'"
                />
              </v-col>-->
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </v-form>
  <!-- </ValidationObserver> -->
</template>

<script>
import { required, email } from '@/util/form';

import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';
// import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
// import { required } from 'vee-validate/dist/rules';
import PluginApi from '@/plugin/api';

// extend('required', {
//   ...required,
//   message: 'This field is required'
// });

export default {
  setup() {
    return {
      rules: { required, email }
    };
  },
  name: 'ServiceNewEditSheet',

  components: {
    // ValidationObserver,
    // ValidationProvider
  },

  // 弹出层应该这样判断
  mounted() {
    this.$watch(
      (vm) => [vm.showCreateEdit],
      () => {
        this.$refs.vform.validate(); // 手动触发表单校验
      }
    );
  },
  computed: {
    ...mapFields('service', [
      'selected.code',
      'selected.name',
      'selected.id',
      'selected.description',
      'selected.is_active',
      'selected.loading',
      'dialogs.showCreateEdit'
    ])
  },

  methods: {
    ...mapActions('service', ['save', 'closeCreateEdit'])
  },

  data() {
    return {
      oncall_plugins: null
    };
  }

  // mounted() {
  //   // this.loading = true;
  //   // PluginApi.getByType("oncall").then((response) => {
  //   //   this.loading = false;
  //   //   this.oncall_plugins = response.data.items.map((p) => p.slug);
  //   // });
  // }
};
</script>
