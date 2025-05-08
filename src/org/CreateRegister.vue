<template>
  <v-dialog v-model="showCreateEdit" persistent max-width="600px">
    <!-- <ValidationObserver disabled v-slot="{ invalid, validated }"> -->
    <v-form @submit.prevent v-slot="{ isValid }">
      <v-card id="input-usage">
        <v-card-title>
          <span class="headline">Create Organization Invitation Code</span>
        </v-card-title>
        <v-card-text>
          <!-- <ValidationProvider name="role" rules="required" immediate> -->
          <v-select
            v-model="role"
            :items="role_item"
            label="User Role"
            hint="User Role"
            clearable
            required
            :rules="[rules.required]"
          ></v-select>
          <v-textarea
            :messages="['Invitation Code']"
            name="input-7-4"
            :value="register_code"
            append-icon="mdi-content-copy"
            prepend-icon="mdi-code-greater-than"
            @click:append="appendIconCallback"
            :readonly="true"
            solo
            label="Invitation Code"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="closeCreateEditDialog()">Cancel</v-btn>
          <v-btn
            color="info"
            variant="text"
            @click="
              addUserOrg({
                role: role,
                team: team,
                worker: select_worker,
                switch_worker: switch_worker
              })
            "
            :disabled="!isValid.value"
            >Create</v-btn
          >
        </v-card-actions>
      </v-card>
      <!-- </ValidationObserver> -->
    </v-form>
  </v-dialog>
</template>

<script>
// import { ValidationObserver, ValidationProvider, extend } from 'vee-validate';
// import { required } from 'vee-validate/dist/rules';
import { required } from '@/util/form';

import { mapActions } from 'vuex';
import { mapFields } from 'vuex-map-fields';
export default {
  setup() {
    return {
      rules: { required }
    };
  },
  name: 'CreateRegister',
  data() {
    return {
      switch_worker: true,
      select_worker: null,
      role_item: [
        'Worker',
        'Planner',
        'Owner',
        'Address API Admin',
        'VRP API Admin',
        'Address Normalization API Admin'
      ],
      role: 'Worker',
      team: null
    };
  },
  destroyed() {},
  computed: {
    ...mapFields('org', ['dialogs.showCreateEdit', 'register_code'])
  },

  methods: {
    ...mapActions('org', ['addUserOrg', 'closeCreateEditDialog', 'copy_back']),
    appendIconCallback() {
      if (this.register_code != '' && this.register_code != undefined) {
        const el = document.createElement('textarea');
        el.addEventListener('focusin', (e) => {
          e.stopPropagation();
        });
        el.value = this.register_code;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.copy_back(true);
      } else {
        this.copy_back(false);
      }
    }
  }
};
</script>
<style>
#input-usage .v-input__prepend-outer i,
#input-usage .v-input__append-outer button {
  color: #4caf50 !important;
}
#input-usage .v-input__append button {
  color: #4caf50 !important;
}
</style>
