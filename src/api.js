import axios from "axios";
import axiosRetry from 'axios-retry';
import {saveAs} from "file-saver";
import store from "@/store";
import {blobValidate, getAccessToken} from "@/util/util";
import {toast} from "vue3-toastify";
import router from "./router";

const instance = axios.create({
  baseURL: `${import.meta.env.VUE_APP_BASE_ENV}/api/v1`,
  timeout: 60000
});
axiosRetry(instance, {
  retries: 3, // 最多重试3次
  retryDelay: (retryCount) => Math.min(1000 * Math.pow(2, retryCount), 10000), // 指数退避策略
  retryCondition: (error) => {
    console.info('axiosRetry:', error)
    console.info('axiosRetry:', error.response)
    return !error.response;
  }, // 仅在5xx错误时重试
  // 其他配置...
});
// const authProviderSlug = process.env.VUE_APP_DISPATCH_AUTHENTICATION_PROVIDER_SLUG

instance.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // console.time("rt");
    // 处理全平台的 sortBy 参数,
    // 改前台比改后台要简洁许多
    const {params = {}, method = null} = config;
    const {sortBy = null} = params;
    // post 请求也可能有 sortBy 参数
    if (method === "get" || method === "post") {
      if (params && sortBy) {
        if (sortBy.constructor.name === "Array" && sortBy.length > 0) {
          const data = sortBy[0];
          if (data.constructor.name === "Object") {
            const {key, order} = data;
            params["sortBy"] = [key];
            if (order === "asc") {
              params["descending"] = [false];
            } else {
              params["descending"] = [true];
            }
          }
        }
      }
    }
    // 平均在 0.02ms 不算浪费性能
    // console.timeEnd("rt");

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (err) {
    // TODO account for other auth providers
    // console.log("err.response.status=", err.response?.status);
    if (
      err.response.status == 401 ||
      err.response.status == 403 ||
      err.response.status == 506
    ) {
      console.error("err.response.status=", err.response.status, "going back to login...");
      await store.commit("auth/SET_USER_LOGOUT");
      router.push({path: "/login"});
      // if (authProviderSlug === "dispatch-auth-provider-basic") {
      // }
    }
    return Promise.reject(err);
  }
);

// 通用下载方法
export function download(url, params, filename, config) {
  const loadingId = toast.loading("File Downloading...");
  return instance
    .post(url, params, {
      responseType: "blob",
      ...config
    })
    .then(async data => {
      const isBlob = blobValidate(data.data);
      if (isBlob) {
        const blob = new Blob([data.data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText) || {};
        // 第101行
        toast.error(rspObj.msg || "File Download Error", {
          autoClose: 60000  // 添加
        });
      }
    })
    .catch(r => {
      console.error(r);
      toast.error("File Download Error", {
        autoClose: 60000  // 添加
      });
    }).finally(() => {
      toast.remove(loadingId)
    });
}

export default instance;
