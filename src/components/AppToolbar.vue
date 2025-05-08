<template>
  <v-app-bar clipped-left clipped-right app color="#2A343E" dark height="68">
    <CreateRegister />
    <template v-if="isMobile">
      <div class="pl-4 pr-4">
        <v-app-bar-nav-icon
          class="icon-white-background"
          @click="handleDrawerToggle"
        />
      </div>
    </template>
    <template v-else>
      <router-link class="logo" :to="{ path: '/rolling_list' }">
        <div class="hidden-sm-and-down">
          <img src="/static/images/logo.svg" alt="British Steel" />
        </div>
      </router-link>
    </template>
    <v-spacer />
    <v-toolbar-items>
      <v-btn readonly class="text-none" density="compact" variant="text" color="white">
        {{ defaultMillCode }}
      </v-btn>
      <mill-picker />
      <Internationalization />
      <v-tooltip bottom :text="full_text">
        <template v-slot:activator="{ props }">
          <v-btn icon @click="handleFullScreen" v-bind="props">
            <v-icon class="icon-white-background">mdi-fullscreen</v-icon>
          </v-btn>
        </template>
      </v-tooltip>

      <v-menu
        transition="scale-transition"
        origin="top left"
        open-on-hover
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" v-bind="props">
            <v-avatar size="50px">
              <img
                v-if="userInfo && userInfo.thumbnail_photo_url"
                :src="userInfo.thumbnail_photo_url"
                :alt="userInfo.full_name"
              />
              <v-icon
                class="icon-white-background"
                icon="mdi-account-circle"
                size="large"
                v-else
              />
            </v-avatar>
          </v-btn>
        </template>
        <v-card min-width="420">
          <div class="d-flex align-center pa-6">
            <v-icon icon="mdi-account-circle" size="30px" />
            <v-spacer />
            <v-list-item
                class="text-h6"
                :title="userInfo?.email || '---'"
                :subtitle="userInfoSubtitle"
            ></v-list-item>
            <v-spacer />
            <v-tooltip text="Edit Password">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-lock-reset" v-bind="props" variant="plain" @click="handleUpdatePassword" />
              </template>
            </v-tooltip>
            <v-tooltip text="Logout">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-logout" v-bind="props" variant="plain" @click="logout" />
              </template>
            </v-tooltip>
          </div>
        </v-card>
      </v-menu>
    </v-toolbar-items>
    <update-password ref="updatePassword" />
  </v-app-bar>
</template>
<script>
//

import { mapActions, mapMutations } from "vuex";
import { mapFields } from "vuex-map-fields";
import CreateRegister from "@/org/CreateRegister.vue";
import Internationalization from "@/components/locals/Internationalization.vue";
import MillPicker from "@/components/MillPicker.vue";
import UpdatePassword from "./UpdatePassword.vue";

import { mapState } from "vuex";
import UserApi from "../auth/api";
import Util from "@/util";
let timer = null;
import { useI18n } from "vue-i18n";

export default {
  name: "AppToolbar",
  setup() {
    const { locale } = useI18n();
    function change_language(type) {
      locale.value = type;
    }
    return { change_language };
  },
  data() {
    return {
      template_create_invitation_code: [
        { text: "Create Invitation Code", icon: "mdi-plus" },
      ],

      full_text: "Fullscreen",
      instanceIdLength: localStorage.getItem("instance_id")?.length > 0,
      isBilling:
        window.location.pathname == "/my_order" ||
        window.location.pathname == "/my_billing",
    };
  },
  components: {
    CreateRegister,
    MillPicker,
    UpdatePassword,
    Internationalization,
  },
  // mounted() {
  //   this.handleJobsStatusFormat();
  // },
  computed: {
    ...mapState("gantt", ["plannerHealthCheckResultShowFlag"]),
    ...mapState("auth", [
      "userInfo",
      "defaultTeam",
      "defaultMillCode",
      "jobsRestData",
    ]),
    isMobile: function () {
      return this.$vuetify.display.mobile;
    },
    userInfoSubtitle() {
      console.log("this.userInfo", this.userInfo);
      if (!this.userInfo) {
        return "ERROR";
      } else {
        const roles = (this.userInfo.role || []).map((item) => item.name);
        return `Role: ${roles.join()} . Mill: ${this.defaultMillCode}`;
      }
    },
    queryString: {
      set(query) {
        this.$store.dispatch("search/setQuery", query);
      },
      get() {
        return this.$store.state.query;
      },
    },
    ...mapFields("org", ["selected.code"]),
  },
  mounted() {
    this.$store.dispatch("auth/getUserInfo"); // 获取
  },
  methods: {
    handleJobsStatusFormat() {
      timer = setInterval(() => {
        if (!this.userInfo) return;
        UserApi.getOrganization({ user_id: this.userInfo.default_team_id })
          .then((res) => {
            // console.log("res.....", res);
            const { organization_status } = res.data.data;
            organization_status == "1"
              ? localStorage.setItem("organizationStatus", "Avaiable")
              : organization_status == "2"
              ? localStorage.setItem("organizationStatus", "Stopped")
              : localStorage.setItem("organizationStatus", "Expired");
          })
          .catch((err) => {
            console.log("err....", err.response);
            clearInterval(timer);
            //            if (err.response.status === 401 || err.response.status === 506) {            }
          });
      }, 600000);
    },
    handleDrawerToggle() {
      this.$store.dispatch("app/toggleDrawerAction");
    },
    handleUpdatePassword() {
      this.$refs.updatePassword.handleShow(this.userInfo.id);
    },
    handleFullScreen() {
      let flag = Util.toggleFullScreen();
      if (!flag) {
        this.full_text = "Fullscreen";
      } else {
        this.full_text = "LaunchFullscreen";
      }
    },
    performSearch() {
      this.$store.dispatch("search/getResults", this.$store.state.query);
      this.$router.push("/search");
    },
    ...mapActions("auth", ["logout"]),
    ...mapActions("search", ["setQuery"]),
    ...mapMutations("search", ["SET_QUERY"]),
    ...mapMutations("gantt", ["SET_JOB_HEALTH_CHECK_RESULT_SHOW_FLAG"]),
    ...mapActions("org", ["showCreateEditDialog"]),
  },
  destroyed() {
    // console.log("clearJobsTimerclearJobsTimerclearJobsTimer");
    clearInterval(timer);
  },
};
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  height: 100%;
  img {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
    padding: 0 16px;
    object-fit: contain;
  }
}
.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0) !important;
}

.usage-title,
.usage-content {
  padding: 5px 16px;
}

.status_stop_tips {
  color: #ff5252;
}

/* 在你的CSS文件中 */
.icon-white-background {
  background-color: white;
  padding: 2px;
  border-radius: 50%;
}
</style>
