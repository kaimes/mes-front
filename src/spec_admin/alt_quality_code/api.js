import API from '@/api';

export default {
    getAll(options) {
        return API.get("/alt_quality_code/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/alt_quality_code/${params.id}`, params) : API.post("/alt_quality_code/", params);
    },
    remove(id) {
        return API.delete(`/alt_quality_code/${id}`);
    },
    update(id, params) {
        return API.put(`/alt_quality_code/${id}`, params);
      },
};


