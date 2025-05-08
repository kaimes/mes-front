import API from '@/api';

const resource = '/spec';

const semi_load_resource = '/semi_load';
const rolling_resource = '/rolling';
const order_group_resource = '/order_group';
const site_resource = '/site';
export default {
    getSiteAll(options) {
        return API.get(`${site_resource}/`, { params: { ...options } });
    },
    getOrderGroupAll(options) {
        return API.get(`${order_group_resource}/`, { params: { ...options } });
    },
    getSamiLoadAll(options) {
        return API.get(`${semi_load_resource}/`, { params: { ...options } });
    },
    getRollingAll(options) {
        return API.get(`${rolling_resource}/`, { params: { ...options } });
    },
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    get(locationId) {
        return API.get(`${resource}/${locationId}`);
    },

    getCode(spec_code) {
        return API.get(`${resource}/spec_code/${spec_code}`);
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
    getCodeIlike(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    getInspectorSelect() {
        return API.get(`/inspector/data/inspectorSelect`);
    },
    copy(payload) {
        return API.post(`${resource}/copy/${payload.id}`, payload);
    },
    updateVersion(locationId) {
        return API.post(`${resource}/spec_version`,{id:locationId});
    },
    archive_spec_version(locationId) {
        return API.post(`${resource}/archive_spec_version`,{id:locationId});
    }
};
