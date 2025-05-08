import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spimpact/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spimpact/${params.id}`, params) : API.post("/spimpact/", params);
    },
    remove(id) {
        return API.delete(`/spimpact/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spimpact/copy_to", {
            before_code,
            after_code,
        });
    },
};
