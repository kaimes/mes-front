<template>
  <v-app-bar
    clipped-left
    clipped-right
    class="ma-0 pa-0"
    app
    color="white"
    height="68"
  >
    <v-card class="ma-0 pa-0" max-width="240">
      <v-list-item class="ma-0" density="default">
        <!-- <v-list-item-content class="text-xs-caption"> -->
        <v-list-item-title class="text-xs-caption">
          <v-icon small>mdi-home-currency-usd</v-icon>
          {{ singleJobDropCheckOptions.job_code }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-xs">
          <v-icon small>mdi-account</v-icon>
          {{ singleJobDropCheckOptions.scheduled_primary_worker_code }}
        </v-list-item-subtitle>
        <v-list-item-subtitle class>
          <v-icon small>mdi-av-timer</v-icon>
          Start:
          {{ formatHHMM(singleJobDropCheckOptions.scheduled_start_datetime) }}
        </v-list-item-subtitle>
        <!-- </v-list-item-content> -->
      </v-list-item>
    </v-card>

    <v-avatar large v-if="plannerHealthCheckResultShowFlag">
      <v-icon
        large
        :color="
          ruleOverallStatusStyle[singleJobDropCheckResult.status_code].color
        "
      >
        {{ ruleOverallStatusStyle[singleJobDropCheckResult.status_code].icon }}
      </v-icon>
    </v-avatar>

    <v-avatar class="mr-4" v-if="!plannerHealthCheckResultShowFlag">
      <v-icon>mdi-done</v-icon>
      {{ singleJobDropCheckResult }}
    </v-avatar>

    <v-chip-group v-if="!singleJobCheckAPICallInProgressFlag" column>
      <v-tooltip
        bottom
        v-for="(res, ind) in singleJobDropCheckResult.messages"
        :key="res.rule"
        :text="JSON.stringify(singleJobDropCheckResult.messages[ind].message)"
      >
        <template v-slot:activator="{ props }">
          <v-chip
            small
            :color="
              ruleOverallStatusStyle[
                getResultByScore(singleJobDropCheckResult.messages[ind].score)
              ].color
            "
            v-bind="props"
            text-color="white"
          >
            <v-avatar small left>
              <v-icon small>{{ ruleIcons[res.score_type] }}</v-icon>
            </v-avatar>
            {{ res.score_type }}
          </v-chip>
        </template>
      </v-tooltip>
    </v-chip-group>

    <v-spacer />
    <v-progress-circular
      v-if="singleJobCheckAPICallInProgressFlag"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <!--  -->
    <!-- <v-badge
      overlap
      color="green"
      :content="changedJobCount"
      v-if="plannerHealthCheckResultShowFlag"
    >      </v-badge> -->
    <v-btn
      icon
      @click="onClickSaveButton"
      :disabled="disableBtn"
      v-if="plannerHealthCheckResultShowFlag"
    >
      <v-icon color="primary">mdi-content-save</v-icon>
    </v-btn>

    <v-btn icon @click="closePlannerHealthCheckResultShowFlag()">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
// class="ml-2 pl-3"   extended extension-height="40"
// color="ruleOverallStatusStyle[getResultByScore(singleJobDropCheckResult.messages[ind].score)].color"
import { formatHHMM } from '@/filters';

import { mapActions, mapMutations } from 'vuex';
//import { mapGetters } from "vuex"
import { mapFields } from 'vuex-map-fields';

import { mapState } from 'vuex';

import Util from '@/util';
export default {
  setup() {
    return { formatHHMM };
  },
  name: 'AppToolbarHealthCheck',
  data() {
    return {
      ruleIcons: {
        'Within Working Hour': 'mdi-av-timer',
        'Enough Travel': 'mdi-train-car',
        'Lunch Break': 'mdi-food',
        'Requested Skills': 'mdi-tools',
        'DateTime Tolerance': 'mdi-ray-start-end',
        'Retain Tech': 'mdi-pin',
        'Shared Visit': 'mdi-calendar-multiple',
        'Permanent Pair': 'mdi-account-multiple-check',
        'Requested Items': 'mdi-format-list-checks',
        'Requested Vehicle': 'mdi-truck-check',
        'Waste Space': 'mdi-delete-outline'
      },
      ruleOverallStatusStyle: {
        OK: { icon: 'mdi-checkbox-marked-circle', color: 'green' },
        Warning: { icon: 'mdi-information-outline', color: 'rgb(255, 193, 7)' },
        Error: { icon: 'mdi-close-circle', color: 'red' }
      }
    };
  },
  components: {},
  computed: {
    ...mapState('gantt', [
      'plannerHealthCheckResultShowFlag',
      'singleJobCheckAPICallInProgressFlag',
      'singleJobDropCheckShowFlag',
      'singleJobDropCheckResult',
      'singleJobDropCheckOptions',
      'plannerFilters',
      'global_loaded_data',
      'INDEX_CONFIG'
    ]),
    ...mapState('auth', ['userInfo']),

    ...mapActions('auth', ['logout']),
    ...mapActions('search', ['setQuery']),
    ...mapMutations('search', ['SET_QUERY']),
    ...mapActions('gantt', ['commitChangedJobs']),
    ...mapMutations('gantt', ['SET_JOB_HEALTH_CHECK_RESULT_SHOW_FLAG']),
    // ...mapFields("gantt", ["INDEX_CONFIG"]),

    toolbarColor() {
      return 'primary'; // this.$vuetify.options.extra.mainNav
    },

    changedJobCount: {
      get() {
        var _that = this;
        let changedJobCount_ = this.global_loaded_data.planned_jobs_data.reduce(
          function (n, val) {
            return (
              n + (val[_that.INDEX_CONFIG.POS_JOB_INDEX_changed_flag] === 1)
            );
          },
          0
        );
        return changedJobCount_;
      }
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
    localFilterTeamEmail: {
      get() {
        if (this.plannerFilters.team) {
          return `${this.plannerFilters.team.code}`;
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
    },
    disableBtn() {
      if (
        localStorage.getItem('organizationStatus') === 'Stopped' ||
        localStorage.getItem('organizationStatus') === 'Expired' ||
        this.singleJobDropCheckResult.status_code == 'Error'
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    getResultByScore(score) {
      if (score == 1) {
        return 'OK';
      } else if (score == -1) {
        return 'Error';
      } else {
        return 'Warning';
      }
    },
    onClickSaveButton() {
      this.$store.dispatch('gantt/commitChangedJobs');
    },

    closePlannerHealthCheckResultShowFlag() {
      this.$store.commit('gantt/SET_JOB_HEALTH_CHECK_RESULT_SHOW_FLAG', false);
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
    }
  }
};
</script>

<style lang="stylus" scoped></style>
