import API from '@/api';

const resource = '/test_sample';
export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params);
    },
    remove(id) {
        return API.delete(`${resource}/${id}`);
    },
    reserve(params) {
      return API.post("/test_sample/reserve", params)
    },
    cut(params) {
      return API.post("/test_sample/cut", params)
    },
    getTestResult(params) {
      return API.get("/test_sample/test_result", { params: { ...params } })
    }
};
