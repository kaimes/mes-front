import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spsource/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spsource/${params.id}`, params) : API.post("/spsource/", params);
    },
    remove(id) {
        return API.delete(`/spsource/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spsource/copy_to", {
            before_code,
            after_code,
        });
    },
};
