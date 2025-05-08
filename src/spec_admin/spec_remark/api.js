import API from '@/api';

export default {
    getAll(options) {
        return API.get("/remark/get_all/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/remark/update/${params.id}`, params) : API.post("/remark/create", params);
    },
    remove(id) {
        return API.delete(`/remark/${id}`);
    },

};
