import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spelong/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spelong/${params.id}`, params) : API.post("/spelong/", params);
    },
    remove(id) {
        return API.delete(`/spelong/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spelong/copy_to", {
            before_code,
            after_code,
        });
    },
};
