import API from '@/api';

export default {
    getAll(type, options) {
        return API.get(`/${type}_other_element/`, { params: { ...options } });
    },
    add(type, parentId, params) {
        return params.id ? API.put(`/${type}_other_element/${params.id}`, params) : API.post(`/${type}_other_element/${parentId}`, {
          "other_element": [params],
        });
    },
    remove(type, id) {
        return API.delete(`/${type}_other_element/${id}`);
    },
};
