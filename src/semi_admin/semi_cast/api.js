import API, {download} from '@/api';

export default {
    getAll(options) {
        return API.get("/cast/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/cast/${params.id}`, params) : API.post("/cast/", params);
    },
    remove(id) {
        return API.delete(`/cast/${id}`);
    },
    import(payload) {
        return API.post(`/cast/import_cast`, payload);
    },
    createCode() {
      return API.get('/cast/code/generate_code');
    },
    export(params) {
      return download(`/cast/export_cast_file`, null, "cast_list.csv", { params: { ...params } });
    },
    importnew(payload){
        return API.post(`cast/import_cast_file_new`, payload);
    },
    getQualityMainel(qualityId){
        return API.get(`cast/cast_quality/item/${qualityId}`);
      },
};
