import API from '@/api';

export default {
    // 查询
    getAll: (q) => API.get('advice/detail/', {
        params: {
            q,
            page: 1,
            itemsPerPage: 20,
            sortBy: ["updated_at"],
            descending: [false],
        },
    }),
    // 保存/修改
    save: (params) => params.id ? API.put(`/advice/${params.id}`, params) : API.post('/advice/', params),

    // 根据ID获取详情
    getDetailById: (id) => API.get(`/advice/detail/${id}`),

    // 获取load记录
    getByLoadId(id) {
        return API.get(`/finished_product_load/${id}`);
    },

    getByTransportId(id) {
        return API.get(`/transport/${id}`);
    },

    getFinishedProduct: (params) => API.post(`/advice/finished_product`,params),

    getOrderItem: (params) => API.post(`/advice/order_item`,params),

    // remove: (id) => API.delete(`/advice/${id}`)
    remove(id) {
        return API.delete(`/advice/${id}`);
    },
    // search(options) {
    //     return API.get(`/advice/detail/${id}`);
    // },
    // getFinishedProducts(options) {
    //     return API.get("/finished_product/", {params: {...options}});
    // },
    addFinishedProduct(finished_product_id, params) {
        return API.put(`/advice/update_finished_product/${finished_product_id}`, params);
    },
    getFinishedProductByIds(params) {
        return API.post("/advice/detail/finished_product", params);
    },
    inspectFinishedProduct(params){
        return API.post("/advice/inspect_finished_product", params);
    },
    printLabel(params) {
      return API.post(`/advice/print_label/${params.id}`, params);
    }
}
