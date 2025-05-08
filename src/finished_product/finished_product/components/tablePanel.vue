<template>
  <v-expansion-panel class="product-panel" :value="data.id" expand>
    <v-expansion-panel-title class="panel-card-title">
      <v-row align="center" no-gutters>
        <v-col cols="10">
          <v-btn
              class="text-none ml-4 mr-4"
              color="primary"
              variant="flat"
              :disabled="selected.length === 0 || tableData.length <= 1"
              @click.stop
          >
            Hold
          </v-btn>
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none"
                  color="primary"
                  variant="flat"
                  :disabled="selected.length === 0 || tableData.length <= 1"
                  v-bind="activatorProps"
                  @click.stop
              >
                Unhold
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  title="Split Order Group or Merge?"
                  text="Would you like to split this Order Group into new one or merge it with an existing one?"
              >
                <v-spacer></v-spacer>
                <template v-slot:actions>
                  <v-btn
                      class="text-none"
                      color="#e3e3e3"
                      variant="flat"
                      @click="isActive.value = false"
                  >
                    Merge to Existing
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleSplit(isActive)"
                  >
                    New
                  </v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
        <v-col cols="2" class="text-end">
          <v-dialog
              max-width="400"
              persistent
          >
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                  class="text-none mr-4"
                  color="red"
                  variant="flat"
                  v-bind="activatorProps"
                  @click.stop
              >
                Delete
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card
                  prepend-icon="mdi-help-circle-outline"
                  title="Split Order Group or Merge?"
                  text="Would you like to split this Order Group into new one or merge it with an existing one?"
              >
                <v-spacer></v-spacer>
                <template v-slot:actions>
                  <v-btn
                      class="text-none"
                      color="#e3e3e3"
                      variant="flat"
                      @click="isActive.value = false"
                  >
                    Merge to Existing
                  </v-btn>
                  <v-btn
                      class="text-none"
                      color="primary"
                      variant="flat"
                      @click="handleSplit(isActive)"
                  >
                    New
                  </v-btn>
                </template>
              </v-card>
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="panel-card-body">
      <v-data-table
          v-model="selected"
          :headers="tableHeaders"
          :items="tableData"
          density="default"
          item-value="id"
          show-select
      >
        <template #bottom>
          <!-- Leave this slot empty to hide pagination controls -->
        </template>
      </v-data-table>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>
<script setup>
import {computed, ref, toRaw} from "vue";
import { toast } from "vue3-toastify";
import {reduce} from "lodash";
import {useRouter} from "vue-router";
import XEUtils from "xe-utils";
import API from "../api";

const router = useRouter();
const emit = defineEmits(['refresh']);

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  /**当前双向数据绑定的值 */
  data: {
    type: Object,
    default: () => ({
      items: []
    })
  }
})

const tableHeaders = ref([
  {title: "Bar No.", key: "bar_no", sortable: false},
  {title: "Length(mm)", key: "length", sortable: false},
  {title: "Mults", key: "mults", sortable: false},
  {title: "Order Number", key: "order_no", sortable: false},
  {title: "Line Item Number", key: "line_item_no", sortable: false},
  {title: "Spec Code", key: "spec_code", sortable: false},
  {title: "Location", key: "location", sortable: false},
  {title: "Is real", key: "is_real", sortable: false},
  {title: "Defect", key: "defect", sortable: false},
  {title: "Status", key: "status", sortable: false},
  {title: "Action", key: "action", sortable: false},
]);

const selected = ref([]);
const loading = ref(false);

const tableData = computed(() => {
  const { items } = props.data;
  return (items || []).map(item => {
    const spec = item.spec || {};
    return {
      ...item,
      spec_code: spec.spec_code,
    }
  });
})

const handleSplit = (isActive) => {
  isActive.value = false;
  loading.value = true;
  API.orderGroupSplit({}).then(res => {
    toast.success("Split Success!")
    selected.value = [];
    emit("refresh");
  }).catch(res => {
    toast.error("Split Error!", { autoClose: 60000 })
  }).finally(() => {
    loading.value = false;
  })
}

</script>
<style lang="scss" scoped>
.product-panel {
  .panel-card-title {
    padding: 6px 18px 6px 0 !important;
    margin: 0 !important;
    min-height: auto !important;
  }
  .panel-card-body {
    background-color: #fff;
  }
}

</style>
