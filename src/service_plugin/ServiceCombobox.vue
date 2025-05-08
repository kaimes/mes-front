<template>
  <!-- <ValidationProvider :rules="rules" immediate> -->
  <v-combobox
    v-model="datas"
    :items="items"
    item-title="code"
    v-model:search="search"
    :label="label"
    :loading="loading"
    @update:search="getFilteredData({ q: $event })"
    hint="select a item."
    auto-select-first
    :rules="[rules.required]"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-title>
          No Item matching "
          <strong>{{ search }}</strong
          >"
        </v-list-item-title>
      </v-list-item>
    </template>
    <template v-slot:append-item>
      <v-list-item v-if="more" @click="loadMore()">
        <v-list-item-subtitle>Load More</v-list-item-subtitle>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
import { required } from '@/util/form';
import ServiceApi from '@/service/api';
import { cloneDeep, debounce } from 'lodash';
export default {
  name: 'ServiceCombobox',
  props: {
    value: {
      type: Object,
      default: function () {
        return {};
      }
    },
    label: {
      type: String,
      defualt: ''
    }
  },
  components: {},
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
    datas: {
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
    }
  },

  created() {
    this.fetchData({});
  },

  methods: {
    // requeires(value) {
    //   return !!value || 'this filed is Required.';
    // },
    loadMore() {
      this.numItems = this.numItems + 5;
      this.getFilteredData({ q: this.search, itemsPerPage: this.numItems });
    },
    fetchData(filterOptions) {
      this.error = null;
      this.loading = true;
      ServiceApi.getAll(filterOptions).then((response) => {
        this.items = response.data.items;
        this.total = response.data.total;

        if (this.items.length < this.total) {
          this.more = true;
        } else {
          this.more = false;
        }

        this.loading = false;
      });
    },
    getFilteredData: debounce(function (options) {
      this.fetchData(options);
    }, 500)
  }
};
</script>
