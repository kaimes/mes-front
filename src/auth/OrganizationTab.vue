<template>
  <ValidationObserver v-slot="{ invalid, validated }">
    <div class="organization_wrap">
      <v-card class="mx-auto" max-width="580">
        <v-card-title class="card_title">Account Initialiation</v-card-title>
        <v-tabs v-model="tab" centered>
          <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
          <v-window v-model="tab">
            <!--org existing  -->
            <v-window-item>
              <v-form>
                <v-container>
                  <v-row class="organization_login_row">
                    <v-col cols="12" md="12">
                      <ValidationProvider name="orgCode" rules="required" immediate>
                        <v-text-field
                          v-model="existingFormData['organization_code']"
                          label="Organization Code"
                          slot-scope="{ errors, valid }"
                          :error-messages="errors"
                          :success="valid"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <ValidationProvider name="userName" rules="required|email" immediate>
                        <v-text-field
                          v-model="existingFormData['username']"
                          label="Organization Owner Name"
                          slot-scope="{ errors, valid }"
                          :error-messages="errors"
                          :success="valid"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <ValidationProvider name="Password" rules="required" immediate>
                        <v-text-field
                          v-model="existingFormData['password']"
                          :type="'password'"
                          label="Password"
                          slot-scope="{ errors, valid }"
                          :success="valid"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>

              <v-list-item>
                <v-row align="center" justify="end" class="organization_login_row">
                  <v-btn
                    color="primary"
                    @click="organizationLogin(existingFormData)"
                    :disabled="invalid || !validated"
                  >OK</v-btn>
                </v-row>
              </v-list-item>
            </v-window-item>

            <!-- create -->
            <v-window-item>
              <v-form>
                <v-container>
                  <v-row class="organization_login_row">
                    <v-col cols="12" md="12">
                      <ValidationProvider name="orgCode" rules="required" immediate>
                        <v-text-field
                          v-model="createFormData['organization_code']"
                          label="Organization Code"
                          slot-scope="{ errors, valid }"
                          :error-messages="errors"
                          :success="valid"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <ValidationProvider name="userName" rules="required|email" immediate>
                        <v-text-field
                          v-model="createFormData['username']"
                          label="User Name"
                          slot-scope="{ errors, valid }"
                          :error-messages="errors"
                          :success="valid"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <ValidationProvider name="Password" rules="required" immediate>
                        <v-text-field
                          v-model="createFormData['password']"
                          :type="'password'"
                          label="Password"
                          slot-scope="{ errors, valid }"
                          :success="valid"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                    <v-col cols="12" md="12">
                      <ValidationProvider name="confirmPassword" rules="required" immediate>
                        <v-text-field
                          v-model="createFormData['confirmPassword']"
                          :type="'password'"
                          label="Confirm Password"
                          slot-scope="{ errors, valid }"
                          :success="valid"
                          :error-messages="errors"
                          required
                        ></v-text-field>
                      </ValidationProvider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>

              <v-list-item>
                <v-row align="center" justify="end" class="organization_login_row">
                  <v-btn
                    color="primary"
                    @click="organizationCreate(createFormData)"
                    :disabled="invalid || !validated"
                  >OK</v-btn>
                </v-row>
              </v-list-item>
            </v-window-item>
          </v-window>
        </v-tabs>
      </v-card>
    </div>
  </ValidationObserver>
</template>

<script>
//disabled
import { mapActions, mapState } from "vuex";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
extend("email", email);

extend("required", {
  ...required,
  message: "This field is required",
});
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      existingFormData: {
        organization_code: "",
        username: "",
        password: "",
      },
      createFormData: {
        organization_code: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      tab: null,
      items: ["User Existing Organization", "Create New Organization"],
    };
  },
  mounted() {},
  methods: {
    ...mapActions("auth", ["organizationLogin", "organizationCreate"]),
  },
  computed: {
    ...mapState("auth", ["userInfo", "instance_id"]),
  },
};
</script>

<style scoped>
.organization_wrap .v-tab {
  text-transform: none !important;
}
.organization_login_row {
  padding: 0px 10px;
}
.card_title {
  padding-left: 20px !important;
}
</style>
