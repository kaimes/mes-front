<template>
  <v-app-bar
    clipped-left
    clipped-right
    class="ma-0 pa-0"
    app
    color="white"
    height="70"
  >
    <!--v-card class="ma-0" max-width="200" height="55">
      <v-list-item class="ma-0" density="default">
        <v-list-item-title>
          <v-icon small>mdi-account-multiple</v-icon> Team:
          {{ localFilterTeamEmail }}
        </v-list-item-title>
        <v-list-item-title>
          <v-icon small>mdi-calendar</v-icon>
          Env: {{ plannerScoresStats.planning_window }}
        </v-list-item-title>
      </v-list-item>

 ---
      text="
          (score =
            onsite_working_minutes /
              (total_travel_minutes + onsite_working_minutes) +
            inplanning_job_count /
              (inplanning_job_count + unplanned_job_count) -
            total_overtime_minutes / onsite_working_minutes)
        "

        finance
 ---

    </v-card-->
    <v-card class="ma-0" min-width="130" max-width="130" height="55">
      <v-tooltip  bottom >
        <template #activator="{ props }">
          <v-card-title v-bind="props" style="display: flex">
            <v-icon size="30px" color="primary" class="mr-3">mdi-chart-bar</v-icon>
            <div>
              <span
                class="font-weight-black"
                v-text="plannerScoresStats.score"
              ></span>
            </div>
          </v-card-title>
        </template>
        <span>Travel Minutes </span>
      </v-tooltip>
    </v-card>

    <v-card
      class="ma-1 pa-1"
      min-width="300"
      max-width="600"
      height="55"
      d-xs-none
    >
      <p class="text--primary">
        Travel: {{ plannerScoresStats.total_travel_minutes }} min, Onsite:{{
          plannerScoresStats.onsite_working_minutes
        }}
        min, Inplanning: {{ plannerScoresStats.inplanning_job_count }},
        Unplanned:{{ plannerScoresStats.unplanned_job_count }}, Overtime:
        {{ plannerScoresStats.total_overtime_minutes }} min
      </p>
    </v-card>

    <v-spacer />
    <v-progress-circular
      v-if="teamEnvDataRefreshInProgressFlag"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-btn icon @click="closePlannerScoreShowFlag()">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<script>
// class="ml-2 pl-3"   extended extension-height="40"
// color="ruleOverallStatusStyle[getResultByScore(singleJobDropCheckResult.messages[ind].score)].color"

import { mapActions, mapMutations } from 'vuex';
//import { mapGetters } from "vuex"

import { mapState } from 'vuex';
import Util from '@/util';
export default {
  name: 'AppToolbarPlannerScore',
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
        'Permanent Pair': 'mdi-account-multiple-check'
      },
      ruleOverallStatusStyle: {
        OK: { icon: 'mdi-checkbox-marked-circle', color: 'green' },
        Warning: { icon: 'mdi-information-outline', color: 'yellow' },
        Error: { icon: 'info', color: 'red' }
      }
    };
  },
  computed: {
    ...mapState('gantt', [
      'teamEnvDataRefreshInProgressFlag',
      'plannerFilters',
      'plannerScoresStats'
    ]),
    ...mapState('auth', ['userInfo']),
    toolbarColor() {
      return 'primary'; // this.$vuetify.options.extra.mainNav
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
    closePlannerScoreShowFlag() {
      this.$store.commit('gantt/SET_PLANNER_SCORE_SHOW_FLAG', false);
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

    ...mapActions('auth', ['logout']),
    ...mapActions('search', ['setQuery']),
    ...mapMutations('search', ['SET_QUERY']),
    ...mapActions('gantt', ['commitChangedJobs']),
    ...mapMutations('gantt', ['SET_JOB_HEALTH_CHECK_RESULT_SHOW_FLAG'])
  }
};
</script>

<style lang="stylus" scoped></style>
