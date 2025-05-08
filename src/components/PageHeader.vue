<template>
  <div class="page-header">
    <div class="page-header-left">
      <v-btn flat icon="mdi-arrow-left" @click="handleBack"></v-btn>
      <span class="text-h6 ml-2">{{$t("menu."+$route.meta.title,$route.meta.title)  }}</span>
    </div>
    <v-breadcrumbs class="text-h7 justify-md-end pa-0" :items="breadcrumbs">
      <template v-slot:prepend>
        <v-icon icon="mdi-home" color="primary"></v-icon>
        <div class="d-flex align-center">
          <v-icon icon="mdi-chevron-right" color="black" />
        </div>
      </template>
      <template v-slot:divider>
        <div class="d-flex align-center">
          <v-icon icon="mdi-chevron-right" color="black" />
        </div>
      </template>
      <template v-slot:item="props">
        <router-link :to="props.item.href" class="text-subtitle-1">
          {{ props.item.text ? $t('menu.' + props.item.text, props.item.text) : '' }}
          </router-link
        >
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'home',
      breadcrumbs: [],
      isBilling:
        window.location.pathname == '/my_order' ||
        window.location.pathname == '/my_billing'
    };
  },
  watch: {
    '$route.path': function () {
      this.computeBreadcrumbs();
    }
  },
  created() {
    this.computeBreadcrumbs();
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    computeBreadcrumbs() {
      let breadcrumbs = [
        {
          text: 'home',
          href: '/',
          disabled: true
        }
      ];
      let appends = [];
      appends = this.$route.matched.map((item) => {
        return {
          text: item.meta.title || '',
          href: item.path || '',
          disabled: item.path === this.$route.path
        };
      });
      this.breadcrumbs = breadcrumbs.concat(appends);
    }
  }
};
</script>
<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 6px 12px;
  margin-bottom: 12px;
  &-left {
    display: flex;
    align-items: center;
  }
  .disabled {
    color: grey;
    pointer-events: none;
    text-decoration: blink;
  }
  a {
    text-decoration: none;
    color: #333;
  }
}
</style>
