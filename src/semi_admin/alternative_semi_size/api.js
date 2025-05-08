import API from '@/api';
import api from '@/mill/api';

export default {
    getAll(options) {
        return API.get("/alternative_semi_size/", { params: { ...options } });
    },
    add(params) {
        return params.id ? API.put(`/alternative_semi_size/${params.id}`, params) : API.post("/alternative_semi_size/", params);
    },
    remove(id) {
        return API.delete(`/alternative_semi_size/${id}`);
    },
    copyTo(before_code, after_code) {
        return API.post("/spimpact/copy_to", {
            before_code,
            after_code,
        });
    },
    getWidthThick() {
      return API.get("/semi_size/item/width_thick")
    },
    getLengthByID() {
      return API.get("/semi_size_detail/item/length")
    }
};
