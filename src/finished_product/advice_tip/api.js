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
    save: (params) => params.id ? API.put(`/advice/tip_update/${params.id}`, params) : API.post('/advice/', params),

    // 根据ID获取详情
    getDetailById: (id) => API.get(`/advice/detail/${id}`),

    getFinishedProduct: (params) => API.post(`/advice/finished_product`,params),

    sendtip(id) {
        return API.get(`/advice/tip/${id}`);
    },

}
