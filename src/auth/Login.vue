<template>
  <div class="login">
    <div class="login-header"></div>
    <div class="login-body">
      <v-form @submit.prevent v-slot="{ isValid }" ref="vform">
        <v-card class="mx-auto bg-white" elevation="0" max-width="600">
          <v-card-title>
            {{ $t("login.title") }}
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                    v-model="email"
                    :label="$t('login.email')"
                    name="Eamil"
                    @keyup.enter="handleLogin"
                    :rules="[rules.required, rules.email]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-text-field
                    v-model="password"
                    :append-icon="hideOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="() => (hideOldPass = !hideOldPass)"
                    :type="hideOldPass ? 'password' : 'text'"
                    :label="$t('login.password')"
                    name="Password"
                    @keyup.enter="handleLogin"
                    :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="flat" @click="goRegister()">{{
                $t("login.register")
              }}</v-btn>
            <v-spacer />
            <v-btn
                color="primary"
                variant="flat"
                :loading="loginLoadingBtn"
                :disabled="!isValid.value"
                @click="handleLogin"
            >{{ $t("login.login") }}</v-btn
            >

          </v-card-actions>
        </v-card>
      </v-form>
    </div>
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { required, email } from "@/util/form";
import { mapState, mapActions } from "pinia";
import { useAuthStore } from "./storePinia";

import Internationalization from "@/components/locals/Internationalization.vue";

// import JobsStatusWaringDialog from '../components/JobsStatusWaringDialog.vue';
import { useI18n } from "vue-i18n";

import { useRoute } from "vue-router";


export default {
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    console.log("token", route.query.token);
    const token = route.query.token;
    if (token){
      authStore.mesLogin(token)
    }
    
    const { locale } = useI18n();
    function change_language(type) {
      locale.value = type;
    }
    return {
      rules: { required, email },
      change_language,
    };
  },
  components: {
    Internationalization,
  },
  data() {
    return {
      language_items: [
        { title: "简体中文", tag: "zh" },
        { title: "English", tag: "en" },
      ],

      email: "",
      password: "",
      tab: null,
      items: ["User Existing Organization", "Create New Organization"],
      hideOldPass: true,
    };
  },
  beforeDestroy() {
    this.$store.commit("auth/SET_TIPS_COUNT", 0);
  },
  methods: {
    goRegister() {
      this.$router.push({ path: "register" });
    },
    handleLogin() {
      this.tabBasicLogin({
        email: this.email,
        password: this.password,
        type: 'login',
      });
    },
    // 不再重复提示Jobs
    ...mapActions(useAuthStore, [
      "basicLogin",
      "getCloudMarketLogin",
      "tabBasicLogin",
      "setBillingStatus",
      "mesLogin"
    ]),
  },
  computed: {
    ...mapState(useAuthStore, [
      "userInfo",
      "marketLoginData",
      "isShowOrganizationTAB",
      "organizationStatus",
      "loginLoadingBtn",
      "jobsRestData",
      "jobsWaringDialogFlag",
    ]),
  },
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  height: 100vh;
  background-color: #F5F5F7;
  &-header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 260px;
    background-color: #1867C0;
    z-index: 0;
  }
  &-body {
    padding-top: 120px;
    z-index: 2;
  }
}
</style>

