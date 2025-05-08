<template>
  <v-app-bar clipped-left clipped-right class="ma-0 pa-0" app height="70">
    <v-btn icon @click="reset_env_current_order_job('D')" variant="text">
      <v-icon :color="pickDropTypeColor('D')">mdi-map-marker</v-icon>
    </v-btn>

    <v-btn icon @click="reset_env_current_order_job('PD')" variant="text">
      <v-icon :color="pickDropTypeColor('PD')" class="my-3">mdi-map-marker-distance</v-icon>
    </v-btn>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <v-card width="300px">
      <v-list density="default" lines="one" class="ma-0"
        v-if="envCurrentOrderJob && envCurrentOrderJob.pick_latlng !== 'undefined'">
        <v-list-item color="primary">
          <template #title>
            Pick Long: {{ envCurrentOrderJob?.pick_latlng?.geo_longitude }}
          </template>
        </v-list-item>
        <v-list-item color="primary" style="margin-top: -14px">
          <template #title>
            Pick Lat: {{ envCurrentOrderJob?.pick_latlng?.geo_latitude }}
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <div style="margin-left: 20px" />

    <v-card width="300px">
      <v-list density="default" lines="one" class="ma-0"
        v-if="envCurrentOrderJob && envCurrentOrderJob.drop_latlng !== 'undefined'">
        <v-list-item color="primary">
          <template #title>
            Drop Long: {{ envCurrentOrderJob?.drop_latlng?.geo_longitude }}
          </template>
        </v-list-item>
        <v-list-item color="primary" style="margin-top: -14px">
          <template #title>
            Drop Lat: {{ envCurrentOrderJob?.drop_latlng?.geo_latitude }}
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <div style="margin-left: 20px" />

    <v-card>
      <v-list density="default" lines="one" class="ma-0">
        <v-list-item color="primary">
          <template #title>
            Order Number: {{ envCurrentOrderJob?.order_code }}
          </template>
        </v-list-item>
        <v-list-item color="primary" style="margin-top: -14px">
          <template #title>Time: {{ currentTime }}</template>
        </v-list-item>
      </v-list>
    </v-card>

    <v-spacer />
    <v-progress-circular v-if="teamEnvDataRefreshInProgressFlag" indeterminate color="primary"></v-progress-circular>

    <!-- 按钮校验 前端 地图 job  check  -->
    <v-btn tile color="indigo" class="icon_btn" variant="text" x-small @click="show_DialogActionVirtualJob(true)">
      <v-icon color="primary">mdi-basket-fill</v-icon>
    </v-btn>
    <v-btn icon @click="save_create_jobs">
      <v-icon :color="planIconInfoColor.color" class="my-3">mdi-content-save</v-icon>
    </v-btn>
    <v-btn icon @click="closeEnvStepResultShowFlag()">
      <v-icon color="primary">mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';

import { mapState } from 'vuex';
import Util from '@/util';
export default {
  name: 'AppToolbarEnvStepResult',
  data() {
    return {};
  },
  computed: {
    ...mapState('gantt', [
      'teamEnvDataRefreshInProgressFlag',
      'plannerFilters',
      'envCurrentOrderJob'
    ]),
    ...mapState('auth', ['userInfo']),
    // ...mapFields('org', ['selected.org_setting']),

    planIconInfoColor() {
      if (this.envCurrentOrderJob.type_pick_drop == 'PD') {
        if ((!this.envCurrentOrderJob.pick_latlng.geo_longitude) || (!this.envCurrentOrderJob.drop_latlng.geo_longitude)) {
          return { icon: 'mdi-stop-circle', color: 'red' };
        }
      } else {
        if (!this.envCurrentOrderJob.drop_latlng.geo_longitude) {
          return { icon: 'mdi-stop-circle', color: 'red' };
        }
      }
      return { icon: 'mdi-play-circle', color: 'green' };
    },

    localFilterDate: {
      get() {
        if (this.plannerFilters.start_day) {
          return `${this.plannerFilters.start_day.substring(
            4,
            8
          )} ~ ${this.plannerFilters.end_day.substring(4, 8)}`;
        } else {
          return `N/A`;
        }
      }
    },
    currentTime: {
      get() {
        if (false) {
          // return GanttUtil.date_formatter_hhmm(this.singleEnvStepResult.current_datetime)
          return this.singleEnvStepResult.current_datetime;
        } else {
          return `N/A`;
        }
      }
    },
    queryString: {
      set(query) {
        this.$store.dispatch('search/setQuery', query);
      },
      get() {
        return this.$store.state.query;
      }
    }
  },
  methods: {
    ...mapMutations('gantt', [
      'SET_ENV_CURRENT_ORDER_JOB',
    ]),

    ...mapActions('auth', ['logout']),
    ...mapActions('search', ['setQuery']),
    ...mapMutations('search', ['SET_QUERY']),
    ...mapActions('gantt', [
      'commitChangedJobs',
      'submitOrderJobFromMap',
      'reset_planning_window',
      'reset_env_current_order_job',
      'setCurrentOrderJob',
      'doCheckCurrentOrderJobPrediction',
    ]),
    ...mapMutations('gantt', [
      'SET_ENV_STEP_RESULT_SHOW_FLAG',
      'SET_DialogActionVirtualJob_Visible'
    ]),

    closeEnvStepResultShowFlag() {
      this.SET_ENV_STEP_RESULT_SHOW_FLAG(false);
      this.SET_ENV_CURRENT_ORDER_JOB({
        pick_latlng: {},
        drop_latlng: {},
        type_pick_drop: 'PD',
        order_code: ''
      });
    },
    handleDrawerToggle() {
      this.$store.dispatch('app/toggleDrawerAction');
    },
    handleFullScreen() {
      Util.toggleFullScreen();
    },
    performSearch() {
      this.$store.dispatch('search/getResults', this.$store.state.query);
      this.$router.push('/search');
    },
    save_create_jobs() {
      // console.log(
      //   'current operate is add job , org_setting is ',
      //   this.org_setting
      // );
      // const org_setting = this.org_setting;
      this.submitOrderJobFromMap();
    },
    pickDropTypeColor(myColor) {
      const { type_pick_drop } = this.envCurrentOrderJob;
      if (type_pick_drop === myColor) {
        return 'primary';
      } else {
        return 'gray3';
      }
    },

    show_DialogActionVirtualJob(visibleFlag) {
      this.setCurrentOrderJob({ requestOrderJobType: 'virtual' }).then(() => {
        this.doCheckCurrentOrderJobPrediction().then(() => {
          this.SET_DialogActionVirtualJob_Visible(visibleFlag);
        }) 
      });

      // this.$store.commit("gantt/SET_DialogActionVirtualJob_Visible", visibleFlag);
    }
  }
};
</script>

<style lang="stylus" scoped></style>
