import API from '@/api';

const message = '/message_server';

export default {
    getAll: (options) => API.get("/order_group/list", { params: { ...options } }),
    reverseOrderGroup: (options) => API.get("/order_group/reverse", { params: { ...options } }),
    orderGroupSplit(params) {
        return API.post("/order_group/split", params);
    },
    batchUpdateOrderGroup(params) {
        return API.post("/order_group/list", params);
    },
    // block / unblock
    blockAction(params) {
        return API.post("/semi/block", params); // Updated to /semi/block
    },
    unblockAction(params) {
        return API.post("/semi/unblock", params); // New API for /semi/unblock
    },
    // reserve / unreserve
    reserveAction(params) {
        return API.post("/semi/reserve", params);
    },
    unreserveAction(params) {
        return API.post("/semi/unreserve", params);
    },

    getBlock(options) {
        return API.get("/cast_spec/", { params: { ...options } });
    },
    reverseOrderGroupBlock: (params) => API.post("/cast_spec/reverse", params),
    getOrderGroupById(id) {
        return API.get(`/order_group/byid/${id}`);
    },
    SendM243ToPC(payload) {
        return API.post(`${message}/call_method/proxy`, payload)
    },
    updateProjectTonnes(params) {
      return API.put(`/order_group/update/project_tonnes`, params);
    },

    getRollingOptions(params) {
        return API.get(`/rolling/item/options?code=${params}`);
    },

    move(id, payload) {
        return API.put(`/order_group/move/${id}`, payload);
    },
    updateRollingStatus(params) {
        return API.put(`/rolling/update_status_by_code/upstatus`, null, {
            params: {
                rolling_code: params.rolling_code,
                rolling_status: params.rolling_status
            }
        });
    }
};
