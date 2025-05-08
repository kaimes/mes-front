import API from '@/api';

export default {
  getAll: (params) => API.get('/cut_sequence_plan/',{params}),

  create: (params) => API.post(`/cut_sequence_plan/create`, params),

  autoplan: (params) => API.post(`/cut_sequence_plan/autoplanbyrolling`, params),

  move: (params) => API.post(`/cut_sequence_plan/move`, params),

  split: (params) => API.post(`/cut_sequence_plan/split`, params),

  print: (params) => API.post(`/cut_sequence_plan/print`, params),

  createLoad: (params) => API.post(`/finished_product_load/cut_seq/create`, params),

  getLoads: (params) => API.get(`/finished_product_load/cut_seq/loads?cut_seq_id=${params}`),
  
  getLoadOptions: (params) => API.get(`/finished_product_load/cut_seq/load/options`, {params}),

  autoLoadPlan: (params) => API.post(`cut_sequence_plan/auto_load_plan`, params),

  createCutSequence: (params) => API.post(`/cut_sequence_plan/create`, params),

  deleteCutSequence: (params) => API.delete(`/cut_sequence_plan/${params}`),

  getOrderItemOptions: (params) => API.get(`/order_item/cut_seq/options`, {params}),

  printLoadInstruction: (params) => API.get(`/cut_sequence_plan/print/load_instructions`, {params})

}
