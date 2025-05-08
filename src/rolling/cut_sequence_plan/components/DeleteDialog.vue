<template>
    <v-dialog v-model="visible" persistent max-width="400">
        <v-card
            title="Delete Cut Sequence"
            prepend-icon="mdi-alert-circle-outline"
            class="re-work-card"
            text="Are you sure you want to delete this Cut Sequence?"
            style="overflow: visible"
        >
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                class="text-none mr-4"
                color="#e3e3e3"
                variant="flat"
                @click="handleClose"
            >
            Cancel
            </v-btn>
            <v-btn
                class="text-none"
                color="primary"
                variant="flat"
                :loading="loading"
                @click="handleSave"
            >
            Confirm
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { mapState } from "pinia";
  import { mapActions } from "pinia";
  import {toast} from "vue3-toastify";
  import API from '../api';
  import {getCurrentInstance, nextTick, reactive, ref, toRaw, toRefs} from "vue";
  import DictCode from "@/components/picker/DictCode.vue";
  import { useRoute, useRouter } from "vue-router";
  const {proxy} = getCurrentInstance();
  const emit = defineEmits(['refresh']);

  const route = useRoute();
  const visible = ref(false)
  const selectedItem = ref(null);

  const handleShow = (item) => {
    selectedItem.value = item;
    nextTick(() => {
        visible.value = true;
    })
  }

  const handleClose = () => {
    visible.value = false;
  }

  const handleSave = async() => {
  try {
    await API.deleteCutSequence(selectedItem.value.id);
    handleClose();
    emit("refresh");
    toast.success("Delete Success", {
      position: "bottom-center"
    });
  } catch (error) {
    toast.error(error?.response?.data?.detail  || "Delete Failed", { autoClose: 60000 });
  }
  }

  defineExpose({
    handleShow,
  });

  </script>
  