<template>
  <v-container fluid>
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="3">
          <OrderSelect v-model="order_page_model.order_code" hide-details></OrderSelect>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="order_page_model.customer_code"
              :counter="10"
              :rules="nameRules"
              label="Customer No "
              hide-details
              variant="plain"
              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="order_page_model.address_line_1"
              :counter="10"
              :rules="nameRules"
              label="Address1"
              hide-details
              variant="plain"
              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="order_page_model.address_line_2"
              :counter="10"
              :rules="nameRules"
              label="Address2"
              hide-details
              variant="plain"
              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="order_page_model.address_line_3"
              :counter="10"
              :rules="nameRules"
              label="Address3"
              hide-details
              variant="plain"
              disabled
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field
              v-model="order_page_model.address_line_4"
              :counter="10"
              :rules="nameRules"
              label="Address4"
              hide-details
              variant="plain"
              disabled
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="3">
          <div class="d-flex ga-4 align-center">
            <v-btn
                class="text-none"
                color="#e3e3e3"
                variant="flat"
                @click="handleReset"
            >
              Reset
            </v-btn>
            <v-btn
                type="submit"
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
            >
              Search
            </v-btn>
          </div>
        </v-col> -->
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
          :footer-props="{
            'items-per-page-options': [5, 10, 20],
          }"
          :loading="table.loading"
          loading-text="Loading... Please wait"
      >
        <template v-slot:item.order_item_remarks="{ item }">
          <template v-for="remark in item.order_item_remarks"
                    :key="remark.id">
            <v-tooltip :text="remark.text">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props">{{ remark.identifier }}</v-btn>
              </template>
            </v-tooltip>
          </template>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div  class="d-flex align-center">
            <router-link :to="{ path: '/order_item/detail', query: { id: item.id } }">
              <v-icon icon="mdi-pencil"></v-icon>
            </router-link>
            <v-btn @click="handleSendToPcc(item)" variant="text" icon="mdi-rocket" />
          </div>
        </template>
      </v-data-table-server>
    </v-card>


    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-virtual
          :headers="order_remak_table_header"
          :items="order_remak_table"
          :loading="table.loading"
          loading-text="Loading... Please wait"
          class="custom-table"
      >
      </v-data-table-virtual>
    </v-card>


  </v-container>
</template>
<script>
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useOrderLineItemStore } from "./storePinia";
import { getCurrentInstance } from "vue";
import API from "@/order_admin/order_line_item/api";

import { useOrderStore } from "../order/storePinia";

import DatePickerMenu from "@/components/DatePickerMenu.vue";

import OrderSelect from "@/order_admin/order/OrderSelect.vue";

export default {
  name: "OrderItemTable",
  components: {
    DatePickerMenu,
    OrderSelect,
  },
  data() {
    return {
      scheduled_start_datetime: new Date().toISOString(),
      localOrganizationStatus: localStorage.getItem("organizationStatus"),
      order_remak_table: [],
      order_remak_table_header: [
        { title: 'Identifier', value: 'identifier', minWidth: 60, sortable: false, fixed: 'left' },
        { title: 'Type', value: 'type', minWidth: 60, sortable: false, fixed: 'left' },
        { title: 'Text', value: 'text', minWidth: 60, sortable: false, fixed: 'left' },
      ]
    };
  },
  computed: {
    ...mapState(useOrderLineItemStore, ["table", "headers"]),
    ...mapState(useOrderStore, ["order_page_model"]),
  },
  mounted() {
    // 

    if (this.$route.query?.order_code){
    this.order_page_model.order_code = this.$route.query?.order_code;
    }
    this.getByOrderId();

    this.$watch(
      (vm) => [
        // vm.table.options.q,
        vm.order_page_model.id,
        vm.table.options.page,
        vm.table.options.itemsPerPage,
        vm.table.options.sortBy,
        vm.table.options.descending,
      ],
      () => {
        this.getByOrderId();
      }
    );

    this.getAllOrderRemark();
  },

  methods: {
    handleSearch() {
      this.getByOrderId();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      handleSearch();
    },
    ...mapActions(useOrderLineItemStore, ["getAll", "getByOrderId", "handleSendToPcc"]),

    // 获取order remark
    getAllOrderRemark(){
      console.log("order id:" + this.order_page_model.id);
      API.getOrderRemark(this.order_page_model.id).then(result => {
        this.order_remak_table = result.data
      })
    }
  },
};
</script>

<style>
.custom-table {
  max-height: 500px; /* 限制最大高度 */
  overflow-y: auto; /* 超过时滚动 */
  display: flex;
  flex-direction: column;
}

.custom-table .v-data-table__wrapper {
  flex: 1; /* 让表格内容自适应高度 */
}
</style>
