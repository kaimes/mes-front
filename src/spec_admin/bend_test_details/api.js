import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spbend/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spbend/${params.id}`, params) : API.post("/spbend/", params);
    },
    remove(id) {
        return API.delete(`/spbend/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spbend/copy_to", {
            before_code,
            after_code,
        });
    },
};
