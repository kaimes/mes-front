import API from '@/api';

const resource = '/role';

export default {
    getRoleSelect() {
        return API.get(`${resource}/data/roleSelect`);
    },
    getMenuTreeSelect(id) {
        return API.get(`menu/data/menuTreeSelect/${id}`);
    },
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    get(locationId) {
        return API.get(`${resource}/${locationId}`);
    },

    create(payload) {
        return API.post(`${resource}/`, payload);
    },

    update(payload) {
        return API.put(`${resource}/${payload.id}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },
    
    copy(payload) {
      return API.post(`${resource}/copy/${payload.id}`,payload);
  },
    gitSearch(payloadId) {
      return API.get(`${resource}/search/${payloadId.id}`, { params: payloadId });
    },
    getRole(id) {
      return API.get(`${resource}/search/role/${id}`);
    }
};
