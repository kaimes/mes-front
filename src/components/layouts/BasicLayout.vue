<template>
  <v-app>
    <v-main>
      <organization-banner />
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
import OrganizationBanner from '@/org/OrganizationBanner.vue';

export default {
  components: {
    OrganizationBanner
  },
  data: () => ({}),

  methods: {}
};
</script>
<style scoped lang="css">
.split-bg {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
  z-index: 0;
}
</style>
