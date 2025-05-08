<template>
  <v-menu open-on-hover>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon :color="color" size="large" class="mdi mdi-web" />
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="(item, index) in language_items" :key="index">
        <v-list-item-title @click="change_language(item.tag)">{{
          item.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { useI18n } from 'vue-i18n';
export default {
  name: 'Internationalization',
  props: {
    color: {
      type: String,
      default: "white",
    },
  },
  setup() {
    const { locale } = useI18n();
    function change_language(type) {
      console.log('change language :', type);
      locale.value = type;
    }
    return { change_language };
  },
  data() {
    return {
      language_items: [
        { title: '简体中文', tag: 'zh' },
        { title: 'English', tag: 'en' }
      ]
    };
  },
  components: {},
  mounted() {},
  computed: {},

  methods: {}
};
</script>

<style lang="stylus" scoped>
.theme--light.v-divider {
  border-color: rgba(0, 0, 0, 0) !important;
}

.usage-title, .usage-content {
  padding: 5px 16px;
}

.status_stop_tips {
  color: #ff5252;
}

/* 在你的CSS文件中 */
.icon-white-background {
  background-color: white;
  padding: 2px;
  border-radius: 50%;
}
</style>
