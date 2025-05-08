import API from '@/api';

const resource = '/order_item';

export default {
    getAll(options) {
        return API.get(`${resource}/`, { params: { ...options } });
    },
    
    getByOrderId(orderId)  {
        return API.get(`${resource}/order_id/${orderId}`);
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
    getFinishedProductList(options) {
        return API.get("/finished_product/", { params: { ...options } });
    },

    getPlanedLoadList(order_item_id) {
      return API.get(`/finished_product_load/planed_load_list/${order_item_id}`);
    },

    auto_plan(payload) {
      return API.post(`/finished_product_load/auto_plan`, payload);
    },

    delete_load(loadId) {
      return API.delete(`/finished_product_load/${loadId}`);
    },

    create_load(payLoad) {
      return API.post(`/finished_product_load/`, payLoad);
    },

    carry_out(payload) {
      return API.post(`/finished_product_load/carry_out`, payload);
    },

    send_to_pcc(orderItemID, payLoad) {
      return API.post(`/order_item/send_to_pcc/${orderItemID}`, payLoad);
    },

    getOrderRemark(orderId){
      return API.get(`/order_remark/order/${orderId}`);
    },

    getOrderItemRemark(orderItemId){
      return API.get(`/order_item_remark/order_item/${orderItemId}`);
    },

    getBundleMatrix(payLoad){
      return API.get(`/bundle_matrix//by_auto_plan`, { params: payLoad });
    },

    getInfoSpecByOrder(payload){
      return API.get(`/order_item/info/spec_by_order`, { params: payload });
    }
};
