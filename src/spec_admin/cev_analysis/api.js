import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spcevan/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spcevan/${params.id}`, params) : API.post("/spcevan/", params);
    },
    remove(id) {
        return API.delete(`/spcevan/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spcevan/copy_to", {
            before_code,
            after_code,
        });
    },
};
