<template>
  <v-container class="page" fluid>
    <v-card class="pa-4" elevation="0">
      <v-row align="center">
        <v-col cols="6">
          <span class="subtitle-1">{{$t("setting.organization_settings")}}</span>
        </v-col>
        <v-col cols="6">
          <div class="d-flex align-center ga-4 justify-end">
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                :disabled="!userInfo || userInfo.role === 'User'"
                @click="onSave"
            >
            {{ $t('config_setting.table.save') }}
            </v-btn>
            <v-btn
                class="text-none"
                color="red"
                variant="flat"
                :loading="loading"
                :disabled="!userInfo || userInfo.role === 'User'"
                @click="removeShow"
            >
            {{ $t('global.delete') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col cols="12" md="6">
          <v-text-field
              v-model="code"
              :label="$t('config_setting.table.code')"
              hint="The unique key for the org."
              clearable
              required
              :disabled="true"
              class="org_text_mg"
              name="OrganizationCode"
          />
          <!-- </ValidationProvider> -->
        </v-col>
        <v-col cols="6" md="3">
          <v-text-field
              v-model="org_type"
              :label="$t('setting.type')"
              hint="Organization Type"
              :disabled="true"
              class="org_text_mg"
          />
        </v-col>
        <v-col cols="6" md="3">
          <v-select
              class="org_select_mg"
              v-model="orgStatus"
              :label="$t('setting.organization_status')"
              :items="status_list"
              disabled
          />
        </v-col>

        <!-- <v-col cols="3" md="2" align-center>
          <v-text-field
              v-model="job_count"
              :label="$t('setting.jobs')"

              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="2">
          <v-text-field
              v-model="max_nbr_jobs"
              :label="$t('setting.maxjobs')"

              :disabled="!is_sys_user"
          ></v-text-field>
        </v-col>

        <v-col cols="3" md="2">
          <v-text-field
              v-model="worker_count"
              :label="$t('setting.worker')"

              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="2">
          <v-text-field
              v-model="max_nbr_workers"
              :label="$t('setting.max_workers')"

              :disabled="!is_sys_user"
          ></v-text-field>
        </v-col>


        <v-col cols="3" md="2">
          <v-text-field
              v-model="team_count"

              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="2">
          <v-text-field
              v-model="max_nbr_teams"
              :label="$t('setting.max_team')"
              :disabled="!is_sys_user"
          ></v-text-field>
        </v-col>

      </v-row>
      <v-row align="center" no-gutters>
        <v-col cols="12" md="3">
          <v-switch
              v-model="callback_is_active"
              hint="Whether to callback or not."
              :label="$t('setting.job_change_callback')"

          />
        </v-col>

        <v-col cols="12" sm="9">
          <v-text-field
              v-model="callback_url"
              :label="$t('setting.job_change_callback_url')"

              hint="The url from 3rd party application to receive all job change events"
              clearable
              required
              :disabled="!userInfo || userInfo.role == 'User'"
          />
        </v-col> -->
      </v-row>

      <div class="json-editor">
        <span class="subtitle-2">{{ $t('config_setting.table.flexible_table_columns') }}</span>
        <Vue3JsonEditor
            v-model="work_calendar"
            mode="code"
            :show-btns="false"
            :expandedOnStart="true"
            @json-change="on_work_calendar_json_change"
            class="vue_json_editor_context"
        />
      </div>
      <div class="json-editor">
        <span class="subtitle-2">{{ $t('config_setting.table.glossary_setting') }}</span>
        <Vue3JsonEditor
            v-model="default_job_flex_form_data"
            mode="code"
            :show-btns="false"
            :expandedOnStart="true"
            @json-change="on_default_job_flex_form_data_change"
            class="vue_json_editor_context"
        />
      </div>
      <div class="json-editor">
        <span class="subtitle-2">{{ $t('config_setting.table.footer_setting') }}</span>
        <Vue3JsonEditor
            v-model="default_worker_flex_form_data"
            mode="code"
            :show-btns="false"
            :expandedOnStart="true"
            @json-change="on_default_worker_flex_form_data_change"
            class="vue_json_editor_context"
        />
      </div>
    </v-card>
    <OrgDeleteDialog />
  </v-container>
</template>

<script>
import { required } from '@/util/form';

import { mapFields } from 'vuex-map-fields';
import { Vue3JsonEditor } from 'vue3-json-editor';
import { mapActions, mapState, mapMutations } from 'vuex';

import OrgDeleteDialog from '@/org/DeleteDialog.vue';
import useCommonStore from "@/app/common";

export default {
  setup() {
    return {
      rules: { required }
    };
  },
  name: 'OrgFromEditSheet',
  components: {
    Vue3JsonEditor,
    OrgDeleteDialog
  },

  data() {
    return {
      localOrganizationStatus: localStorage.getItem('organizationStatus') // organizationStatus取的是本地缓存的数据
    };
  },

  computed: {
    ...mapFields('org', [
      'selected.id',
      'selected.code',
      'selected.org_type',
      'selected.org_setting',
      'selected.callback_url',
      'selected.worker_flex_form_schema',
      'selected.team_flex_form_schema',
      'selected.job_flex_form_schema',
      'selected.order_flex_form_schema',
      'selected.default_worker_flex_form_data',
      'selected.default_team_flex_form_data',
      'selected.default_job_flex_form_data',
      'selected.default_order_flex_form_data',
      'selected.msg_template',
      'selected.work_calendar',
      'selected.max_nbr_workers',
      'selected.max_nbr_teams',
      'selected.max_nbr_jobs',
      'selected.worker_count',
      'selected.team_count',
      'selected.job_count',
      'selected.zulip_is_active',
      'selected.callback_is_active',
      'selected.zulip_site',
      'selected.zulip_user_name',
      'selected.zulip_password',
      'selected.loading',
      'dialogs.showCreateEdit',
      'selected.status', // Organization Status
      'selected.status_list' // Organization Status list
    ]),
    ...mapState('auth', ['userInfo']),
    is_sys_user(){
      const { role } = this.userInfo || {};
      if (!role && role.length === 0) {
        return false
      }
      const $roles = role.map(item => item.key);
      console.log("this.userInfo.role", this.userInfo.role)
      return $roles.includes("sys");
    },
    worker_count_statistics() {
      return this.worker_count + '/' + this.max_nbr_workers;
    },
    job_count_statistics() {
      return this.job_count; // + '/' + this.max_nbr_jobs;
    },
    team_count_statistics() {
      return this.team_count + '/' + this.max_nbr_teams;
    },
    orgStatus() {
      return {
        text: this.localOrganizationStatus,
        value: this.localOrganizationStatus
      };
    }
  },
  mounted() {
    this.getOrg();
  },
  methods: {
    ...mapActions('org', ['save', 'getOrg', 'removeShow']),
    ...mapActions('auth', ['logout']),
    ...mapMutations('org', ['SET_SELECTED']),

    on_order_json_change(order_flex_form_schema) {
      console.log({ order_flex_form_schema });
      this.SET_SELECTED({ order_flex_form_schema });
    },

    on_worker_json_change(worker_flex_form_schema) {
      console.log({ worker_flex_form_schema });
      this.SET_SELECTED({ worker_flex_form_schema });
    },

    on_job_json_change(job_flex_form_schema) {
      console.log({ job_flex_form_schema });
      this.SET_SELECTED({ job_flex_form_schema });
    },
    on_team_json_change(team_flex_form_schema) {
      // console.log({ team_flex_form_schema });
      this.SET_SELECTED({ team_flex_form_schema });
    },


    on_default_worker_flex_form_data_change(default_worker_flex_form_data) {

      this.SET_SELECTED({ default_worker_flex_form_data });
    },
    on_default_job_flex_form_data_change(default_job_flex_form_data) {
      // console.log("on_default_job_flex_form_data_change", { default_job_flex_form_data });
      this.SET_SELECTED({ default_job_flex_form_data });
    },
    on_default_order_flex_form_data_change(default_order_flex_form_data) {

      this.SET_SELECTED({ default_order_flex_form_data });
    },
    on_default_team_flex_form_data_change(default_team_flex_form_data) {

      this.SET_SELECTED({ default_team_flex_form_data });
    },


    on_org_setting_json_change(org_setting) {
      console.log({ org_setting });
      this.SET_SELECTED({ org_setting });
    },

    on_work_calendar_json_change(work_calendar) {
      console.log({ work_calendar });
      this.SET_SELECTED({ work_calendar });
    },
    onSave() {
      this.save().then(res => {
        useCommonStore().initDictData();
      });
    }
  }
};
</script>
<style scoped>
::v-deep(.jsoneditor-vue) {
  height: 500px;
}
.org_text_mg {
  margin-right: 30px;
}
.org_select_mg {
  margin-left: 30px;
}
</style>
