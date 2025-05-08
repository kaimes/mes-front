import API from '@/api';

export default {
  getAllData(options) {
    return API.get('/test/', {params: {...options}});
  },
  getAll(options) {
    return API.get("/test/print_status/list", {params: {...options}});
  },
  bulkUpdate(params){
    return API.put("/test/bulk_update/print_status", params)
  },
};
