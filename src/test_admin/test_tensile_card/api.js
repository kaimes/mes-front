import API from '@/api';

const resource = '/test_tensile';

export default {
    // 查询
    getAll: (q) => API.get(`${resource}`, {
        params: {
            q,
            page: 1,
            itemsPerPage: 20,
            sortBy: ["updated_at"],
            descending: [false],
        },
    }),
    // 保存/修改
    save: (params) => params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params),

    // 根据ID获取详情
    getDetailById: (id) => API.get(`${resource}/${id}`),


}
