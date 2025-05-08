import API from '@/api';

export default {
    getAll(options) {
        return API.get("/spmillref/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/spmillref/${params.id}`, params) : API.post("/spmillref/", params);
    },
    remove(id) {
        return API.delete(`/spmillref/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spmillref/copy_to", {
            before_code,
            after_code,
        });
    },
    getAllMill(options) {
        return API.get("/mill/all_mill_codes/", { params: { ...options } });
    },
    
};
