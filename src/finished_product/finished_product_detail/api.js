import API from '@/api';

export default {
    // 查询
    getAll: (q) => API.get('finished_product/', {
        params: {
            q,
            page: 1,
            itemsPerPage: 20,
            sortBy: ["updated_at"],
            descending: [false],
        },
    }),
    // 保存/修改
    save: (params) => params.id ? API.put(`/finished_product/${params.id}`, params) : API.post('/finished_product/', params),

    // 根据ID获取详情
    getDetailById: (id) => API.get(`/finished_product/${id}`),

    // 
    getBySearch: (params) => API.post('/finished_product/get_by_search_dict', params),

    getTestCoverageId(options) {
        return API.get("/test_coverage/", {params: {...options}});
    },
    // 新增: 获取Required Tests
    getRequiredTests(options) {
        return API.get("/required_test_cover/", {params: {...options}});
    },
    getProductSize(options) {
      return API.get("/product_type/", {params: {...options}});
    },
    getMaxCutCode: (id) => API.get(`/finished_product/get_max_cut_code/${id}`),


}
