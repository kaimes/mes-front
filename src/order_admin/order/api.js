import API from '@/api';

export default {
  getAll(options) {
    return API.get("/order/", {params: {...options}});
  },
  get(id) {
    return API.get(`/order/${id}`);
  },
  getOrderItem(options) {
    return API.get("/order_item/", {params: {...options}});
  },
  getOrderRemark(orderId){
    return API.get(`/order_remark/order/${orderId}`);
  },

  create(payload) {
    return API.post("/order/", payload);
  },

  update(payload) {
    return API.put(`/order/${payload.id}`, payload);
  },

  delete(locationId) {
    return API.delete(`/order/${locationId}`);
  }
};
