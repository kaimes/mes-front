import API from '@/api';

const resource = '/menu';

export default {
    getTreeTopSelect(options) {
        return API.get(`${resource}/data/treeTop`, { params: { ...options } });
    },
    getTreeData(options) {
        return API.get(`${resource}/data/treeSelect`, { params: { ...options } });
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
    }
};
