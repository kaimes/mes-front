<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <v-text-field
              v-model="table.options.q"
              :label="$t('users.search_tip')"
              variant="underlined"
              bg-color="white"
              hide-details
              clearable
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              {{ $t("global.reset") }}
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                v-permission="`Search`"
            >
              {{ $t("global.search") }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="6" class="text-end">
          <v-btn
              v-permission="`Create`"
              class="text-none"
              color="primary"
              variant="flat"
              @click="addShow"
          >
            {{ $t("global.new")  }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
          show-current-page
          :headers="headers"
          :items="table.rows.items"
          :items-length="table.rows.total || 0"
          v-model:page="table.options.page"
          v-model:items-per-page="table.options.itemsPerPage"
          v-model:sort-by="table.options.sortBy"
          v-model:sort-desc="table.options.descending"
      >
        <!-- :sort-desc.sync="descending" -->

        <template v-slot:[`item.action`]="{ item }">
            <span class="table_action_icon">
              <v-icon small class="mr-2" @click="editShow(item)" v-permission="`Update`"
              >mdi-pencil</v-icon
              >
              <v-icon small class="mr-2" @click="editPassword(item)" v-permission="`Edit Password`"
              >mdi-lock-reset</v-icon
              >
              <v-icon small @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
            </span>
        </template>
        <template v-slot:[`item.role`]="{ item }">
            <span v-for="(role, index) in item.role" :key="index">
              {{ role.name }} &nbsp;&nbsp;
            </span>
        </template>
        <template v-slot:[`item.mill`]="{ item }">
            <span v-for="(mill, index) in item.mill" :key="index">
              {{ mill.code }} &nbsp;&nbsp;
            </span>
        </template>
      </v-data-table-server>
    </v-card>
    <new-edit-sheet />
    <delete-dialog />
    <password-form ref="passwordForm" />
  </v-container>
</template>

<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";
import NewEditSheet from "@/auth/editSheet.vue";
import DeleteDialog from "@/auth/DeleteDialog.vue";
import { useI18n } from "vue-i18n";
import PasswordForm from "./components/passwordForm.vue";
import { useAuthStore } from "./storePinia";


export default {
  name: "UserTable",

  components: {
    NewEditSheet,
    PasswordForm,
    DeleteDialog,
  },

  setup() {
    const { t } = useI18n();
    return { t };
  },

  data() {
    return {};
  },

  computed: {
    // ...mapFields('auth', [
    //   'table.options.q',
    //   'table.options.page',
    //   'table.options.itemsPerPage',
    //   'table.options.sortBy',
    //   'table.options.descending',
    //   'table.options.loading',
    //   'table.rows.items',
    //   'table.rows.total'
    // ]),

    ...mapState(useAuthStore, [
      "table",
      "dialogs",
      // 'table.options.q',
      // 'table.options.page',
      // 'table.options.itemsPerPage',
      // 'table.options.sortBy',
      // 'table.options.descending',
      // 'table.options.loading',
      // 'table.rows.items',
      // 'table.rows.total'
    ]),

    headers() {
      return [
        {
          title: this.$t("global.action"),
          value: "action",
          sortable: false,
          maxWidth: 100,
          minWidth: 100,
          fixed: true,
          align: "center",
        },
        {
          title: this.$t("users.table.account"),
          value: "email",
          sortable: true,
        },
        { title: this.$t("users.table.role"), value: "role", sortable: true },
        {
          title: this.$t("users.table.active"),
          value: "is_active",
          sortable: true,
        },
        {
          title: this.$t("users.table.current_mill"),
          value: "current_mill_code",
          sortable: true,
        }
      ];
    },
  },

  mounted() {
    this.getAll();

    this.$watch(
      (vm) => [vm.page],
      () => {
        this.getAll();
      }
    );
    this.$watch(
      (vm) => [
        vm.table.options.q,
        vm.table.options.page,
        vm.table.options.itemsPerPage,
        vm.table.options.sortBy,
        vm.table.options.descending,
      ],
      () => {
        this.getAll();
      }
    );
  },
  destroyed() {
    this.closeEdit();
    this.closeAdd();
  },
  methods: {
    ...mapActions(useAuthStore, [
      "getAll",
      "editShow",
      "removeShow",
      "closeEdit",
      "addShow",
      "closeAdd",
    ]),
    editPassword(item) {
      this.$refs.passwordForm.handleShow(item);
    },
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      handleSearch();
    },
  },
};
</script>
<style>
.table_action_icon {
  white-space: nowrap;
}
</style>
