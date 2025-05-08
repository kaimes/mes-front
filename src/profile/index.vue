<template>
  <v-container fluid class="pa-4">
    <!-- 用户信息卡片 -->
    <v-card class="mb-4">
      <v-card-text>
        <v-card min-width="420">
          <div class="d-flex align-center pa-6">
            <v-icon icon="mdi-account-circle" size="30px" />
            <v-list-item
                class="text-h6"
                :title="userInfo?.email || '---'"
            ></v-list-item>
            <v-spacer />
            <v-tooltip text="Edit Password">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-lock-reset" v-bind="props" variant="plain" @click="handleUpdatePassword" />
              </template>
            </v-tooltip>
            <v-tooltip text="Logout">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-logout" v-bind="props" variant="plain" @click="logout" />
              </template>
            </v-tooltip>
          </div>
          <div class="d-flex align-center pa-6">
            <v-list-item
                class="text-h6"
                :title="userInfoSubtitle"
            ></v-list-item>
            <v-spacer />
          </div>
        </v-card>

        <v-card class="mt-4">
          <v-card-title>Home Page</v-card-title>
           <v-row align="center" class="mb-4" >
              <v-col cols="4" class="px-8">
                <MenuCode 
                v-if="role_id"
                v-model="form.menu_id" 
                density="default" 
                :hide-details="false" 
                :roleID="role_id"
                />
              </v-col>
              <v-col cols="auto" class="ml-2">
                <v-btn 
                    @click="saveFavoriteMenus" 
                    color="primary" 
                    variant="elevated"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Save
                </v-btn>
              </v-col>
          </v-row>
          <!-- <v-card-text>
            <v-row>
              <v-col cols="12" sm="4" v-for="(item, index) in favoriteMenuItems" :key="index">
                <v-btn block @click="navigateTo(item.link)" color="primary">
                  <v-icon left>{{ item.icon }}</v-icon>
                  {{ item.title }}
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text> -->
        </v-card>

      </v-card-text>
    </v-card>
    <update-password ref="updatePassword" />
  </v-container>
</template>

<script setup>
import API from '@/api';
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { toast} from "vue3-toastify";
import UpdatePassword from "@/components/UpdatePassword.vue";
import MenuCode from "@/components/picker/MenuCode.vue";
import { ro } from 'date-fns/locale';

// 初始化 store 和 router
const store = useStore();
const router = useRouter();


const updatePassword = ref(null);

const favoriteMenuItems = reactive([]);
const userInfo = computed(() => store.state.auth.userInfo);
const defaultMillCode = computed(() => store.state.auth.defaultMillCode);

const form = reactive({
  menu_id: null,
});

// 计算属性

// 传给menucode 组件:获取menu必须要根据role
const role_id = computed(() => {
  const role_id=  (userInfo.value.role || []).map((item) => item.id)[0]
  console.log("role_id====",role_id)
  return role_id;
});

const userInfoSubtitle = computed(() => {
  if (!userInfo.value) {
    return "ERROR";
  } else {
    const roles = (userInfo.value.role || []).map((item) => item.name);
    return `Role: ${roles.join()} . Mill: ${defaultMillCode.value}`;
  }
});

// 方法
const handleUpdatePassword = () => {
  updatePassword.value.handleShow(userInfo.value.id);
};

const logout = () => {
  store.dispatch("auth/logout");
};

const navigateTo = (route) => {
  router.push(route);
};

// main mene
const saveFavoriteMenus = async () => {
  // 获取选中的菜单项
  // 调用后端接口保存用户的 favoriteMenus
  
  const { status,data } = await API.post(`/user/main_menu/update`, {
      user_id:userInfo.value.id,
      menu_id:form.menu_id}
    );
  if (status === 200) {
    console.log("data",data)

    localStorage.setItem(`home_${userInfo.value.id}`, data);
    toast.success("Home page saved successfully!",{
      position: "bottom-center"
    });

  } else {
    toast.error("Failed to save .",{
      position: "bottom-center"});
  }
};


// watch(userInfo, (newVal) => {

//    console.log("userinfo",userInfo)
//    console.log("newVal",newVal)

//    if (userInfo.value?.id !== undefined) {
//      loadFavoriteMenus();
//    }
// }, { immediate: true });


</script>

<style scoped>
/* 自定义样式保持与现有项目一致 */
.v-card {
  border-radius: 8px;
}
</style>
