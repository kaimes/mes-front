<template>
  <v-dialog :value="isShow" max-width="600" no-click-animation persistent>
    <v-card>
      <v-card-title class="text-h5"> WARNING </v-card-title>
      <v-card-text v-if="data.status == 1">
        Job planner is running in progress, please try again later.
      </v-card-text>
      <v-card-text v-if="data.status == 2">
        There are <span class="job-sp">{{ data.done_job_counts }}</span> job(s),
        are you sure to plan all of them now?
      </v-card-text>
      <v-card-text v-if="data.status == 3">
        The left usage of your Dispatch license is less than the job volume.
        You can renew your license by visiting
        <a href="https://market-intl.console.aliyun.com/" target="_blank"
          >Alibaba Cloud International Cloud Marketplace
        </a>
        Thanks for the cooperation !
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :color="
            data.status === 1
              ? 'green darken-1'
              : data.status === 2
              ? 'blue darken-1'
              : 'green darken-1'
          "
          variant="text"
          @click="closeHandler"
        >
          {{ data.status !== 2 ? 'OK' : 'Cancel' }}
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          @click="continueOK"
          v-if="data.status == 2"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'JobsCheckDialog',
  data() {
    return {};
  },
  mounted() {
    // console.log('props....', this )
  },
  props: {
    isShow: {
      type: Boolean // 是否展示dialog
    },
    data: {
      type: Object
    }
  },
  methods: {
    closeHandler() {
      this.$emit('close');
    },
    continueOK() {
      this.$emit('ok');
    }
  }
};
</script>


<style  scope>
.status_stop_tips {
  color: #ff5252;
}
.job-sp {
  color: #1976d2;
  margin: 0 3px;
}
</style>

