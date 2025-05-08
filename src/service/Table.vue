<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <!-- <div class="headline">Services</div> -->

    <v-col cols="12" md="12">
      <v-card>
        <v-list-item lines="two">
          <template #append>
            <v-row>
              <v-spacer />

              <v-btn color="primary" dark class="mb-2" @click="createEditShow()"
                >{{$t("global.new")}}</v-btn
              >
            </v-row>
          </template>
        </v-list-item>

        <v-card-title>
          <v-text-field
            v-model="q"
            append-icon="mdi-magnify"
            :label="$t('services.search_hint')"
            single-line
            hide-details
            clearable
          />
        </v-card-title>
        <v-data-table-server
          :headers="headers"
          :items="items"
          v-model:page="page"
          v-model:items-per-page="itemsPerPage"
          :items-length="total || 0"
          v-model:sort-by="sortBy"
          v-model:sort-desc="descending"
          :loading="loading"
          show-current-page
          loading-text="Loading... Please wait"
        >
          <!-- :sort-desc.sync="descending" -->

          <!-- <template v-slot:item.action="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="createEditShow(item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeShow(item)">
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>-->
          <template v-slot:[`item.description`]="{ item }">
            <v-tooltip bottom max-width="500px" :text="item.description">
              <template v-slot:activator="{ props }">
                <span class="overflow_ellipsis_col" v-bind="props">{{
                  item.description
                }}</span>
              </template>
            </v-tooltip>
          </template>
          <template v-slot:[`item.action`]="{ item }">
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
import DeleteDialog from '@/service/DeleteDialog.vue';
import NewEditSheet from '@/service/NewEditSheet.vue';
export default {
  name: 'ServiceTable',

  components: {
    DeleteDialog,
    NewEditSheet
  },
  data() {
    return {
   
    };
  },

  computed: {
    ...mapFields('service', [
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
        { title: 'code', value: 'code', sortable: true },
        { title: this.$t("services.table.name"), value: 'name', sortable: true },
        { title: this.$t("services.table.description"), value: 'description', sortable: true },
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
  destroyed() {
    this.closeCreateEdit();
  },
  methods: {
    ...mapActions('service', [
      'getAll',
      'createEditShow',
      'removeShow',
      'closeCreateEdit'
    ])
  }
};
</script>
<style>
.table_action_icon {
  white-space: nowrap;
}
</style>
