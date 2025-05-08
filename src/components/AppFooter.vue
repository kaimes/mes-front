<template>
  <v-footer v-if="userInfo.show_bottom_note" class="footer-bar">
    <div v-show="visible" class="footer-bar-content">
      <div @click="handleRichTextClick" class="desc">
        <read-more more-str="read more" less-str="read less" :text="pageDesc" :max-chars="360" />
      </div>
      <div class="copyright">
        EZSVS &copy; {{ new Date().getFullYear() }} Version: {{ VUE_APP_VERSION }}
      </div>
      <div @click="handleClose" class="footer-bar-content-action">
        <v-icon>mdi-close</v-icon>
      </div>
    </div>
    <div v-show="!visible" class="footer-bar-toggle">
      <v-btn icon="mdi-alert-box-outline" color="primary" @click="handleShow" />
    </div>
</v-footer>
</template>
<script >
import { inject } from 'vue';
import { find } from 'lodash';
import {mapFields} from "vuex-map-fields";
import ReadMore from "@/components/readMore/index.vue";
import {mapState} from "vuex";

export default {
  name: 'AppFooter',
  components: {ReadMore},

  data: () => ({
    visible: true,
    pageDesc: "",
    VUE_APP_VERSION: inject('VUE_APP_VERSION'),
    VUE_APP_REGION: inject('VUE_APP_REGION')
  }),
  computed: {
    ...mapState("app", ["menuData"]),
    ...mapFields('auth', ['userInfo'])
  },
  watch: {
    menuData: {
      handler: function(val) {
        if (val && val.length > 0) {
          this.initDesc(val);
        }
      }
    },
    $route: {
      handler: function(val){
        this.initDesc(this.menuData);
      },
      // 深度观察监听
      deep: true,
      immediate: true
    }
  },
  methods: {
    initDesc(menuData) {
      const { path } = this.$route;
      const route = find(menuData, { href: path });
      this.visible = true;
      if (!route) {
        this.pageDesc = "404";
        return;
      }
      this.pageDesc = route.desc;
    },
    handleRichTextClick(event) {
      const targetElement = event.target;
      // 过滤非内容元素的点击（例如父容器）
      if (targetElement === event.currentTarget) return;
      const { name } = this.$route;
      this.$emitter.emit('footerEvent', {
        "name": name,
        "type": targetElement.textContent,
      })
    },
    handleShow() {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
      const { name } = this.$route;
      this.$emitter.emit('footerEvent', {
        "name": name,
        "type": "all",
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.footer-bar {
  position: fixed;
  left: 256px;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 0 16px;
  background-color: transparent;
  &-content {
    position: relative;
    width: 100%;
    border-radius: 20px 20px 0 0;
    background: #ffffff;
    padding: 12px 24px;
    box-shadow: -3px -5px 7px rgba(0, 0, 0, 0.1);
    .desc {
      pointer-events: auto;
      color: #000;
      font-family: Roboto,serif;
      font-size: 14px;
      font-weight: 500;
      font-style: normal;
      line-height: 20px;
      letter-spacing: 0.1px;
      word-wrap: break-word;
      white-space: break-spaces;
      .readMore {
        display: flex;
        align-items: center;
        padding: 0;
      }
      ::v-deep .readMore-action {
        flex-shrink: 0;
        padding-right: 20px;
      }
      ::v-deep {
        span {
          cursor: pointer;
          font-weight: bold;
          color: #f58423;
          text-decoration: underline;
        }
      }
    }
    .copyright {
      color: #000;
      font-family: Roboto,serif;
      font-size: 13px;
      font-style: normal;
      line-height: 20px;
      letter-spacing: 0.1px;
      text-align: right;
    }
    &-action {
      position: absolute;
      right: 0;
      top: 0;
      z-index: 1;
      padding: 6px 12px;
      cursor: pointer;
    }
  }
  &-toggle {
    position: fixed;
    right: 24px;
    bottom: 20px;
    z-index: 99;
    transition: display 0.3s ease, transform 0.3s ease;
    ::v-deep .v-btn {  // 穿透scoped样式
      .v-icon {
        color: white !important;
      }
    }
  }
}
</style>
