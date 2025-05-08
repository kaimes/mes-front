import API from '@/api';
import { update } from 'lodash';

export default {
    getAll(options) {
        return API.get(`/finished_product_load/`, { params: { ...options } });
    },
    save(params) {
        return params.id ? API.put(`/finished_product_load/${params.id}`, params) : API.post('/finished_product_load/', params);
    },
    getById(id) {
        return API.get(`/finished_product_load/${id}`);
    },
    deleteById(id) {
        return API.delete(`/finished_product_load/${id}`);
    },
    getByCode(code) {
        return API.get(`/finished_product_load/code/${code}`);
    },
    move(params) {
        return API.post("/finished_product_load/move_to", params);
    },

    moveLoad(params) {
        return API.post("/finished_product/move_to", params);
    },
    tip(params) {
        return API.post("/finished_product_load/tip", params);
    },
    getFinishedProducts(options) {
      return API.get("/finished_product/", {params: {...options}});
    },
    getTip(id) {
        return API.get(`/finished_product_load/finished/${id}`);
    },
    updatecarry(params) {
      return API.put("/finished_product_load/carry", params);
    },
    updateSplit(params){
        return API.post("/finished_product/split", params)
      },
    createAdvice(params){
        return API.post("/advice/load_create_advice", params);
    }
};
