import { createStore } from "vuex"

import app from "@/app/store";
import common from "@/app/common";
import service from "@/service/store";
import auth from "@/auth/store";
import plugin from "@/plugin/store";

import service_plugin from "@/service_plugin/store";
import org from "@/org/store";
import operation_log from "@/operation_log/store";
import rolling_list from "@/rolling/rolling_list/store";
import product_type from "@/product_type/store"
import message_log from "@/message_log/store";


export default createStore({
  modules: {
    app,
    auth,
    plugin,
    common,
    service,
    service_plugin,
    org,
    operation_log,
    rolling_list,
    product_type,
    message_log,
  },
})
