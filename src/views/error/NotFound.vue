<template>
  <v-app>
    <v-container fluid fill-height class="grid-center">
      <v-layout align-center justify-center>
        <div class="text-md-center">
          <h1>404</h1>
          <h2 class="my-3 headline">Sorry, page not found</h2>
          <div>
            <v-btn color="primary" @click="goHome"> Go Home </v-btn>
          </div>
        </div>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>
<style scoped lang="css">
h1 {
  font-size: 150px;
  line-height: 150px;
  font-weight: 700;
  color: #252932;
  text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
    rgba(61, 61, 61, 0.3) 3px 3px;
}

.grid-center {
  display: grid;
  place-items: center; /* 同时设置水平和垂直居中 */
  height: 50vh; /* 让容器充满整个视口高度，可根据需要调整 */
}
</style>
