import API from '@/api';

export default {
    getAll(options) {
        return API.get("/sptcert/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/sptcert/${params.id}`, params) : API.post("/sptcert/", params);
    },
    remove(id) {
        return API.delete(`/sptcert/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/sptcert/copy_to", {
            before_code,
            after_code,
        });
    },
};
