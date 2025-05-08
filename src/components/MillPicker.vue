<template>
  <v-menu open-on-hover>
    <template v-slot:activator="{ props }">
      <v-btn class="icon-white-background" icon="mdi-factory" color="white" v-bind="props">
        <template v-slot:default>
          <v-icon color="white"></v-icon>
        </template>
      </v-btn>
    </template>
    <v-list :selected="defaultMillCode" density="comfortable" select-strategy="leaf" :lines="false" nav>
      <v-list-item v-for="item in codes" :key="item.code" :value="item.code" active-class="text-pink" color="primary" @click="handleChange(item)">
        <v-list-item-title v-text="item.code"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script setup>
import {ref, inject, computed} from "vue";
import {toast} from "vue3-toastify";
import API from "@/api";
import { useStore } from 'vuex'

const store = useStore();

const reload = inject("reload");

const defaultMillCode = computed(() => [store.state.auth.defaultMillCode]);


const codes = ref([])

const handleChange = (item) => {
  API.post(`/user/new_update_user_mill/${item.id}`).then(res => {
    reload();
    store.commit("auth/SET_DEFAULT_MILL_CODE", item.code)
    localStorage.setItem("defaultMillId", item.id);
    // 确保permission接口调用完成
    store.dispatch('app/getPermission');
    toast.success("Mill Toggle Success", {
      position: "bottom-center"
    });
  }).catch(res => {
    toast.error("Mill Toggle Fail", { autoClose: 60000 });
  });
}

const getData = () => {
  API.get("/mill/data/millSelect", {
    params: {
      page: 1,
      itemsPerPage: 10,
      descending: [true],
    },
  }).then(res => {
    const { options } = res.data
    codes.value = options || []
  })
}
getData()
</script>
<style scoped>

</style>
