import API from '@/api';

export default {
    // 查询
    getAll: (q) => API.get('rolling/', {
        params: {
            q,
            page: 1,
            itemsPerPage: 20,
            sortBy: ["updated_at"],
            descending: [false],
        },
    }),
    getOrderItem(options) {
        return API.get(`/order_item/order_item_rolling`, { params: { ...options } });
    },
    // 保存/修改
    save: (params) => params.id ? API.put(`/rolling/${params.id}`, params) : API.post('/rolling/', params),
    // 修改状态值
    updateStatus: (id, status) => API.put(`/rolling/change_rolling_status/${id}`, {
        "rolling_status": status
    }),
    // 修改状态值
    allocateBlocks: (id) => API.post("/rolling/allocate_blocks", { id }),
    // 根据ID获取详情
    getDetailById: (id) => API.get(`/rolling/${id}`),
    // ByRolling
    autoplanByRolling: (params) => API.post(`/cut_sequence_plan/autoplanbyrolling`, params),
    getSemiData(option){
      return API.get(`/semi/get_semi/${option.rolling_id}`, { params: { ...option } })
    },
    getCoverData(option){
        return API.get(`/semi/get_semi/${option.rolling_id}`, { params: { ...option } })
      },
    getCoverData(option){
        return API.get(`/rolling/finished_count/${option.rolling_id}`, { params: { ...option } })
      },
}
