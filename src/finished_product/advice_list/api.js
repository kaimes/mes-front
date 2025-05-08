import API from '@/api';

export default {
    getAll(options) {
        return API.get("/advice/", { params: { ...options } });
    },
    // search(options) {
    //     return API.get(`/advice/detail/${id}`);
    // },
    getDetailById: (id) => API.get(`/advice/detail/${id}`),

    create(params) {
        return API.post("/advice/", params);
    },
    remove(id) {
        return API.delete(`/advice/${id}`);
    },
    getSplitData(id, options) {
        return API.get(`/advice/split/${id}`, { params: { ...options } });
    },
    splitAction(id, params) {
        return API.post(`/advice/split/${id}`, params);
    },
    cancelUpdate(params) {
        return API.put(`/advice/update_cancel`, params);
    },
    deloadUpdate(params) {
        return API.put(`/advice/update_deload`, params);
    },
    move(params) {
        return API.post("/advice/move_to", params);
    },
    save(params) {
        return API.put("/advice/tip_update", params);
    },
    return(params){
        return API.post("/advice/return", params);
    },
    sendtip(id, { action }) {
        return API.get(`/advice/tip/${id}`, { params: { action } });
    },
    getTip(params) {
        return API.post(`/advice/finished`, { params: { ...params } });
    },
    getMaxID(options) {
        return API.get("/advice/max_id", { params: { ...options } });
    },
    replace(id, params){
        return API.post(`/advice/replace/${id}`, params);
    }

};
