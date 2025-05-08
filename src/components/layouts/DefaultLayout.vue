<template>
  <v-app>
    <app-toolbar />
    <!-- 顶部导航栏 -->
    <app-drawer />
    <v-main>
      <v-container class="page-wrapper" fluid>
        <page-header />
        <div class="page-wrapper-content">
          <router-view />
        </div>
      </v-container>
    </v-main>
    <!-- App Footer -->
    <app-footer />
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';
import AppDrawer from '@/components/AppDrawer.vue';
import AppToolbar from '@/components/AppToolbar.vue';
import AppFooter from '@/components/AppFooter.vue';

import AppToolbarHealthCheck from '@/components/AppToolbarHealthCheck.vue';
import AppToolbarEnvStepResult from '@/components/AppToolbarEnvStepResult.vue';

import AppToolbarLiveMapTaixInfo from '@/components/AppToolbarLiveMapTaixInfo.vue';
import AppToolbarPlannerScore from '@/components/AppToolbarPlannerScore.vue';

import PageHeader from '@/components/PageHeader.vue';
import useCommonStore from "@/app/common";


export default {
  components: {
    AppDrawer,
    AppToolbar,
    AppToolbarHealthCheck,
    AppToolbarEnvStepResult,
    AppToolbarPlannerScore,
    AppToolbarLiveMapTaixInfo,
    PageHeader,
    AppFooter
  },

  created() {
    this.$vuetify.theme.light = true;
  },

  mounted() {
    // this.getOrg();
    this.initDict();
  },
  watch: {
    // noPlannerShowing(val) {
    //   console.info("noPlannerShowing: " + val);
    // },
    // plannerScoresShowFlag(val) {
    //   console.info("plannerScoresShowFlag: " + val);
    // },
    // taxi_kpi_show_flag(val) {
    //   console.info("taxi_kpi_show_flag: " + val);
    // },
  },
  methods: {
    ...mapActions('auth', ['getUserInfo']),
    ...mapActions('org', ['getOrg']),
    initDict() {
      useCommonStore().initDictData();
    }
  }
};
</script>

<style lang="scss" scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 68px);
  padding: 16px;
  border-radius: 12px;
  background: rgb(238,242,246);
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 12px;
    padding: 16px;
    ::v-deep {
      .v-container {
        padding: 0;
      }
    }
  }
}
</style>
