<template>
  <v-combobox
    v-model="order"
    :items="items"
    item-title="order_code"
    v-model:search="search"
    :menu-props="{ maxHeight: '400' }"
    :label="label"
    :loading="loading"
    hint="select a order."
    message="This field is required"
    required
    :hide-details="hideDetails"
    auto-select-first
    @update:search="fetchData({ q: $event })"
    :rules="rules"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No Orders matching "
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
import API from "@/order_admin/order/api";
import { cloneDeep, debounce } from "lodash";
import { useOrderStore } from "./storePinia";
import { mapActions } from "pinia";

export default {
  name: "OrderSelect",
  props: {
    rules: Array,
    value: {
      type: Object,
      default: function () {
        return {};
      },
    },
    hideDetails: {
      type: Boolean,
      default: true,
    },
    label: {
      type: String,
      default: function () {
        return "Order";
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
    order: {
      get() {
        return cloneDeep(this.value);
      },
      set(value) {
        if (!value) return;
        const { order_code } = value;
        //
        this.SET_order_page_model(value);
        this.$emit("input", order_code);
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
      API.getAll(filterOptions).then((response) => {
        this.items = response.data.items;
        this.loading = false;
      });
    },

    ...mapActions(useOrderStore, ["SET_order_page_model"]),
  },
};
</script>
