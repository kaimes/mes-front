import API from '@/api';

export default {
  getAll(options) {
    return API.get("/finished_product/", {params: {...options}});
  },
  batchHold(params,qp){
    return API.post("/finished_product/batch_hold", params, {params:qp});
   },
  hold(params,qp) {
    return API.post("/finished_product/update_add_hold", params, {params:qp});
  },
  unHold(params, qp) {
    return API.post("/finished_product/update_delete_hold", params, {params:qp});
  },
  batchUnHold(params,qp) {
    return API.post("/finished_product/batch_unHold", params, {params:qp});
  },
  remove(id) {
    return API.delete(`/finished_product/${id}`);
  },
  batchCover(params,qp){
    return API.post("/cover_end_use/batch_cover", params, {params:qp});
  },
  getTestResult(params) {
    return API.post("/finished_product/test_cover", { params: { ...params } })
  },
  batchUnCover(params,qp){
    return API.post("/cover_end_use/batch_uncover", params, {params:qp});
  },

  recommendTests(params){
    return API.get(`/test/srsm/test_recommend`, {params: {...params}});
  }
};
