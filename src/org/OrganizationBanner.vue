<template>
  <v-system-bar
    v-if="currentOrganization && currentOrganization.banner_enabled"
    :color="currentOrganization.banner_color"
    height="64px"
  >
    <v-icon color="white" size="36"> mdi-information-outline </v-icon>
    <span class="text-white">{{ currentOrganization.banner_text }}</span>
  </v-system-bar>
</template>

<script>
// import OrganizationApi from "@/organization/api"
// import SearchUtils from "@/search/utils"

export default {
  data() {
    return {
      currentOrganization: {},
    }
  },

  created() {
    let slugFilter = [
      {
        model: "Organization",
        field: "slug",
        op: "==",
        value: this.$route.params.organization,
      },
    ]

    let filterOptions = {
      itemsPerPage: 50,
      sortBy: ["name"],
      descending: [false],
      filter: JSON.stringify(slugFilter),
    }

    // filterOptions = SearchUtils.createParametersFromTableOptions({ ...filterOptions })

    // OrganizationApi.getAll(filterOptions).then((response) => {
    //   this.currentOrganization = response.data.items[0]
    // })
  },
}
</script>
