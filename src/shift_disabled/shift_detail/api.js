import API from '@/api';

export default {
    // 查询
    getAll: (q) => API.get('shift/', {
        params: {
            q,
            page: 1,
            itemsPerPage: 20,
            sortBy: ["updated_at"],
            descending: [false],
        },
    }),
    // 保存/修改
    save: (params) => params.id ? API.put(`/shift/${params.id}`, params) : API.post('/shift/', params),

    // // 修改状态值
    // updateStatus: (id, status) => API.put(`/shift/change_shift_status/${id}`, {
    //     "shift_status": status
    // }),
    
    // 根据ID获取详情
    getDetailById: (id) => API.get(`/shift/${id}`),
}