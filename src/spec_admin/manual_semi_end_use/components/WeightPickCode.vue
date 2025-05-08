<template>
    <v-autocomplete
        v-model="valueId"
       
        @update:model-value="handleChoose"
        :label="label"
        :placeholder="placeholder"
        :prepend-inner-icon="prependInnerIcon"
        :append-inner-icon="appendInnerIcon"
        :item-title="itemTitle"
        :item-value="itemValue"
        :persistent-placeholder="persistentPlaceholder"
        :hide-details="hideDetails"
        :density="density"
        :variant="variant"
        :rules="rules"
        :loading="searching"
        :items="items"
        clearable
    ></v-autocomplete>
</template>

<script setup>
import {find, includes, isElement} from "lodash";
import {computed, defineEmits, ref, toRaw, watch} from "vue";
import API from '@/api';



const searching = ref(false);
const items = ref([])
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  /**当前双向数据绑定的值 */
  modelValue: {
    type: [String, Number],
    default: ''
  },
  /** 年份 */
  rules: {
    type: Array,
    default: []
  },
  persistentPlaceholder: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false
  },
  density: {
    type: String,
    default: 'default'
  },
  variant: {
    type: String,
    default: 'underlined'
  },
  itemValue: {
    type: String,
    default: 'id'
  },
  itemTitle: {
    type: String,
    default: 'dim3'
  },
  label: {
    type: String,
    default: 'Weight'
  },
  product_type: {
    type: Object,
  },
  placeholder: {
    type: String,
    default: 'Please select Weight'
  },
  product_category_id:{
    type: Number,
  },
  appendInnerIcon:{
    type: String,
    default: 'mdi-magnify'
  },
  prependInnerIcon:{
    type: String,
    default: 'mdi-file-document-refresh'
  },
  desc:{
    type: Boolean,
    default: false
  }
})

const valueId = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});


const getData = async () => {
  let params= {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["dim3"],
      descending: [props.desc],
  }
  if(props.product_category_id){
    params.fields = ['product_category_id']
    params.ops = ['eq']
    params.values = [props.product_category_id]
    params.itemsPerPage = -1
  }
  const { status, data } = await API.get("/product_type/", {params})
  if (status === 200) {
    const $data = (data.items || []).map(item => ({
      ...item,
    }));
    items.value = $data;
  } else {
    items.value = [];
  }
}

const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, (item) => item[props.itemValue] === id)
    if (item) {
      emit("change", item)
    }
  }else{
      emit("change", id)
  }
}

watch(
    () => props.product_type,
    async (value) => {
      if (items.value.length == 0) {
        await getData();
      }

      if (value){
        const $isExist = find(items.value, (item) => item[props.itemValue] === value[props.itemValue])
        if ($isExist) {
          emit("change", $isExist)
        } else {
          emit("change", props.product_type)
        }

      }
    },
    {
      immediate: true,
      deep: true
    }
)

watch(()=>props.product_category_id, ()=>{
  getData()
},{deep:true})  
</script>
<style scoped>

</style>
