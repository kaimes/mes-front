<template>
  <div id="page-lists">
    <v-container grid-list-lg fluid>
      <v-layout row wrap>
        <v-col lg4>
          <profile-card />
        </v-col>
        <v-col lg4>
          <menu-card />
        </v-col>
        <v-col lg4>
          <setting-card />
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import ProfileCard from '@/components/widgets/card/ProfileCard';
import MenuCard from '@/components/widgets/card/MenuCard';
import SettingCard from '@/components/widgets/card/SettingCard';
export default {
  components: {
    ProfileCard,
    MenuCard,
    SettingCard
  },
  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
