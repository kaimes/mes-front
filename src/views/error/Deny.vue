<template>
  <div class="exception">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <div class="mr-3 hidden-sm-and-down">
          <img src="/static/error/403.svg" alt />
        </div>
        <div class="text-md-center">
          <h1>403</h1>
          <h2 class="my-3 headline">
            Sorry, access denied.
          </h2>
          <div>
            <v-btn color="primary" @click="goHome">
              Go Home
            </v-btn>
          </div>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  created() {},
  methods: {
    goHome() {
      this.$router.push({ path: "/" });
    }
  }
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
</style>
