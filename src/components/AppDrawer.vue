<template>
  <template v-if="isMobile">
    <v-navigation-drawer
      v-model="showDrawer"
      app
      left
      class="navigation-drawer"
      elevation="0"
    >
      <div class="search">
        <div class="search-header">
          <div v-show="showDrawer" class="search-header-title">Dashboard</div>
          <div class="search-header-action" @click="handleDrawerToggle">
            <v-icon icon="mdi mdi-menu"></v-icon>
          </div>
        </div>
        <div v-show="showDrawer" class="search-input">
          <input
            @input="handleSearch"
            v-model.trim="form.key"
            type="text"
            placeholder="Rolling"
          />
          <v-icon icon="mdi mdi-magnify"></v-icon>
        </div>
      </div>
      <PerfectScrollbar ref="scroll" id="scrollEl" class="scrollnavbar">
        <v-list class="pa-4">
          <template v-for="item in menus" :key="item.name">
            <template v-if="item.header">
              <v-list-subheader :key="item.name">
                {{ item.header }}
              </v-list-subheader>
            </template>
            <template v-if="item.href">
              <v-list-item
                  :id="item.href"
                  :to="item.href"
                  ripple="ripple"
                  active-class="list-item-active"
                  :disabled="item.disabled"
                  :target="item.target"
                  rel="noopener"
              >
                <template v-slot:prepend>
                  <template v-if="item.icon">
                    <v-icon color="primary" :icon="item.icon"></v-icon>
                  </template>
                  <template v-if="item.subAction">
                    <v-icon :icon="item.subAction"></v-icon>
                  </template>
                </template>
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
                <v-tooltip activator="parent" location="end">
                  <div class="text-overflow">
                    <div class="text-subtitle-2">Title: {{ item.title }}</div>
                    <div class="text-subtitle-3">Note: {{ item.desc }}</div>
                  </div>
                </v-tooltip>
              </v-list-item>
            </template>
          </template>
        </v-list>
      </PerfectScrollbar>
    </v-navigation-drawer>
  </template>
  <template v-else>
    <v-navigation-drawer
      app
      left
      :rail="!showDrawer"
      class="navigation-drawer"
      elevation="0"
      :class="{ 'no-padding': !showDrawer }"
      rail-width="88"
    >
      <div class="search">
        <div class="search-header">
          <div v-show="showDrawer" class="search-header-title">Dashboard</div>
          <div class="search-header-action" @click="handleDrawerToggle">
            <v-icon icon="mdi mdi-menu"></v-icon>
          </div>
        </div>
        <div v-show="showDrawer" class="search-input">
          <v-text-field
              v-model.trim="form.key"
              @update:modelValue="handleSearch"
              append-inner-icon="mdi-magnify"
              density="compact"
              placeholder="Search"
              variant="outlined"
              clearable
              hide-details
              single-line
          ></v-text-field>
        </div>
      </div>
      <PerfectScrollbar ref="scroll" id="scrollEl" class="scrollnavbar">
        <v-list class="pa-4">
          <template v-for="item in menus" :key="item.name">
            <template v-if="item.header">
              <v-list-subheader :key="item.name">
                {{ item.header }}
              </v-list-subheader>
            </template>
            <template v-if="item.href">
              <v-list-item
                  :id="item.href"
                  :to="item.href"
                  ripple="ripple"
                  active-class="list-item-active"
                  :disabled="item.disabled"
                  :target="item.target"
                  rel="noopener"
                  exact
              >
                <template v-slot:prepend>
                  <template v-if="item.icon">
                    <v-icon color="primary" :icon="item.icon"></v-icon>
                  </template>
                  <template v-if="item.subAction">
                    <v-icon :icon="item.subAction"></v-icon>
                  </template>
                </template>
                <v-list-item-title>
                  {{ item.title }}
                </v-list-item-title>
                <v-tooltip activator="parent" location="end">
                  <div class="text-overflow">
                    <div class="text-subtitle-2">Title: {{ item.title }}</div>
                    <div class="text-subtitle-3">Note: {{ item.desc }}</div>
                  </div>
                </v-tooltip>
              </v-list-item>
            </template>
          </template>
        </v-list>
      </PerfectScrollbar>
    </v-navigation-drawer>
  </template>
</template>
<script >
import menu from "@/router/menu";
import { mapState, mapActions } from "vuex";
import AuthApi from "@/auth/api";
import { isEmpty, filter } from "lodash";

export default {
  name: "AppDrawer",
  props: {
    expanded: {
      type: Boolean,
      default: true,
    },
    drawWidth: {
      type: [Number, String],
      default: "220",
    },
  },
  data() {
    return {
      menus: menu,
      originMenus: menu,
      form: {
        key: undefined,
      },
      scrollSettings: {
        maxScrollbarLength: 160,
      },
    };
  },
  computed: {
    // 处理掉 告警信息
    //[Vue warn]: Write operation failed: computed property "toggleDrawer" is readonly.
    isMobile: function () {
      return this.$vuetify.display.mobile;
    },
    showDrawer: {
      set(value) {
        this.toggleDrawerAction(value);
      },
      get() {
        return this.toggleDrawer;
      },
    },
    ...mapState("app", ["toggleDrawer", "menuData"]),
    ...mapState("auth", ["userInfo"]),
    ...mapState("org", ["selected"])
  },
  watch: {
    menuData: {
      handler(value) {
        if (value) {
          this.menus = value;
          this.originMenus = value;
        }
      },
      deep: true,
      immediate: true,
    },

  },
  mounted() {
    // this.getUserPermission();
    this.$options.scrollEl = document.querySelector("#scrollEl");
    document.getElementById(this.$route.path)?.scrollIntoView()
  },
  scrollEl: null,
  methods: {
    ...mapActions("app", ["toggleDrawerAction"]),
    handleDrawerToggle() {
      this.$store.dispatch("app/toggleDrawerAction");
    },
    getUserPermission() {
      this.error = null;
      this.loading = true;
      AuthApi.getPermission()
        .then((response) => {
          const { menu, permission } = response.data;
          // 处理visible是true 的数据
          const $menu = filter(menu, ['visible', true]);
          this.menus = $menu || [];
          this.originMenus = $menu || [];
          const menuButtonPermission = permission || [];
          this.$store.commit("auth/SET_MENU_DATA", menu);
          localStorage.setItem(
            "menuButtonPermission",
            JSON.stringify(menuButtonPermission)
          );
          this.$nextTick(() => {
            document.getElementById(this.$route.path).scrollIntoView()
          });
        })
        .catch((err) => {
          this.originMenus = menu;
          this.menus = menu;
          localStorage.removeItem("menuButtonPermission");
        });
    },
    handleSearch(e) {
      const { key } = this.form;
      if (!key) {
        this.menus = this.originMenus;
        return;
      }
      this.menus = this.originMenus.filter((item) => {
        // if (!item.desc) {
        //   return false;
        // }
        const $desc = item.desc?.toLowerCase() || "";
        const $title = item.title?.toLowerCase() || "";
        const $key = key.toLowerCase();
        return !isEmpty($desc.match($key)) || !isEmpty($title.match($key));
      });
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          this.$refs.scroll.$el.scrollTop = 0;
        }
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.navigation-drawer {
  overflow: hidden;
  border: 0;
  box-shadow: none !important;
  &.no-padding {
    padding: 0;
  }
  .search {
    padding-top: 12px;
    &-header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      padding: 0 6px;
      &-title {
        display: flex;
        flex: 1;
        color: #49454f;
        font-size: 14px;
        font-family: Roboto, serif;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.1px;
        word-wrap: break-word;
        padding: 8px 16px;
      }
      &-action {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 100%;
        cursor: pointer;
        i {
          color: #49454f !important;
        }
      }
    }
    &-input {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1 0 0;
      align-self: stretch;
      margin: 12px 12px 0 12px;
    }
  }
  ::v-deep(.v-navigation-drawer__content) {
    overflow-y: hidden;
  }

  .scrollnavbar {
    position: relative;
    height: calc(100vh - 170px);
  }
}
.text-overflow {
  max-width: 600px;
  display: -webkit-box;
  text-overflow: ellipsis;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
