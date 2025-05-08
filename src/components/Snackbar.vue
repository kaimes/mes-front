<template>
  <v-snackbar v-model="show" :timeout="timeout">
    {{ text }}
    <v-btn variant="text" :color="color" @click="closeSnackBar">Close</v-btn>
  </v-snackbar>
</template>

<script>
// import { mapFields } from 'vuex-map-fields';
// import { mapActions } from 'vuex';
import { mapState, mapWritableState } from "pinia";
import { mapActions } from "pinia";
// import WorkerSelect from '@/worker/WorkerSelect.vue';

import { useAppStore } from "../app/storePinia";

import _ from "lodash";
export default {
  name: "SnackbarInfo",
  data() {
    return {};
  },
};
</script>
