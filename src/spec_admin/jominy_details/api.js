import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spjominy/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spjominy/${params.id}`, params) : API.post("/spjominy/", params);
    },
    remove(id) {
        return API.delete(`/spjominy/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spjominy/copy_to", {
            before_code,
            after_code,
        });
    },
};
