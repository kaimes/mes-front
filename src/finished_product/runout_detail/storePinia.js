
import { defineStore } from 'pinia';
import { useAppStore } from '../..//app/storePinia'

import specApi from "@/spec_admin/spec/api";
import { getI18nText } from '@/util/i18nHelper';


const namespace = 'spec_detail';
const getDefaultSelectedState = () => {

}
const state = {
    search_code: null,
    spec_page_model: {},
    update_dict: {},
    config: {
        saveFlag: false,
        editFlag: false,
    },
    general_info_list: [
        { title: 'Runout Bar No', key: 'xxx' },
        { title: 'Rolling No', key: 'rolling_code' },
        { title: 'KG', key: 'xxx' },
        { title: 'SAW Date And Time', key: 'runout_cutting_date' },
        { title: 'Sawn By Swift', key: 'xxx' },
    ],
    slab_dimensions_list: [
        { title: 'Furnace Seq No', key: 'furnace_sequence_number' },
        { title: 'Cast No', key: 'cast_code' },
        { title: 'Semi No', key: 'semi_code' },
        { title: 'Length (mm)', key: 'xxx' },
        { title: 'Width (mm)', key: 'xx' },
        { title: 'Thickness (mm)', key: 'xxx' },
        { title: 'Weight (Tonnes)', key: 'cert_units' },
    ],
    rolling_info_list: [
        { title: 'SAW Losses', key: 'cutting_loss_length_mm' },
        { title: 'Test Piece Size', key: 'xxx' },
        { title: 'BKP', key: 'xxx' },
        { title: 'Tolerance No', key: 'xxx' },
        { title: 'Final Yield', key: 'xxx' },
        { title: 'Tested Alternative Specs', key: 'xxx' },
    ],
    
  
      
}
const mutations = {


}
const actions = {

    getById(){
        return specApi.get(this.spec_page_model.id).then((response)=>{

            this.spec_page_model = response.data
        })
    },
    // getSpecPageModel() {
    //     const spec = useSpecStore()
    //     this.spec_page_model = spec.spec_page_model

    // },

    searchData(code) {

        return specApi.getCode(code)
            .then((response) => {
                this.update_dict = {}
                this.spec_page_model = response.data
            })

    },

    save() {
        return specApi.update(this.spec_page_model).then(() => {
            this.config.saveFlag = false
            this.messageAlert("spec updated successfully.")
            this.getById()

        })

    },

    ...mutations,
    async messageAlert(message, color) {
        const app = useAppStore()
        app.message(message, color)
      },

}
const getters = {


}

export const useSpecDetailStore = defineStore(namespace, {
    id: namespace,
    state: () => {
        return state
    },
    getters,
    actions
})