import API, { download } from '@/api';

const resource = '/rolling';
const message = '/message_server';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    get(locationId) {
        return API.get(`${resource}/${locationId}`);
    },

    create(payload) {
        return API.post(`${resource}/`, payload);
    },

    update(locationId, payload) {
        return API.put(`${resource}/${locationId}`, payload);
    },

    delete(locationId) {
        return API.delete(`${resource}/${locationId}`);
    },

    import(payload) {
        return API.post(`${resource}/import_rolling_file`, payload);
    },

    importFileFromFTP(payload) {
        return API.post(`${resource}/import_rolling_file_from_ftp`, payload);
    },

    export(params) {
        return download(`${resource}/export_rolling_file`,null,"rolling_list.csv",{params:params});
    },

    exportToFTP(params) {
        console.log("exportToFTP",params);
        return API.post(`${resource}/export_rolling_file_to_ftp`, null, {params: params});
    },

    getSectionType(path){
        return API.get(path)
    },

    getRollingCode(path){
        return API.get(path)
    },

    SendM005ToPC(payload) {
        return API.post(`${message}/call_method/proxy`, payload)
    },

    SendM240ToPC(payload) {
      return API.post(`${resource}/send_pc_m240`, payload);
    },
    updateRollingStatusBatch() {
        return API.post(`${resource}/update_rolling_status_batch`, null, {
            headers: {
              'Content-Type': undefined
            }
          })
    },

};
