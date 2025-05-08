<template>
  <v-container class="page" fluid>
    <v-form ref="searchForm">
      <v-row align="center">
        <v-col cols="2">
          <v-text-field
            v-model="mult_item.code"
            label="Mult Bar No"
            density="default"
            bg-color="white"
            variant="plain"
            disabled
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="mult_item.length_mm"
            label="Length(mm)"
            density="default"
            bg-color="white"
            variant="plain"
            disabled
          />
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="mult_item.waste_length"
            label="Waste Length(mm)"
            density="default"
            bg-color="white"
            variant="plain"
            disabled
          />
        </v-col>
        <v-col cols="3">
          <v-chip color="primary">
            {{ mult_item.exist_flag == 'Y' ? "Waiting" : "Done" }}
          </v-chip>
        </v-col>
        <v-col cols="3">
          <v-btn
            v-if="mult_item.exist_flag === 'Y'"
            class="text-none"
            color="primary"
            @click="handleConfirm(mult_item)"
          >
            Confirm
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-card class="mt-6 pa-4" elevation="0" variant="outlined">
      <v-card-text>
        <v-data-table
          fixed-header
          :headers="headers"
          :items="serverItems"
          :itemsPerPage="-1"
          :loading="loading"
        >
          <template v-slot:item.exist_flag="{ item }">
              {{ item.exist_flag == 'Y' ? "Yes" : "No" }}
          </template>
          <template v-slot:loading>
            <v-skeleton-loader type="table-row@7"></v-skeleton-loader>
          </template>
          <template v-slot:bottom></template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script name="MultList" setup>
import {getCurrentInstance, onMounted, reactive, ref, toRaw, toRefs, watch} from "vue";
import { toast } from "vue3-toastify";
import { useRoute } from "vue-router";
import API from "./api";

const {proxy} = getCurrentInstance();
const route = useRoute();

const data = reactive({
  cur_mult_id: null,
  mult_item: {},
  headers: [
    { title: "Code", key: "code" },
    { title: "Runout Code", key: "runout.runout_code" },
    { title: "Length(mm)", key: "length_mm"},
    { title: "Quantity", key: "quantity"},
    { title: "Order Number", key: "order_code", value: (item) => item.order_item?.order?.order_code || "--" },
    { title: "Line Item Number", key: "order_item_code", value: (item) => item.order_item?.line_item_code || "--" },
    { title: "Spec Code", key: "spec.spec_code", value: (item) => item.spec?.spec_code || "--" },
    { title: "Type", key: "mult_type" },
    { title: "Is Real", key: "exist_flag", value: (item) => item.exist_flag == 'Y' ? "Yes" : "No" },
  ],
  serverItems: [],
  loading: false,
});

const {
  cur_mult_id,
  mult_item,
  headers,
  serverItems,
  loading,
} = toRefs(data);

function loadItems() {
  loading.value = true;
  if (!cur_mult_id.value) {
    return false;
  }
  API.getMultById(cur_mult_id.value).then(res => {
    mult_item.value = res.data.mult;
    serverItems.value = res.data.regulars || [];
  }).catch((error) => {
    handleError(error)
  }).finally(() => {
    loading.value = false;
  });
}

function handleError(error) {
  if (error.response) {
      toast.error(error.response.data?.detail, { autoClose: 60000 })
    } else {
      console.log(error)
    }
    return false
}

function handleConfirm(item) {
  const params = {
    ids: [],
  };
  params.ids = [item.id];
  return API.confirmMult(params).then((resp) => {
    toast.success("confirm mult successfully.", {
        position: "bottom-center"
    })
    loadItems();
  }).catch(error => {
    handleError(error)
  })
}

onMounted(() => {
  if (route.query.mult_id) {
    cur_mult_id.value = route.query.mult_id;
  }
  loadItems();
})

</script>
<style lang="scss" scoped>
.page {
  .section-field {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-input {
      flex: 1;
      flex-shrink: 0;
    }

    &-divider {
      width: 20px;
      height: 2px;
      background-color: #333;
      margin: 0 10px;
    }
  }
}
</style>
