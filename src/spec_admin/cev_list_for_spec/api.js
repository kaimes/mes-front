import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spcev/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spcev/${params.id}`, params) : API.post("/spcev/", params);
    },
    remove(id) {
        return API.delete(`/spcev/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spcev/copy_to", {
            before_code,
            after_code,
        });
    },
};
