import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spcombel/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spcombel/${params.id}`, params) : API.post("/spcombel/", params);
    },
    remove(id) {
        return API.delete(`/spcombel/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spcombel/copy_to", {
            before_code,
            after_code,
        });
    },
};
