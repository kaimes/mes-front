import {defineStore} from "pinia";
import API from "@/api";
import store from "@/store";
import { toRaw } from "vue";

// 通用store 存储公用的数据
const useCommonStore = defineStore(
  'common',
  {
    state: () => ({
      runout: {},
      cast: {},
      test_sample: {},
      product_type: {},
      spec: {},
      device: 'desktop',
      // 设置字典表 从default_job_flex_form_data里面取
      dict: {},
      // Table字段显示隐藏配置
      table: {},
      // 底部footer事件监听
      footer: {}
    }),
    actions: {
      async initDictData() {
        // 默认空对象，确保始终有值
        const defaultDict = {};
        const defaultTable = {};
        const defaultFooter = {};
        
        try {
   
          const orgData = store.state.org.selected;
          
          const hasStoreData = orgData && 
                               Object.keys(orgData).length > 0 && 
                               orgData.default_job_flex_form_data && 
                               Object.keys(orgData.default_job_flex_form_data).length > 0;
          
          if (hasStoreData) {
            // 使用store中数据
            this.dict = toRaw(orgData.default_job_flex_form_data) || defaultDict;
            this.table = toRaw(orgData.work_calendar) || defaultTable;
            this.footer = toRaw(orgData.default_worker_flex_form_data) || defaultFooter;
            return;  
          }
          
  

          await store.dispatch('org/getOrg');
          const updatedOrgData = store.state.org.selected;
          const hasUpdatedData = updatedOrgData && 
                                Object.keys(updatedOrgData).length > 0 && 
                                updatedOrgData.default_job_flex_form_data && 
                                Object.keys(updatedOrgData.default_job_flex_form_data).length > 0;
          
          if (hasUpdatedData) {
            this.dict = toRaw(updatedOrgData.default_job_flex_form_data) || defaultDict;
            this.table = toRaw(updatedOrgData.work_calendar) || defaultTable;
            this.footer = toRaw(updatedOrgData.default_worker_flex_form_data) || defaultFooter;
            return; 
          }
          

          const { status, data } = await API.get("/orgs/");
          if (status === 200 && data && data.default_job_flex_form_data) {
            this.dict = data.default_job_flex_form_data || defaultDict;
            this.table = data.work_calendar || defaultTable;
            this.footer = data.default_worker_flex_form_data || defaultFooter;
            
          
            store.commit('org/SET_SELECTED', data);
            return;
          }
        } catch (err) {
          console.error("获取数据失败:", err);
        }
        
        this.dict = this.dict || defaultDict;
        this.table = this.table || defaultTable;
        this.footer = this.footer || defaultFooter;
      },
      setTableData(value) {
        this.table = value;
      },
      setSpec(value) {
        this.spec = value;
      },
      setTestSample(value) {
        this.test_sample = value;
      },
      setRunOut(value) {
        this.runout = value;
      },
      setCast(value) {
        this.cast = value;
      },
      setFooterEvent(value) {
        this.footer = value;
      }
    }
  })

export default useCommonStore
