import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spyield/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spyield/${params.id}`, params) : API.post("/spyield/", params);
    },
    remove(id) {
        return API.delete(`/spyield/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spyield/copy_to", {
            before_code,
            after_code,
        });
    },
};
