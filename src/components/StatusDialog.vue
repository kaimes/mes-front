<template>
  <v-dialog :value="isShow" max-width="600">
    <v-card>
      <v-card-title class="text-h5"> WARNING </v-card-title>
      <v-card-text v-if="organizationStatus === 'Stopped'">
        Organization Code is in
        <span class="status_stop_tips">“Stopped”</span>
        status, Planner cannot be executed, only limited functions can be used,
        please go to

        <a href="https://market-intl.console.aliyun.com/" target="_blank"
          >Alibaba Cloud International Cloud Marketplace
        </a>
        to renew the instance. Thanks for the cooperation!
      </v-card-text>
      <v-card-text v-if="organizationStatus === 'Expired'">
        Organization Code is in
        <span class="status_stop_tips"> “Expired” </span>
        status, service planner and create new business data related
        functionalities cannot be used, only history data can be edit or viewed,
        please go to
        <a
          href="https://market-intl.console.aliyun.com/"
          target="_blank"
          >Alibaba Cloud International Cloud Marketplace
        </a>
        to retrieve the instance and associcate the Organization Code again.
        Thanks for the cooperation !
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" variant="text" @click="closeHandler"> OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: "DialogStatusTips",
  data() {
    return {};
  },
  props: {
    isShow: {
      type: Boolean, // 是否展示dialog
    },
    organizationStatus: {
      type: String, // status状态
    },
  },
  methods: {
    closeHandler() {
      this.$emit("close");
    },
  },
};
</script>


<style  scope>
.status_stop_tips {
  color: #ff5252;
}
</style>

