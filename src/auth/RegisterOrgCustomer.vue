<template>
  <ValidationObserver v-slot="{ invalid, validated }">
    <v-card class="mx-auto" max-width="500" style="margin-top: -140px;">
      <!-- <v-card class="mx-auto ma-4" max-width="600" flat outlined style="margin-top: -64px;"> -->
      <v-card-title>Register as a Customer</v-card-title>
      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field v-model="full_name" label="Name" required></v-text-field>
              </v-col> 
              <v-col cols="12" md="12">
                <ValidationProvider name="Email" rules="required|email" immediate>
                  <v-text-field
                    v-model="email"
                    label="Email (It can NOT be modified later on...)"
                    slot-scope="{ errors, valid }"
                    :error-messages="errors"
                    :success="valid"
                    required
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
              <v-col cols="12" md="12">
                <ValidationProvider name="Password" rules="required|password:@confirm" immediate>
                  <v-text-field
                    v-model="password"
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
                <ValidationProvider name="confirm" rules="required" immediate>
                  <v-text-field
                    v-model="re_password"
                    :type="'password'"
                    label="confirm password"
                    slot-scope="{ errors, valid }"
                    :success="valid"
                    :error-messages="errors"
                    required
                  ></v-text-field>
                </ValidationProvider>
              </v-col>
      <v-col cols="12" md="12">
        <ValidationProvider name="Region" rules="required" immediate>
          <v-select
            v-model="teamCode"
            :items="teamListItems"
            label="Select Region"
            slot-scope="{ errors, valid }"
            :error-messages="errors"
            :success="valid"
            hint="Select Region to work in"
            clearable
            required
          ></v-select>
        </ValidationProvider>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-list-item lines="three">
          <!-- <v-list-item-content> -->
            <v-list-item-subtitle>
              Already have an account?
              <router-link :to="{ path: '/login' }">Login</router-link>
            </v-list-item-subtitle>
          <!-- </v-list-item-content> -->
          <v-row align="center" justify="end" style="width:50px">
            <v-btn color="info" @click="check_password()" :disabled="invalid || !validated">
              Register
              <template v-slot:loader>
                <v-progress-linear indeterminate color="white" />
              </template>
            </v-btn>
          </v-row>
        </v-list-item>
      </v-card-actions>
      <CreateEditDialog />
    </v-card>
  </ValidationObserver>
</template>

<script>
import { mapActions } from "vuex";

import { mapFields } from "vuex-map-fields";
import CreateEditDialog from "./CreateEditDialog.vue";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import OrgApi from "@/org/api";
extend("email", email);

extend("required", {
  ...required,
  message: "This field is required",
});
extend("password", {
  params: ["target"],
  validate(value, { target }) {
    return value === target;
  },
  message: "Password confirmation does not match",
});
export default {
  components: {
    CreateEditDialog,
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      email: "",
      password: "",
      re_password: "",
      org_code: "",
      en_code: "",
      full_name:"",
      teamCode:"london",
      teamListItems:["london","frankfurt"],
      teamListDict:{
        london:{id:1, code:	"frankfurt"},
	      frankfurt:{id:626282434, code:	"london"},
      }
};
  },
  methods: {
    ...mapActions("auth", [
      "register",
      "showCreateEditDialog",
      "setRegisterCode",
    ]),
    isSucceedPassword(s) {
      var regu = "^[0-9a-zA-Z]{8,16}$";
      var re = new RegExp(regu);
      if (re.test(s)) {
        return true;
      } else {
        return false;
      }
    },
    addUser2FixedOrg( ) { 

  },
    check_password() {
      if (!this.password || !this.re_password) {
        this.$store.commit(
          "app/SET_SNACKBAR",
          {
            text: "Please enter the  password.",
            color: "red",
          },
          { root: true }
        );
        return false;
      }
      if (!this.isSucceedPassword(this.password)) {
        this.$store.commit(
          "app/SET_SNACKBAR",
          {
            text: "Please enter a password of 8-16 digits plus letters.",
            color: "red",
          },
          { root: true }
        );
        return false;
      }
      if (this.password != this.re_password) {
        this.$store.commit(
          "app/SET_SNACKBAR",
          {
            text: "The two passwords are inconsistent.",
            color: "red",
          },
          { root: true }
        );
        return false;
      } 
      let param = {
        email:this.email,
        password:this.password,
        en_code:null,
        org_code:"diskdemo",
        full_name:this.full_name,
        role:"Customer",
        default_team_id:this.teamListDict[this.teamCode].id,
      } 
      this.register(param);
      // this.$store.commit(
      //   "app/SET_SNACKBAR",
      //   { text: "Registion done..." },
      //   { root: true }
      // );
    },
  },
  watch: {
    org_code: function (newData) {
      if (newData) {
        this.en_code = "";
      }
    },
    en_code: function (newData) {
      if (newData) {
        this.org_code = "";
      }
    },
  },
  computed: {
    // ...mapFields("auth", ["org.en_code"]),
  },
};
</script>

<style scoped></style>
