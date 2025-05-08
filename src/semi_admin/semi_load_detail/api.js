import API from '@/api';

export default {
    // 查询
    getSemiAll(options) {
        return API.get("/semi/", { params: { ...options } });
    },
    // 保存/修改
    save: (params) => params.id ? API.put(`/semi_load/${params.id}`, params) :  API.post("/semi_load/", params),

    // 根据ID获取详情
    getDetailById: (id) => API.get(`/semi_load/${id}`),

    confirmReceiving:(params) => API.post(`/semi_load/update_status`, params),

    addSemi(semi_id, params) {
        return API.put(`/semi_load/update_semi/${semi_id}`, params);
    },
    tipSemi:(params) => API.post(`/semi_load/tip`, params), 

    castQualityCompare: (ids) => API.post(`/cast/cast_quality/compare`, { semi_load_ids: ids })

}