<template>
  <v-navigation-drawer
      :model-value="modelValue"
      location="right"
      :width="width"
      fixed
      temporary
      floating
      persistent
      class="form-dialog"
      @update:modelValue="handleClose"
  >
    <template v-slot:prepend>
      <v-row class="pt-2 pb-2 pl-4" align="center" no-gutters>
        <v-col>
          <div class="text-subtitle-1 font-weight-bold">{{ title }}</div>
          <div v-if="desc" class="text-subtitle-2 color-gr">{{ desc }}</div>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn @click="handleClose" variant="text" icon="mdi-close"></v-btn>
      </v-row>
      <v-divider></v-divider>
    </template>
    <div :class="bodyClass">
      <slot></slot>
    </div>
    <template v-slot:append>
      <v-divider></v-divider>
      <div class="d-flex ga-4 align-center pl-4 pt-3 pb-3">
        <v-btn
            class="text-none"
            color="primary"
            variant="flat"
            :loading="loading"
            @click="handleSave"
        >
          Save
        </v-btn>

        <v-btn
          v-if="showForce"
          class="text-none"
          color="primary"
           variant="flat"
          :loading="loading"
          @click="handleForceSave"

        >
          Force Save
        </v-btn>
        <v-btn
            class="text-none"
            color="#e3e3e3"
            variant="flat"
            @click="handleClose"
        >
          Cancel
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>
<script setup>
const props = defineProps({
  // 是否显示提示
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 按钮加载
  loading: {
    type: Boolean,
    default: false,
  },
  // 数量限制
  width: {
    type: Number,
    default: 460,
  },
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  bodyClass: {
    type: String,
    default: "pa-4",
  },
  showForce:{
    type: Boolean,
    default:false
  }
});

const emit = defineEmits(['close', 'save']);

const handleClose = () => emit('close')

const handleSave = () => emit('save')

const handleForceSave = () => emit('forceSave')

</script>
<style scoped>

</style>
