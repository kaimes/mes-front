<template>
  <v-container>
    <!-- {{ computed_schema }} -->
    <pre>{{ computed_schema }}</pre>
    <pre>{{ formData }}</pre>

  </v-container>
</template>

<script>
import Util from '@/util';

export default {
  name: 'WorkerFormKitFlexForm',
  components: {},
  methods: {},
  props: {
    formSchema: {
      type: Object,
      default: function () {
        return {
          type: 'object',
          properties: {
            level: {
              type: 'number',
              title: 'requested min level (integer)'
            },
            skills: {
              type: 'array',
              title: 'requested_skills',
              items: {
                type: 'string'
              }
            }
          }
        };
      }
    },
    formData: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  computed: {
    // 一个计算属性的 getter
    computed_schema() {
      const form_schema = Util.format_flex_form_data_to_formkit_templeat(
        this.formSchema
      );
      console.log({ form_schema });
      return form_schema;
    }
  },
  // watch: {
  //   formData: function (newVal, oldVal) {
  //     console.log('formData', { newVal, oldVal });
  //   }
  // },
  data() {
    return {
      data_TEST: {
        env_start_datetime: '2023-12-08T00:00:00',
        nbr_minutes_planning_windows_duration: 1440*3,
        kmedoid_radius_max_meters: 6000,
        same_area_radius_max_meters: 4000,
        different_area_radius_max_meters: 2000,
        max_job_in_worker_size: 16,
        max_nbr_jobs_allowed: 4,
        late_delivery_tolerance_max_minutes: 5,
        nbr_observed_slots: 200,
        fixed_env_start_day_flag: 1,
        rolling_every_day: 1,
        nbr_of_days_planning_window: 3,
        reset_dataset: 'N',
        slot_by_shift_start: 0,
        slot_by_business_hour: 1,
        nbr_initial_steps: 20,
        scoring_factor_standard_travel_minutes: 90,
        job_address_flag: 1,
        holiday_days: '',
        default_requested_primary_worker_code: '',
        respect_initial_travel: 0,
        worker_job_min_minutes: 1,
        horizon_start_minutes: 547850,
        travel_speed_km_hour: 19.8,
        travel_min_minutes: 5,
        job_icon: 'fa-user',
        worker_icon: 'fa-taxi',
        enable_env_start_day_is_other_day: 0,
        begin_skip_minutes: 0,
        inner_slot_planner: 'head_tail',
        use_zulip: 0,
        requested_skills: '',
        nbr_sampled_workers: 200,
        nbr_sampled_jobs: 3260,
        max_reposition_count_before_job: -1,
        logged_random_skip_job_max_nbr: 1,
        job_generation_max_count: 5500,
        shuffle_logged_locations: 0,
        simulation_log_dir: '/tmp',
        timezone: 'Asia/Dubai',
        realtime_env_update_flag: 0,
        merge_over_free_hour_list: '1;2;3;4;5',
        max_meters_radius_merge_pick: 3000,
        max_meters_radius_merge_drop: 800,
        max_meters_radius_merge_drop_scaling_distance_km: 12,
        min_meters_merge_candidate_drop_radius: 5000,
        weekly_working_days: '0;1;2;3;4;5;6',
        bussiness_type: 'pickdrop',
        nbr_minutes_planning_windows_duration: 1440,
        env_start_datetime: '2023-12-11T00:00:00',
        horizon_start_datetime: '2023-12-08T03:00:00'
      },

      schema_TEST: [
        {
          $formkit: 'text',
          name: 'env_start_datetime',
          label: 'env_start_datetime, in ISO format, e.g. 2023-10-03T00:00:00'
        },
        {
          $formkit: 'number',
          name: 'nbr_minutes_planning_windows_duration',
          label: 'Duration minutes for planning window'
        },
        {
          $formkit: 'text',
          name: 'timezone',
          label:
            'Timezone string for this team, according to pytz list: https://pypi.org/project/pytz/'
        },
        {
          $formkit: 'number',
          name: 'max_nbr_jobs_allowed',
          label:
            'Max number of Jobs per each Worker. 6 jobs means 3 orders in pick-drop scenario.'
        },
        {
          $formkit: 'number',
          name: 'late_delivery_tolerance_max_minutes',
          label:
            'The maximum minutes allowed for late delivery. It applies only to Drop Off job.'
        },
        {
          $formkit: 'number',
          name: 'realtime_env_update_flag',
          label:
            'Whether or not update parameter to env in realtime. 1 means yes, 0 means no'
        },
        {
          $formkit: 'text',
          name: 'merge_over_free_hour_list',
          label:
            'list of hours when algorithm prioritize merging, seperated by ;. For example 11;12 means from 11am to 12am'
        },
        {
          $formkit: 'number',
          name: 'kmedoid_radius_max_meters',
          label:
            "The maximum distance in meters that the algorithm can search for workers. It is measured from order's start/pick site."
        },
        {
          $formkit: 'number',
          name: 'max_meters_radius_merge_pick',
          label: 'Pick max meters radius_merge_pick'
        },
        {
          $formkit: 'number',
          name: 'max_meters_radius_merge_drop',
          label: 'Drop Max Meters for radius_merge'
        },
        {
          $formkit: 'number',
          name: 'max_meters_radius_merge_drop_scaling_distance_km',
          label:
            'Scaling factor for radius_merge in KM. Examples: starting at 1500 * (1 + 20 / 20)==3000, 1500 * (1 + 40 / 20)  == 4500'
        },
        {
          $formkit: 'number',
          name: 'min_meters_merge_candidate_drop_radius',
          label:
            'Minimum meters of two drop off sites to be considered to merge'
        },
        {
          $formkit: 'number',
          name: 'same_area_radius_max_meters',
          label:
            'The maximum distance that same area idle workers take the order immediately. The closest worker will take first.'
        },
        {
          $formkit: 'number',
          name: 'different_area_radius_max_meters',
          label:
            'The maximum distance that other area idle workers take the order immediately. The closest worker will take first.'
        },
        {
          $formkit: 'text',
          name: 'env_start_datetime',
          label: 'Team env start datetime (string, format YYYY-MM-DDTHH:MM:SS)'
        },
        {
          $formkit: 'number',
          name: 'planning_working_days',
          label: 'Number of working days in planning Window (integer)'
        },
        {
          $formkit: 'number',
          name: 'fixed_env_start_day_flag',
          label:
            'To fix env system time or not. 1 means yes: env starts and then pause the whole day, 0 means false: System current time'
        },
        {
          $formkit: 'number',
          name: 'rolling_every_day',
          label: 'rolling_every_day (1 means yes, 0 means no])'
        },
        {
          $formkit: 'text',
          name: 'weekly_working_days',
          label: 'list of working days in each week. 0 means Sunday'
        },
        {
          $formkit: 'text',
          name: 'default_requested_primary_worker_code',
          label: 'default requested primary_worker_code'
        },
        {
          $formkit: 'number',
          name: 'scoring_factor_standard_travel_minutes',
          label: 'standard travel minutes (scoring factor, integer)'
        },
        {
          $formkit: 'number',
          name: 'worker_job_min_minutes',
          label: 'worker job min minutes (integer)'
        },
        {
          $formkit: 'number',
          name: 'respect_initial_travel',
          label:
            'Whether respect initial travel or not (1 as true/yes, 0 as not)'
        },
        {
          $formkit: 'number',
          name: 'horizon_start_minutes',
          label: 'horizon start minutes (integer)'
        },
        {
          $formkit: 'number',
          name: 'travel_speed_km_hour',
          label: 'travel_speed_km_hour (integer)'
        },
        {
          $formkit: 'number',
          name: 'travel_min_minutes',
          label: 'travel_min_minutes (integer)'
        },
        {
          $formkit: 'text',
          name: 'worker_icon',
          label: 'worker_icon  (fontawesome icon)'
        },
        {
          $formkit: 'text',
          name: 'job_icon',
          label: 'job_icon (fontawesome icon)'
        },
        {
          $formkit: 'number',
          name: 'job_address_flag',
          label: 'job_address_flag (boolean ,one true,zero false)'
        },
        {
          $formkit: 'number',
          name: 'begin_skip_minutes',
          label: 'The number of minutes skipped at the start of the task'
        },
        {
          $formkit: 'text',
          name: 'inner_slot_planner',
          label: 'Inner Slot Planner Type'
        },
        {
          $formkit: 'text',
          name: 'requested_skills',
          label:
            'Available Skills (as strings) for Workers and Jobs, seperated by comma'
        },
        {
          $formkit: 'text',
          name: 'reset_dataset',
          label:
            'DO NOT USE. reset data. 1 mean yes, and to remove all data each time to reset.'
        },
        {
          $formkit: 'text',
          name: 'simulation_log_dir',
          label: 'Simulation log file path.'
        },
        {
          $formkit: 'number',
          name: 'use_zulip',
          label: 'Whether or not use zulip for sending job to worker'
        }
      ]
    };
  }
};
</script>
