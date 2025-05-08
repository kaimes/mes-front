import API, {download} from '@/api';

const resource = '/semi';

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

    create(payload) {
        return API.post(`${resource}/`, payload);
    },

    update(payload) {
        return API.put(`${resource}/${payload.id}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },

    updateSemi(path, payload) {
        return API.post(path, payload);
    },
    
    getSemi(path) {
        return API.get(path)
    },

    get_site_area_code(path, ids){
        return API.post(path, ids)
    },
    
    rework(params) {
        return API.put(`${resource}/rework`, params);
    },
    
    reworkConfirm(params) {
        return API.put(`${resource}/rework/complete`, params);
    },

    import(payload){
        return API.post(`${resource}/import_semi_file`, payload);
    },

    commenRequestGet(path){
        return API.get(path)
    },

    getAllNew(path, options) {
        return API.get(path, { params: { ...options } });
    },
    defects(params) {
        return API.post("/semi/defects", params)
    },
    scrap(params) {
        return API.put(`/semi/scrap/${params.id}`, params)
    },
    hold(params) {
      return API.post("/semi/update_add_hold", params);
    },
    unHold(params) {
      return API.post("/semi/update_delete_hold", params);
    },

    returnSemi(params) {
      return API.put(`/semi/return`, params);
    },
    export(params) {
        return download(`/semi/export_semi_file`,null,"semi_list.csv",{params:params});
    },
    importnew(payload){
        return API.post(`${resource}/import_semi_file_new`, payload);
    },
    
};
