<template>
  <v-autocomplete
    label="Semi No."
    variant="underlined"
    bg-color="white"
    placeholder="Semi No."
    item-title="semi_code"
    item-value="id"
    :items="items"
    @update:search="handleSearch"
    @update:modelValue="handleChoose"
    @click:clear="handleClear"
    clearable
  >
  </v-autocomplete>
</template>


<script setup>
import { find } from "lodash";
import {defineEmits, ref} from "vue";
import API from '@/api';

const emit = defineEmits(['pickSemiCode'])

const searching = ref(false);

const items = ref([])
let cache = [];

const handleClear = () => {
  items.value = cache;
}

const handleSearch = async (val) => {
  if (val) {
    searching.value = true;
    try {
      const { status, data } = await API.get("/semi/", {
        params: {
          q: val,
          page: 1,
          itemsPerPage: 20,
          sortBy: ["updated_at"],
          descending: [false],
        },
      })
      if (status === 200) {
        items.value = data.items || []
      } else {
        items.value = [];
      }
    } finally {
      searching.value = false;
    }
  } else {
    if (items.value.length === 0) {
      items.value = cache;
    }
  }
}
const handleChoose = (id) => {
  if (id) {
    const item = find(items.value, { id})
    if (item) {
      emit("pickSemiCode", item)
    }
  }
}
const getData = async () => {
  const { status, data } = await API.get("/semi/", {
    params: {
      page: 1,
      itemsPerPage: 5,
      sortBy: ["updated_at"],
      descending: [false],
    },
  })
  if (status === 200) {
    items.value = data.items || []
    cache = data.items || []
  } else {
    items.value = [];
  }
}

getData();
</script>
<style scoped>

</style>
