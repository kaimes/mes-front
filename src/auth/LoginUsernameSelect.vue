<template>
  <v-combobox
    v-model="auth"
    prepend-icon="mdi-account-box-outline"

    
    :items="items"
    item-title="email"
        v-model:search="search"
    :menu-props="{ maxHeight: '400' }"
    :label="label"
    :loading="loading"
    clearable
    auto-select-first
  >
    <template v-slot:no-data>
      <v-list-item>
        <!-- <v-list-item-content> -->
          <v-list-item-title>
            No Matching for Username "
            <strong>{{ search }}</strong
            >".
          </v-list-item-title>
        <!-- </v-list-item-content> -->
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
import { cloneDeep } from "lodash";
import { mapActions } from "vuex";
import { mapFields } from "vuex-map-fields";
export default {
  name: "LoginUsernameSelect",
  props: {
    value: {
      type: Object,
      default: function () {
        return {};
      },
    },
    label: {
      type: String,
      default: function () {
        return "Login Username";
      },
    },
  },

  data() {
    return {
      search: null,
    };
  },

  computed: {
    ...mapFields("auth", ["table.loading", "table.rows.items"]),
    auth: {
      get() {
        return cloneDeep(this.value);
      },
      set(value) {
        if (value == undefined || value == "") {
          value = null;
        }
        this.$emit("input", value);
      },
    },
  },

  mounted() {
    this.getAll({ itemsPerPage: 10 });
  },

  methods: {
    ...mapActions("auth", ["getAll"]),
  },
};
</script>
