import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spria/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spria/${params.id}`, params) : API.post("/spria/", params);
    },
    remove(id) {
        return API.delete(`/spria/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spria/copy_to", {
            before_code,
            after_code,
        });
    },
};
