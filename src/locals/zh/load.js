export default {
    table: {
      action: "操作",
      pilling_bogie: "堆垛车", // Pilling Bogie -> 堆垛运输车/轨道车
      code: "编码", // Code -> 材料/任务唯一编号
      load_instruction_no: "装车指令号", // Load Instruction No. -> 装车作业单编号
      to_business_type: "目标业务类型", // To Business Type -> 如：出口、调拨、发货等
      rolling_code: "轧制批次", // Rolling Code -> 轧制批号（用于标识生产批次）
      cut_sequence: "切割顺序", // Cut Sequence -> 切割顺序编号或步骤
      order_item: "订单项", // Order Item -> 销售订单中的具体产品项
      mill_code: "轧机代码", // Mill Code -> 轨道轧机或生产机组代码
      to_area: "目标区域", // To Area -> 成品将被运往的存储/装车区域
      transport_code: "运输编号", // Transport Code -> 运输车辆/集装箱编号
      transport_type: "运输类型", // Transport Type -> 如：火车、卡车、内部转运
      dispatch_date: "发运日期", // Dispatch Date -> 实际或计划发运时间
      stock_in_date: "入库日期", // Stock In Date -> 材料进入库存的时间
      piece_count: "件数", // Piece Count -> 装载物料的数量（以件计数）
      weight: "重量(吨)", // Weight(ton) -> 总装载重量，单位为吨
      customer_code: "客户代码", // Customer Code -> 客户唯一标识码
      load_status: "装车状态", // Load Status -> 如：已装车、待装车、已执行
      transport_status: "运输状态", // Transport Status -> 如：在途、已到达、已发运
      load_type: "装车类型", // Load Type -> 如：整列、零担、拼车
      advice_num: "通知单号", // Advice Num -> 对应的通知单/装车单编号
      comment: "备注", // Comment -> 额外说明信息
      created_at: "创建时间", // Created At -> 记录创建时间
      created_by: "创建人" // Created By -> 创建该记录的操作员
    },
    button: {
      carry_out: "执行", // Carry Out -> 执行装车/发运操作
      move: "移动" // Move -> 移动装车任务或物料位置
    },
  
    search_hint: "通过编码搜索", // Search by code -> 输入编码进行搜索
  
    delete: {
      delete_title: "删除该厂区?", // Delete this Site?
      comform_delete: "你确定要删除此厂区吗?" // Confirm deletion
    },
  
    edit: {
      service_code: "服务编码", // Service Code
      service_name: "服务名称", // Service Name
      description: "描述", // Description
      description_hint: "请为此服务添加描述" // Description hint
    }
  };