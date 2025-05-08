import API from '@/api';

export default {
    getAll(options) {
        return API.get("/sptensil/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/sptensil/${params.id}`, params) : API.post("/sptensil/", params);
    },
    remove(id) {
        return API.delete(`/sptensil/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/sptensil/copy_to", {
            before_code,
            after_code,
        });
    },
};
