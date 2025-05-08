import store from "@/store";
import {getAccessToken} from "@/util/util";
import { useAuthStore } from './storePinia'

function login(to, from, next) {
  const token = getAccessToken();
  if (token) {
    store.commit("auth/SET_USER_LOGIN", token);
    const auth = useAuthStore();
    auth.SET_USER_LOGIN(token);
    next();
  } else {
    if (to.path !== "/login") {
      next("/login");
    } else {
      next();
    }
  }
}

function logout(next) {
  store.commit("auth/SET_USER_LOGOUT");
  next();
}

export default {
  login,
  logout,
};
