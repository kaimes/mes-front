import API from '@/api';
import { get } from 'lodash';

const resource = '/test';

export default {
  getAll(options) {
    return API.get(`${resource}/`, {params: {...options}});
  },
  add(params) {
    return params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params);
  },
  save(params) {
    return params.id ? API.put('/test/new/update', params) : API.post('/test/new/create', params);
  },
  getDetail(id) {
    return API.get(`/test/new/get/${id}`);
  },
  remove(id) {
    return API.delete(`/test/new/delete/${id}`);
  },
  getTestCoverageList(options) {
    return API.get("/test_coverage/", {params: {...options}});
  },
  getSemiBloomTotal(path){
    return API.get(path)
  },
  getRollRefCode(path, options){
    return API.post(path, options)
  },
  getSpecTemp(options){
    return API.post("/test/impact/spec_temp", options)
  },
  getSpbend(path, options){
    return API.post(path, options)
  },
  bulkUpdate(params){
    return API.put("/test/bulk_update/print_status", params)
  },
  autopass(){
    return API.post("/cover_end_use/init_test/cover_all")
  },

  getSpTensileSpecRequire(params){
    return API.get("/sptensil/test/get_test_require", {params: {...params}})
  },
  getSpImpactSpecRequire(params){
    return API.get("/spimpact/test/get_test_require", {params: {...params}})
  },
  getByTestJobtId(id){
    return API.get(`/test_job/${id}`);
  },
  getTestSpec(params){
    return API.get("/test/test_spec", {params: {...params}})
  }

};
