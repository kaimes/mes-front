<template>
  <v-dialog v-model="visible" max-width="80%" :close-on-back="false" persistent>
    <v-card title="Allocate Bar">
      <div class="text-subtitle-2 ml-4 mr-4 mb-2">List of selected</div>
      <div class="pa-4 border rounded ml-4 mr-4">
        <v-data-table fixed-header :headers="tableHeaders" :items="tableList" density="default" height="260">
          <template v-slot:item.runout.runout_code="{ item }">
            <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'RunoutDetail', query: { runout_id: item.runout?.id } }">
              <span class="w-100 d-inline-block">{{ item.runout?.runout_code }}</span>
            </router-link>
          </template>
          <template v-slot:item.cast.cast_code="{ item }">
            <router-link class="d-flex align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'CastChemicalDetail', query: { id: item.cast?.id } }">
              <span class="w-100 d-inline-block">{{ item.cast?.cast_code }}</span>
            </router-link>
          </template>

          <template v-slot:item.order_item.order.order_code="{ item }">
        <span class="allocated-order-item">
          <router-link v-if="item.order_item" class=" align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'OrderItemTable', query : {order_code:item.order_item.order?.order_code}  }">
            <span class="d-inline-block">{{ item.order_item?.order?.order_code }}</span>
          </router-link>
          <span class="separator">-</span>
          <router-link v-if="item.order_item" class=" align-center text-decoration-none grey-darken-4"
                       :to="{ name: 'OrderItemDetail',query : {id:item.order_item.id}  }">
            <span class="d-inline-block">{{ item.order_item?.line_item_code }}</span>
          </router-link>
        </span>
          </template>
          <template v-slot:item.reserved_order_item.line_item_code="{ item }">
          <span class="reserved-order-item">
            <router-link v-if="item.reserved_order_item" class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemTable', query: { order_code: item.reserved_order_item.order?.order_code } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.order?.order_code }}</span>
            </router-link>
            <span class="separator">-</span>
            <router-link v-if="item.reserved_order_item" class="align-center text-decoration-none grey-darken-4"
                         :to="{ name: 'OrderItemDetail', query: { id: item.reserved_order_item.id } }">
              <span class="d-inline-block">{{ item.reserved_order_item?.line_item_code }}</span>
            </router-link>
          </span>
          </template>

          <template v-slot:item.status="{ item }">
            <div class="d-flex justify-center ga-2">

              <v-chip size="small" v-if="item.status">
                {{ item.status }}
              </v-chip>
              <span v-else>
            </span>
            </div>
          </template>
          <template v-slot:item.area.code="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip size="small" v-if="false">
                En-Route
              </v-chip>
              <span v-else="item.advice.true">
              {{ item.area?.code }}
            </span>
            </div>
          </template>
          <template v-slot:item.hold_reason="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                {{ tag.name }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.hold_comment="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.hold_reason" :key="tag.id" size="small">
                {{ tag.comment }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.advice="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.advice" :key="tag.id" size="small">
                {{ tag.advice_code }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.loads="{ item }">
            <div class="d-flex justify-center ga-2">
              <v-chip v-for="tag in item.loads" :key="tag.id" size="small">
                {{ tag.code }}
              </v-chip>
            </div>
          </template>
          <template v-slot:item.rework_type="{ item }">
            <div class="justify-center c-clickable">
              <TreeDictCode variant="underlined" :hide-details="false" code="rework_type" placeholder="" v-model="item.rework_type" :disabled="true"/>
            </div>
          </template>
          <template #bottom>
          </template>
        </v-data-table>
      </div>
      <mult ref="multAction" :tableList="tableList" @refresh="handleClose"/>
    </v-card>
  </v-dialog>
</template>
<script setup>
import {computed, getCurrentInstance, ref, toRaw} from "vue";
import {filter} from "lodash";
import TreeDictCode from "@/components/picker/TreeDictCode.vue";
import Mult from "./mult.vue";

const props = defineProps({
  headers: {
    type: Array,
    default: []
  },
});

const {proxy} = getCurrentInstance();
const emit = defineEmits(['refresh']);

const visible = ref(false);
const tableList = ref([]);

const tableHeaders = computed(() => filter(props.headers, (item) => item.key !== "action"));

const handleShow = (data) => {
  visible.value = true;
  tableList.value = toRaw(data);
}


const handleClose = (type = "close") => {
  visible.value = false;
  if (type === "refresh") {
    emit("refresh");
  }
}

defineExpose({
  handleShow,
});
</script>
<style lang="scss" scoped></style>
