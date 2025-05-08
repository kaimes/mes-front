import API from '@/api';
import LabelPrint from './components/labelPrint.vue';

export default {
  getAll(options) {
    return API.get("/finished_product/", {params: {...options}});
  },
  hold(params) {
    return API.post("/finished_product/update_add_hold", params);
  },
  unHold(params) {
    return API.post("/finished_product/update_delete_hold", params);
  },
  rework(params) {
    return API.put("/finished_product/rework", params);
  },
  reworkConfirm(params) {
    return API.put(`/finished_product/rework/complete`, params);
  },
  move(params) {
    return API.post("/finished_product/move_to", params);
  },
  save(params) {
    return API.post("/finished_product/", params);
  },
  remove(id, payload = {}) {
    return API.delete(`/finished_product/${id}`, { data: payload });
  },
  getCoveringAll(id, options) {
    return API.get(`/finished_product/covering/${id}`, {params: {...options}});
  },
  regrade(params) {
    return API.post("/finished_product/regrade", params);
  },
  forceRegrade(params) {
    return API.post("/finished_product/force_regrade", params);
  },
  uncover(params) {
    return API.post("/cover_end_use/uncover", params);
  },
  allocate(params) {
    return API.post("/finished_product/allocate_change_type", params)
  },
  getMultById(id) {
    return API.get(`/finished_product/mult/${id}`);
  },
  createMult(params) {
    return API.put("/finished_product/allocate_mult", params);
  },
  getCompliance(params) {
    return API.post("/finished_product/get_compliance", params)
  },
  getSiteByArea(id) {
    return API.get(`/area/item/get_site_by_area/${id}`);
  },
  createRepeat(params) {
    return API.post("/finished_product/repeat_create", params);
  },
  defects(params) {
    return API.post("/finished_product/defects", params)
  },
  createLoad(params) {
    return API.post("/finished_product/load_create", params);
  },
  getMaxID() {
    return API.get("/finished_product_load/max_id");
  },
  updateArchieve(params) {
    return API.post("/finished_product/archieve", params)
  },
  updateRetrieve(params) {
    return API.post("/finished_product/retrieve", params)
  },
  updateReturn(params){
    return API.post("/finished_product/return", params)
  },
  updateSplit(params){
    return API.post("/finished_product/split", params)
  },
  updateCombine(params) {
    return API.post("/finished_product/combine", params)
  },
  update(params) {return API.put(`/finished_product/${params.id}`, params)},

  updateCovering(params) { return API.post(`/cover_end_use/init_test/${params.id}`,{}) },

  createTestSample(params) {
    return API.post("/finished_product/cut_test_sample/PartSawn", params)
  },

  getSpecByRunout(params){
    return API.get("/cover_end_use/get_spec_by_runout",{params})
  },

  LabelPrintPost(params){
    return API.post("/finished_product/label_print", params)
  },
  updateRebundel(params){
    return API.post("/finished_product/comments/rebundle", params)
  }
};
