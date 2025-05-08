import API from '@/api';

export default {
  getAll(options) {
    return API.get("/finished_product/reserve/", {params: {...options}});
  },
  reserve(params) {
    return API.post("/finished_product/reserve", params)
  },
  createTestSample(params) {
    return API.post("/finished_product/cut_test_sample/Reserve", params)
  },
};
