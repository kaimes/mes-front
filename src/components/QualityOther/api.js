import API from '@/api';

export default {
    getAll(type, options) {
        return API.get(`/${type}quality_other_element/`, { params: { ...options } });
    },
    add(type, parentId, params) {
        return params.id ? API.put(`/${type}quality_other_element/${params.id}`, params) : API.post(`/${type}_other_element/${parentId}`, {
          "other_element": [params],
        });
    },
    remove(type, id) {
        return API.delete(`/${type}quality_other_element/${id}`);
    },
};
