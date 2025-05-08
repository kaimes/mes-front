<template>
  <v-combobox
    v-model="modeldata"
    :items="items"
    item-title="group_code"
    v-model:search="search"
    :menu-props="{ maxHeight: '400' }"
    :label="label"
    :loading="loading"
    :hide-details="false"
    hint="select a order group ."
    message="This field is required"
    required
    auto-select-first
    @update:search="fetchData({ q: $event })"
    :rules="rules"
  >
    <!-- :error-messages="errors" -->
    <!-- :success="valid" -->
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No Data matching "
          <strong>{{ search }}</strong
          >".
        </v-list-item-title>
      </v-list-item>
    </template>

    <!-- prepend-icon="mdi-account-multiple" -->
    <template v-slot:prepend>
      <v-icon color="primary" icon="mdi-account-multiple"></v-icon>
    </template>
  </v-combobox>
</template>

<script>
import Api from "@/semi_admin/semi/api";
import { cloneDeep, debounce } from "lodash";
export default {
  name: "OrderGroupSelect",
  props: {
    rules: Array,
    value: {
      type: Object,
      default: function () {
        return {};
      },
    },
    label: {
      type: String,
      default: function () {
        return "Order Group";
      },
    },
  },

  components: {},
  data() {
    return {
      loading: false,
      items: [],
      search: null,
    };
  },

  computed: {
    modeldata: {
      get() {
        return cloneDeep(this.value);
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  created() {
    this.fetchData({ itemsPerPage: 10 });
  },

  methods: {
    fetchData(filterOptions) {
      this.error = null;
      this.loading = true;
      Api.getOrderGroupAll(filterOptions)
        .then((response) => {
          this.items = response.data.items;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
