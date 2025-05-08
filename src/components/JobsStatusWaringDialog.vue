<template>
  <v-dialog :value="isShow" max-width="700" no-click-animation persistent>
    <v-card>
      <v-card-title class="text-h5"> WARNING </v-card-title>
      <v-card-text>
        <div
          v-if="
            jobsRestData.is_remind_stoped &&
            Number(jobsRestData.orgnaization_status) > 1
          "
          class="tips_rest"
        >
          Your Dispatch Licence has expired, job planner cannot be executed,
          only limited functionalities can be used.
        </div>
        <div v-else class="tips_rest">
          Your Dispatch Licence will expire in
          <span class="status_stop_tips">
            {{ jobsRestData.remaining_days }}
          </span>
          {{ jobsRestData.remaining_days > 1 ? 'days' : 'day' }}. Jobs left :
          <span class="status_stop_tips">
            {{ jobsRestData.remaining_counts }}/{{ jobsRestData.total_counts }}
          </span>
          (Left usage :<span class="status_stop_tips">
            {{
              jobsRestData.remaining_counts_percentage == '0.00' &&
              jobsRestData.remaining_counts > 0
                ? '0.01'
                : jobsRestData.remaining_counts_percentage
            }}
            %</span
          >)
        </div>
        <div class="link-wrap">
          You can renew your licence by visiting
          <a href="https://market-intl.console.aliyun.com/" target="_blank"
            >Alibaba Cloud International Cloud Marketplace </a
          >. Thanks for the coopertion.
        </div>
      </v-card-text>
      <div class="card-actions-wrap">
        <div style="flex: 1">
          <v-checkbox
            v-model="checkbox"
            label="Do Not Remind Again"
            @change="handleChange"
          ></v-checkbox>
        </div>
        <v-btn color="green darken-1" variant="text" @click="closeHandler">
          OK
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'JobsStatusWaringDialog',
  data() {
    return {
      checkbox: false
    };
  },
  props: {
    isShow: {
      type: Boolean // 是否展示dialog
    },
    jobsRestData: {
      type: Object // status状态
    }
  },
  methods: {
    closeHandler() {
      this.$emit('close');
    },
    handleChange(e) {
      console.log('e.....', e, this.checkbox);
      this.$emit('checkboxChange', e);
    }
  }
};
</script>


<style  scope>
.status_stop_tips {
  color: #ff5252;
}
.card-actions-wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 24px;
}

.tips_rest {
  font-size: 16px;
}

.link-wrap {
  margin-top: 20px;
  font-size: 16px;
}
</style>

