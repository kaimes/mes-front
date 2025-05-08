<template>
  <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
    <v-navigation-drawer v-model="showCreateEdit" location="right" width="500">
      <template v-slot:prepend>
        <v-list-item lines="two">
          <v-list-item-title v-if="id" class="text-h6">
            {{ $t('global.edit') }}
          </v-list-item-title>
          <v-list-item-title v-else class="text-h6">
            {{ $t('global.new') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ $t('services_pluagins.edit.second_title') }}
          </v-list-item-subtitle>

          <template #append>
            <v-btn
              icon
              :loading="loading"
              :disabled="!isValid.value"
              @click="save()"
              variant="text"
            >
              <v-icon icon="mdi-content-save" color="primary" />
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
            <v-row no-gutters="">
              <v-col cols="12" sm="12">
                <ServiceCombobox v-model="service" 
                :label="$t('services_pluagins.edit.planner_service')"
                />
              </v-col>
              <v-col cols="12" sm="12">
                <v-select
                  v-model="planning_plugin_type"
                  :label="$t('services_pluagins.edit.plugin_type')"
                  :items="plugin_type"
                  :hint="$t('services.edit.plugin_type_hint')"
                  clearable
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="12">
                <PluginCombobox
                  v-model="plugin"
                  :label="$t('services_pluagins.edit.plugin_slug')"

                  v-on:plugsDataFuc="plugsDataFuc"
                />
              </v-col>
            </v-row>
            <FormKitComponent
              v-model:formData="localFlexFormData"
              v-model:formSchema="dataFormSchema"
              :nodata="true"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </v-form>
  <!-- </ValidationObserver> -->
</template>
<script>
import { required } from '@/util/form';

import { mapFields } from 'vuex-map-fields';
import { mapActions, mapMutations } from 'vuex';
import ServiceSelect from '@/service_plugin/ServiceSelect.vue';
import ServiceCombobox from '@/service_plugin/ServiceCombobox.vue';
import PluginCombobox from '@/plugin/PluginCombobox.vue';
import FormKitComponent from '@/components/FormKitComponent.vue';

export default {
  setup() {
    return {
      rules: { required }
    };
  },
  name: 'JobTypeNewEditSheet',
  components: {
    ServiceSelect,
    PluginCombobox,
    FormKitComponent,
    ServiceCombobox
  },

  data() {
    return {
      plugs_data: {},
      localFlexFormData: {},
      dataFormSchema: {},
      fake_text: 'fake txt'
    };
  },

  computed: {
    ...mapFields('service_plugin', [
      'dialogs.showCreateEdit',
      'selected.plugin',
      'selected.service',
      'selected.config',
      'selected.planning_plugin_type',
      'selected.id',
      'selected.loading',
      'plugin_type'
    ])
  },

  methods: {
    ...mapActions('service_plugin', [
      'save',
      'closeCreateEdit',
      'set_select_config'
    ]),
    updatePluginMetadata(event) {
      this.plugin_metadata = event.data;
    },
    plugsDataFuc(plugs_data) {
      if (plugs_data != null) {
        this.dataFormSchema = plugs_data.config_form_spec;
        this.localFlexFormData = Object.assign(plugs_data.config, this.config);
      }
    }
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
  watch: {
    localFlexFormData: function (newVal, oldVal) {
      this.set_select_config(newVal);
    }
  }
};
</script>
