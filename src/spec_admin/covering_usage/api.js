import API from '@/api';

const resource = '/test_sample';

export default {
    getAll(options) {
        return API.get(`${resource}/covering_usage`, { params: { ...options } });
    },
   updateCover(params){
      return API.post("/cover_end_use/init_test/rolling_and_cast",null,{params})
   }
};
