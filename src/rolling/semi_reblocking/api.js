import API from '@/api';

const resource = '/semi';
export default {
  getAll(options) {
    return API.get(`${resource}/`, {params: {...options}});
  },
  update(params) {
    return API.put(`${resource}/${params.id}`, params);
  },
  requestCommonGet(path) {
    return API.get(path);
  },
  blockAction(params) {
    return API.post("/semi/block", params); // Updated to /semi/block
  },
  unblockAction(params) {
    return API.post("/semi/unblock", params); // New API for /semi/unblock
  },
}
