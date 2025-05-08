<template>
  <v-container fluid>
    <new-edit-sheet />
    <delete-dialog />
    <v-form ref="searchForm" @submit.prevent="handleSearch">
      <v-row align="center">
        <v-col cols="2">
          <ShiftCode
              v-model="table.options.shift_id"
              label="Shift Code"
              :clearable="false"

          />
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="table.options.area_code"
              code="shift_area_code"
              label="Area Code"
              variant="underlined"
              :hide-details="true"
              :clearable="false"
          />
        </v-col>
        <v-col cols="2">
          <DictCode
              v-model="table.options.delay_code"
              code="shift_delay_code"
              label="Delay Code"
              variant="underlined"
              :hide-details="true"
              :clearable="false"
          />
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
              v-permission="`Search`"
            >
              {{ $t("global.search") }}
            </v-btn>
          </div>
        </v-col>
        <v-col cols="3" class="text-end">
          <v-btn
            color="primary"
            @click="editShow(null)"
            variant="flat"
            :disabled="localOrganizationStatus === 'Expired'"
            v-permission="`Create`"
            >{{ $t('global.new') }}</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-data-table-server
        fixed-header
        height="650"
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
        <template v-slot:[`item.delay_code`]="{ item }">
          {{ valueMapping.delay_code[item.delay_code] || item.delay_code }}
        </template>
        <template v-slot:[`item.area_code`]="{ item }">
          {{ valueMapping.area_code[item.area_code] || item.area_code }}
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <span class="table_action_icon">
            <v-icon small class="mr-2" @click="editShow(item)" v-permission="`Detail`"
              >mdi-pencil</v-icon>
            <v-icon small @click="removeShow(item)" v-permission="`Delete`">mdi-delete</v-icon>
          </span>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script>
// import { mapGetters } from "vuex";
// import { mapFields } from "vuex-map-fields";
// import { mapActions, mapState } from "vuex";
import DeleteDialog from "@/shift_admin/shift_delay/DeleteDialog.vue";

import NewEditSheet from "@/shift_admin/shift_delay/NewEditSheet.vue";
import { mapState } from "pinia";
import { mapActions } from "pinia";

import { useShiftDelayStore } from "./storePinia";

import DictCode from "@/components/picker/DictCode.vue";
import ShiftCode from "@/components/picker/ShiftCode.vue";


export default {
  name: "ShiftDelayTable",

  components: {
    NewEditSheet,
    DeleteDialog,
    DictCode,
    ShiftCode,
  },
  data() {
    return {
      translateHeaders: [

        {
          title: "shift_delay.table.action",
          value: "action",
          sortable: false,
          align: "center",
          fixed: true
        },
        { title: "shift_delay.table.mill_code", key: "mill.code",sortable: false },
        { title: "shift_delay.table.no", value: "delay_no", sortable: true },
        { title: "shift_delay.table.delay_start", value: "delay_start", sortable: true },
        { title: "shift_delay.table.delay_end", value: "delay_end", sortable: true },
        { title: "shift_delay.table.area_code", value: "area_code", sortable: true },
        { title: "shift_delay.table.delay_code", value: "delay_code", sortable: true },
        { title: "shift_delay.table.delay_cause", key: "delay_cause"},
        { title: "shift_delay.table.duration", key: "delay_duration"},
        
      ],
      localOrganizationStatus: localStorage.getItem("organizationStatus"), // organizationStatus取的是本地缓存的数据
      valueMapping:{
        "area_code":{
          "01": "All Mill",
          "02": "Any OHC",
          "03": "Walking Beam Furnace",
          "04": "South BSB & Grid",
          "05": "North BSB & Grid",
          "06": "Furnace 1",
          "07": "Furnace 2",
          "08": "Descaling",
          "09": "Roughing Mill",
          "10": "Inter Mill",
          "11": "Stand Prep",
          "12": "Roll Shop",
          "13": "F Mill Area",
          "14": "F Mill Stand",
          "15": "Flying Shear",
          "16": "BPG/ Vision Sys",
          "17": "Section Cooling Bank",
          "18": "QC Area",
          "19": "Water Treatment",
          "20": "Roll Pass Lube",
          "21": "Any OHC",
          "22": "Sect Cool Bank",
          "23": "Sections RSM ",
          "24": "Grouping Tables",
          "25": "Cold Saws",
          "26": "Pilers",
          "27": "Tie Wires/Strap",
          "28": "Chain Transfers",
          "29": "Secondary Saw",
          "30": "Section Despatch",
          "31": "ADC",
          "32": "RailStamp/Vision",
          "33": "Rail Saw/Sample",
          "34": "Rail Cool Bank",
          "35": "Rail Manipulator",
          "36": "Rail RSM",
          "37": "Rail Buffer Bank",
          "38": "Rail Gantrys",
          "39": "Rail Switch",
          "40": "Rail Despatch "
        },
        "delay_code":{
          "01": "Steel Supply/ID",
          "02": "Gas Supply",
          "03": "Water Supply",
          "04": "Power Control",
          "05": "Down Time",
          "06": "Heat Capacity",
          "07": "Full Roll Change",
          "08": "Rollwear",
          "09": "Pass/Size Change",
          "10": "Overload/Trip",
          "11": "Fly Shear Blade",
          "12": "Tech Sampling",
          "13": "Roll Set Up",
          "14": "Tackle Adjust ",
          "15": "Scratches Check",
          "16": "Stand Build Up",
          "17": "Plant Damage",
          "18": "Broken Roll",
          "19": "Cobble",
          "20": "Manipulation",
          "21": "Policy",
          "22": "Checking Quality",
          "23": "Fire",
          "24": "Trial Rollings ",
          "25": "Order Book",
          "26": "Computers- Cap",
          "27": "Computers- VAX",
          "28": "RSM Set Up",
          "29": "Cobble RSM",
          "30": "Saw Blade Change",
          "31": "Scrap Pan Change",
          "32": "Congestion",
          "33": "Traffic",
          "34": "Manning ",
          "35": "OOT Material",
          "36": "No label",
          "37": "Scale Build Up",
          "38": "Shearing ",
          "39": "Mech Fail",
          "40": "Control Failure "

        },

      },
    };
  },

  computed: {
    ...mapState("auth", ["userInfo"]),

    ...mapState(useShiftDelayStore, ["table"]),
    headers(){
      return this.translateHeaders.map(header => {
        return{
          ...header,
          title: this.$t(header.title) || header.title
        }
      })
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
    this.closeCreateEdit();
  },
  methods: {
    ...mapActions(useShiftDelayStore, [
      "getAll",
      // "createEditShow",
      "removeShow",
      "editShow",
    ]),
    handleSearch() {
      this.getAll();
    },
    handleReset() {
      this.$refs["searchForm"].reset();
      handleSearch();
    },
    // ...mapGetters("auth", ["getPermission"]),
    // ...mapActions("location", [
    //   "getAll",
    //   "createEditShow",
    //   "removeShow",
    //   "closeCreateEdit",
    // ]),
    // ...mapActions("job", ["showJobEdit4Customer"]),
    // clickNewJobOnLocation(item) {
    //   this.showJobEdit4Customer({ job: null, loc: item });
    // },
  },
};
</script>
<style>
.code {
  display: block;
  max-width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.overflow_ellipsis_col {
  display: block;
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
