<template>
  <div class="register">
    <div class="register-header"></div>
    <div class="register-body">
      <v-form
          @submit.prevent="check_password({ email, password })"
          v-slot="{ isValid }"
          ref="vform"
      >
        <v-card class="mx-auto" elevation="0" max-width="500">
          <v-card-title>Register a New User</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                    v-model="email"
                    label="Email (It can NOT be modified later on...)"
                    required
                    :rules="[rules.required, rules.email]"
                    name="Email"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                    v-model="password"
                    :append-icon="hideOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="() => (hideOldPass = !hideOldPass)"
                    :type="hideOldPass ? 'password' : 'text'"
                    label="Password"
                    :rules="[rules.required]"
                    name="Password"
                    required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                    v-model="re_password"
                    :append-icon="hideOldPass ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="() => (hideOldPass = !hideOldPass)"
                    :type="hideOldPass ? 'password' : 'text'"
                    label="Password"
                    required
                    name="confirm"
                    :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-tabs v-model="tab">
                  <v-tab value="create">create organization</v-tab>
                  <v-tab value="join">join organization</v-tab>
                </v-tabs>

                <v-window v-model="tab">
                  <v-window-item value="create">
                    <v-card flat>
                      <v-text-field
                          v-model="org_code"
                          label="please enter organization code."
                          required
                      ></v-text-field>
                    </v-card>
                  </v-window-item>

                  <v-window-item value="join">
                    <v-card flat>
                      <v-text-field
                          v-model="en_code"
                          label="please enter organization invitation code"
                          required
                      ></v-text-field>
                    </v-card>
                  </v-window-item>
                </v-window>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <div class="text-subheader-2 pl-4 text-medium-emphasis">
              Already have an account?
              <router-link :to="{ path: '/login' }">Login</router-link>
            </div>
            <v-spacer />
            <v-btn
                type="submit"
                variant="flat"
                color="primary"
                :loading="loading"
                :disabled="!isValid.value"
            >
              Submit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
  </div>
</template>

<script>
import { required, email } from '@/util/form';
import { mapActions } from "pinia";
import { toast } from "vue3-toastify";
import { useAuthStore } from "./storePinia";

export default {
  setup() {
    return {
      rules: { required, email }
    };
  },
  name: 'Register',
  data() {
    return {
      loading: false,
      email: '',
      password: '',
      re_password: '',
      org_code: '',
      en_code: '',
      sample_data: 'no_data',
      planner_code: 'single_area_code_cvrp',
      hideOldPass: true,
      tab: null
    };
  },
  mounted() {
    this.$refs.vform.validate(); // 手动触发表单校验
  },
  methods: {
    ...mapActions(useAuthStore, [
      "register",
    ]),
    isSucceedPassword(s) {
      var regu = '^[0-9a-zA-Z]{8,32}$';
      var re = new RegExp(regu);
      if (re.test(s)) {
        return true;
      } else {
        return false;
      }
    },
    check_password() {
      if (!this.password || !this.re_password) {
        toast.error("Please enter the  password.", {
          position: "bottom-center",
          autoClose: 30000
        });
        return false;
      }
      if (!this.isSucceedPassword(this.password)) {
        toast.error("Please enter a password of 8-16 digits plus letters.", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }
      if (this.password !== this.re_password) {
        toast.error("The two passwords are inconsistent.", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }
      if (!this.en_code && !this.org_code) {
        toast.error("organization code or organization invitation code is necessary.", {
          position: "bottom-center",
          autoClose: 60000
        });
        return false;
      }
      this.loading = true;
      this.register({
        email: this.email,
        password: this.password,
        en_code: this.en_code,
        org_code: this.org_code,
        import_sample_data: this.sample_data,
        planner_code: this.planner_code
      }).finally(() => {
        this.loading = false;
      });
    }
  },
  watch: {
    org_code: function (newData) {
      if (newData) {
        this.en_code = '';
      }
    },
    en_code: function (newData) {
      if (newData) {
        this.org_code = '';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.register {
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
