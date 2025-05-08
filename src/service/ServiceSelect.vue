<template>
  <v-combobox
    v-model="service"
    :items="items"
    v-model:search="search"
    :menu-props="{ maxHeight: '400' }"
    item-title="code"
    label="Planner"
    placeholder="Type to Search Planner"
    :rules="rules"
    :loading="loading"
    auto-select-first
    hint="A Planner for your team."
    message="This field is required"
    required
  >
  <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No Planner matching "
          <strong>{{ search }}</strong
          >".
        </v-list-item-title>
      </v-list-item>
    </template>

  </v-combobox>

</template>

<script>
import ServiceApi from '@/service/api';
import { cloneDeep } from 'lodash';
export default {
  name: 'ServiceSelect',

  props: {
    rules: Array,
    value: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  components: {
    // ValidationProvider
  },
  data() {
    return {
      loading: false,
      search: null, 
      items: []
    };
  },
  computed: {
    service: {
      get() {
        return cloneDeep(this.value);
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  created() {
    this.fetchData({ itemsPerPage: 10 });
  },

  methods: {
    fetchData(filterOptions) {
      this.error = null;
      this.loading = true;
      ServiceApi.getAll(filterOptions).then((response) => {
        this.items = response.data.items;
        this.loading = false;
      });
    }
  },

};
</script>
