import API from '@/api';

const resource = '/product_hydrogen_test_card';


export default {
    // 查询
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    // 保存/修改
    save: (params) => params.id ? API.put(`${resource}/${params.id}`, params) : API.post(`${resource}/`, params),

    // 根据ID获取详情
    getDetailById: (id) => API.get(`${resource}/${id}`),


}
