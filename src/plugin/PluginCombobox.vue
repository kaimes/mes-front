<template>
  <!-- <ValidationProvider :rules="rules" immediate> -->
  <v-combobox
    v-model="plugin"
    :items="items"
    item-title="slug"
    v-model:search="search"
    :label="label"
    :loading="loading"
    @update:search="getFilteredData({ q: $event })"
    hint="select a item."
    required
    :rules="[rules.required]"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No Plugins matching "
          <strong>{{ search }}</strong
          >"
        </v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:append-item>
      <v-list-item v-if="more" @click="loadMore()">
        <!-- <v-list-item-content> -->
        <v-list-item-subtitle>Load More</v-list-item-subtitle>
        <!-- </v-list-item-content> -->
      </v-list-item>
    </template>
  </v-combobox>
  <!-- </ValidationProvider> -->
</template>

<script>
import { required } from '@/util/form';

import { mapFields } from 'vuex-map-fields';
import PluginApi from '@/plugin/api';
import { cloneDeep, debounce } from 'lodash';
import { ValidationProvider } from 'vee-validate';
export default {
  name: 'PluginCombobox',
  props: {
    value: {
      type: Object,
      default: function () {
        return {};
      }
    },
    label: {
      type: String,
      defualt: 'Plugins'
    }
  },
  components: {
    ValidationProvider
  },
  data() {
    return {
      loading: false,
      items: [],
      more: false,
      numItems: 5,
      search: null,
      rules: { required }
    };
  },

  computed: {
    plugin: {
      get() {
        return cloneDeep(this.value);
      },
      set(value) {
        if (typeof value === 'string') {
          let v = {
            slug: value
          };
          this.items.push(v);
        }
        this.$emit('input', value);
      }
    },
    ...mapFields('service_plugin', ['selected.planning_plugin_type'])
  },

  created() {
    this.fetchData();
  },

  methods: {
    loadMore() {
      this.numItems = this.numItems + 5;
      this.getFilteredData({ q: this.search, itemsPerPage: this.numItems });
    },
    fetchData() {
      this.error = null;
      this.loading = true;
      let that = this;
      let plug_type = this.planning_plugin_type || '';
      PluginApi.getByType(plug_type).then((response) => {
        this.items = response.data.items;
        this.total = response.data.total;

        if (this.items.length < this.total) {
          this.more = true;
        } else {
          this.more = false;
        }

        this.loading = false;
        // dispatch to father
        let data = response.data.items.filter((row) => row.slug == that.search);
        this.$emit('plugsDataFuc', data.length > 0 ? data[0] : null);
      });
    },
    getFilteredData: debounce(function (options) {
      this.fetchData();
    }, 500)
  },
  watch: {
    planning_plugin_type: function (newVal, oldVal) {
      this.fetchData();
    },
    search: function (newVal, oldVal) {
      this.fetchData();
    }
  }
};
</script>
