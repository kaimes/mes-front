<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-col cols="12" sm="12">
      <v-card>
        <v-list-item lines="two">
          <template #append>
            <v-row>
              <v-spacer />
              <v-btn color="primary" class="md-2" @click="createEditShow()"
                >
                {{ $t("services_pluagins.new") }}
              </v-btn>
            </v-row>
          </template>
        </v-list-item>

        <v-data-table-server
          :headers="headers"
          :items="items"
          :items-length="total || 0"
          :loading="loading"
          show-current-page
          loading-text="Loading... Please wait"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          v-model:sort-by="sortBy"
          v-model:sort-desc="descending"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <span class="table_action_icon">
              <v-icon small class="mr-2" @click="createEditShow(item)"
                >mdi-pencil</v-icon
              >
              <v-icon small @click="removeShow(item)">mdi-delete</v-icon>
            </span>
          </template>
        </v-data-table-server>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';
import DeleteDialog from '@/service_plugin/DeleteDialog.vue';
import NewEditSheet from '@/service_plugin/NewEditSheet.vue';
export default {
  name: 'ServicePluginTable',

  components: { DeleteDialog, NewEditSheet },

  data() {
    return {
     
    };
  },

  computed: {
    ...mapFields('service_plugin', [
      'table.options.q',
      'table.options.page',
      'table.options.itemsPerPage',
      'table.options.sortBy',
      'table.options.descending',
      'table.options.loading',
      'table.rows.items',
      'table.rows.total'
    ]),
    headers(){
          return [
        // { title: "ID", value: "id", sortable: true },
        { title: this.$t('services_pluagins.table.planner_service'), value: 'service.name', sortable: false },
        {
          title: this.$t('services_pluagins.table.plugin_type'),
          value: 'planning_plugin_type',
          sortable: false
        },
        { title: this.$t('services_pluagins.table.plugin_slug'), 
        value: 'plugin.slug', sortable: false },
        {
          title: '',
          value: 'actions',
          sortable: false,
          align: 'end'
        }
      ]
      } 
  },

  mounted() {
    this.getAll({});
    this.planning_plugin_types_list();
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
  destroyed() {
    this.closeCreateEdit();
  },
  methods: {
    ...mapActions('service_plugin', [
      'getAll',
      'createEditShow',
      'removeShow',
      'closeCreateEdit',
      'planning_plugin_types_list'
    ])
  }
};
</script>
<style>
.table_action_icon {
  white-space: nowrap;
}
</style>