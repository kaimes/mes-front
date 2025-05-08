<template>
  <v-container fluid>
    <!-- <new-edit-sheet /> -->
    <!-- <div class="headline">Plugins</div> -->
    <v-col cols="12" md="12">
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="q"
            append-icon="search"
            :label="$t('pluagins.search_tips')"
            single-line
            hide-details
            clearable
          />
        </v-card-title>
        <v-data-table-server
          :headers="headers"
          :items="items"
          show-current-page
          :items-length="total || 0"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          :loading="loading"
          v-model:sort-by="sortBy"
          v-model:sort-desc.sync="descending"
          :loading-text="$t('pluagins.loading')"
        >
          <!-- <template v-slot:item.author="{ item }">
                <a
                  :href="item.author_url"
                  target="_blank"
                  style="text-decoration: none"
                >
                  {{ item.author }}
                  <v-icon small>open_in_new</v-icon>
                </a>
              </template> -->

          <template v-slot:[`item.enabled`]="{ item }">
            <v-checkbox v-model="item.enabled" disabled></v-checkbox>
          </template>

          <template v-slot:[`item.multiple`]="{ item }">
            <v-checkbox v-model="item.multiple" disabled></v-checkbox>
          </template>

          <template v-slot:[`item.required`]="{ item }">
            <v-checkbox v-model="item.required" disabled></v-checkbox>
          </template>
          <!-- <template v-slot:item.action="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="editShow(item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template> -->
        </v-data-table-server>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';
import NewEditSheet from '@/plugin/editSheet.vue';
export default {
  name: 'PluginTable',

  components: {
    NewEditSheet
  },
  data() {
    return {

    };
  },

  computed: {
    ...mapFields('plugin', [
      'table.options.q',
      'table.options.page',
      'table.options.itemsPerPage',
      'table.options.sortBy',
      'table.options.descending',
      'table.loading',
      'table.rows.items',
      'table.rows.total'
    ]),
    headers(){
return [
        { title: this.$t("pluagins.table.slug"), value: 'slug', sortable: true },
        { title: this.$t("pluagins.table.title"), value: 'title', sortable: true },
        // { title: "Author", value: "author", sortable: true },
        { title: this.$t("pluagins.table.version"), value: 'version', sortable: true },
        { title: this.$t("pluagins.table.enabled"), value: 'enabled', sortable: true },
        { title: this.$t("pluagins.table.Required"), value: 'required', sortable: true },
        { title: this.$t("pluagins.table.multiple_allowed"), value: 'multiple', sortable: true },
        { title: this.$t("pluagins.table.type"), value: 'type', sortable: true },
        {
          title: '',
          value: 'action',
          sortable: false,
          align: 'end'
        }
      ]
    }
    
  },

  mounted() {
    this.getAll({});

    this.$watch(
      (vm) => [vm.page],
      () => {
        this.getAll();
      }
    );

    this.$watch(
      (vm) => [vm.q, vm.itemsPerPage, vm.sortBy, vm.descending],
      () => {
        this.page = 1;
        this.getAll();
      }
    );
  },

  methods: {
    ...mapActions('plugin', ['getAll', 'editShow'])
  }
};
</script>
