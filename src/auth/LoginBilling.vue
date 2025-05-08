<template>
  <ValidationObserver v-slot="{ invalid, validated }">
    <v-card
      class="mx-auto"
      max-width="580"
      style="margin-top: -64px"
      v-if="isShowOrganizationTAB"
    >
      <OrganzationTab />
    </v-card>

    <v-card class="mx-auto" max-width="500" style="margin-top: -64px" v-else>
      <v-card-title>Login to Kandbox Dispatch</v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <ValidationProvider name="Eamil" rules="required" immediate>
                  <v-text-field
                    v-model="email"
                    label="Email"
                    slot-scope="{ errors, valid }"
                    :error-messages="errors"
                    :success="valid"
                    required
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="12">
                <ValidationProvider name="Password" rules="required" immediate>
                  <v-text-field
                    v-model="password"
                    :type="'password'"
                    label="Password"
                    slot-scope="{ errors, valid }"
                    :success="valid"
                    :error-messages="errors"
                    required
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-list-item>
          <v-row align="center" justify="end">
            <v-spacer />
            <v-btn
              color="primary"
              @click="
                tabBasicLogin({
                  email: email,
                  password: password,
                  type: 'billing'
                })
              "
              :loading="loginLoadingBtn"
              >Login</v-btn
            >
          </v-row>
        </v-list-item>
      </v-card-actions>
    </v-card>
    <!-- <JobsStatusWaringDialog
          :isShow="jobsWaringDialogFlag"
          @close="jobsDialogClose"
          :jobsRestData="jobsRestData"
          @checkboxChange="checkboxHandler"
          /> -->
  </ValidationObserver>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';
import OrganzationTab from './OrganizationTab.vue';
import DialogStatusTips from '../components/StatusDialog.vue';
import JobsStatusWaringDialog from '../components/JobsStatusWaringDialog.vue';

extend('email', email);

extend('required', {
  ...required,
  message: 'This field is required'
});
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    OrganzationTab,
    DialogStatusTips,
    JobsStatusWaringDialog
  },
  data() {
    return {
      email: '',
      password: '',
      tab: null,
      items: ['User Existing Organization', 'Create New Organization']
    };
  },
  mounted() {
    // 判断是否是云市场单点登录的并且判断用户是否完成了初始化配置 如果没有, 则需要展示Organization TAB
    const isMarketLogin = this.getQueryVariable('action');
    if (isMarketLogin) {
      this.getCloudMarketLogin({
        instanceId: this.getQueryVariable('instanceId'),
        action: isMarketLogin,
        timeStamp: decodeURIComponent(this.getQueryVariable('timeStamp')),
        token: this.getQueryVariable('token'),
        isBilling: true
      });
    }
  },
  // 页面卸载前需要将tips初始值改回去
  beforeDestroy() {
    this.$store.commit('auth/SET_TIPS_COUNT', 0);
  },
  methods: {
    goRegister() {
      this.$router.push({ path: 'register' });
    },
    getQueryVariable(variable) {
      let query = window.location.search.substring(1);
      let vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    jobsDialogClose() {
      this.$store.commit('auth/SET_JOBS_STATUS_WARING_DIALOG', false);
      this.$store.commit('auth/SET_TIPS_COUNT', 1);
      // console.log("this.userInfo.role", this.userInfo.role);
      //
      if (window.location.pathname == '/login_billing') {
        this.$router.push({ path: '/my_order' });
      } else if (
        this.userInfo.role == 'Worker' ||
        this.userInfo.role == 'Customer'
      ) {
        this.$router.push({ path: '/job_table_4_worker' });
      } else {
        this.$router.push({ path: '/gantt' });
      }
      // this.$router.push({ path: "/gantt" });
    },
    // 不再重复提示Jobs
    checkboxHandler(val) {
      const {
        remaining_days,
        remaining_counts_percentage,
        is_remind_stoped,
        orgnaization_status
      } = this.jobsRestData;
      const params = {};
      if (val) {
        // 勾选了不再提醒
        if (remaining_days <= 7) params.is_remind_days = false;
        if (Number(remaining_counts_percentage) <= 20) {
          console.log('remaining_counts_percentage....');
          params.is_remind_counts = false;
        }
        if (is_remind_stoped && Number(orgnaization_status) > 1)
          params.is_remind_stoped = false;
      } else {
        if (remaining_days <= 7) params.is_remind_days = true;
        if (Number(remaining_counts_percentage) <= 20)
          params.is_remind_counts = true;
        if (is_remind_stoped && Number(orgnaization_status) > 1)
          params.is_remind_stoped = true;
      }
      this.postMeteringRemindStatus({
        ...params
      });
    },
    ...mapActions('auth', [
      'basicLogin',
      'getCloudMarketLogin',
      'tabBasicLogin',
      'postMeteringRemindStatus',
      'setBillingStatus'
    ])
  },
  computed: {
    ...mapState('auth', [
      'userInfo',
      'marketLoginData',
      'isShowOrganizationTAB',
      'organizationStatus',
      'loginLoadingBtn',
      'jobsRestData',
      'jobsWaringDialogFlag'
    ]),
    ...mapFields('auth', ['dialogs.dialogRunBatchDialog'])
  }
};
</script>

<style scoped></style>
