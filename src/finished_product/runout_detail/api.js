import API from '@/api';

const resource = '/runout';

export default {
    add(params) {
        return params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params);
    },
    getById(id) {
        return API.get(`${resource}/${id}`);
    },
    getByCode(code) {
        return API.get(`${resource}/code/${code}`);
    },
    createTestImpact(params) {
        return API.post('/cover_end_use/impact_spec_post', params);
    },
    updateTestImpact(id, params) {
        return API.put(`/cover_end_use/${id}`, params);
    },
    remove(id) {
      return API.delete(`${resource}/${id}`);
   },
   delete(id) {
      return API.delete(`/cover_end_use/delete_real/${id}`);
   },
   delete_all(id){
    return API.delete(`/cover_end_use/delete_all_by_runout_id/${id}`);
   },
   getCoveringAll(id, options) {
    return API.get(`/cover_end_use/covering/${id}`, {params: {...options}});
  },
   cover_runout(id){
    return API.post(`/cover_end_use/cover_runout/${id}`);
   },
};
