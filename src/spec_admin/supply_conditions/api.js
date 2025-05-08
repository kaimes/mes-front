import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spscond/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spscond/${params.id}`, params) : API.post("/spscond/", params);
    },
    remove(id) {
        return API.delete(`/spscond/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spscond/copy_to", {
            before_code,
            after_code,
        });
    },
};
