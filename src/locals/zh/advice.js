export default {
    table: {
      action: "操作",
      advice_no: "通知单号", // Advice No. -> 装车/发运通知单编号
      business_type: "业务类型", // Business Type -> 如：出口、调拨、内销等
      advice_type: "通知类型", // Advice Type -> 如：装车通知、发运通知等
      no_products: "产品数量", // No Products -> 材料件数或产品数量
      total_weight: "总重量(吨)", // Total Weight(Tonnes) -> 所有材料的总重量（单位为吨）
      length: "长度(mm)", // Length -> 材料总长度，单位毫米
      location: "位置", // Location -> 存储位置或仓库位置
      vessel: "船名", // Vessel -> 出口船舶名称（如适用）
      own_state: "权属状态", // Own State -> 如：自有、代管、客户寄存等
      held: "保管中", // Held -> 是否处于保管状态
      hold_status: "保管状态", // Hold Status -> 如：正常、冻结、锁定等
      cover: "覆盖情况", // Cover -> 是否已覆盖订单或生产计划
      rework: "返工标记", // Rework -> 标记是否需要返工处理
      mult_done: "多项完成", // Mult Done -> 是否已完成多个工序环节
      wagon: "车号", // Wagon -> 火车车厢编号（适用于铁路运输）
      store: "仓库", // Store -> 存储仓库或区域代码
      load_code: "装车编码", // Load Code -> 对应装车任务的唯一编号
      customer: "客户", // Customer -> 客户名称或代码
      status: "状态", // Status -> 如：待处理、已发运、已取消等
      created_at: "创建时间", // Created At -> 记录创建时间
      created_by: "创建人", // Created By -> 创建该记录的操作员
      comment: "备注" // Comment -> 额外说明信息
    },
  
    button: {
      cancel: "取消", // Cancel -> 取消当前通知单或操作
      deload: "卸车", // Deload -> 将已装车物料重新卸下
      back_to_mill: "返回轧机", // Back to Mill -> 返回生产线进行再加工
      tip: "报备", // Tip -> 向调度系统报备装车完成
      split: "拆分", // Split -> 将一个装车任务拆分为多个
      move: "移动", // Move -> 移动装车任务或物料位置
      replace: "替换" // Replace -> 替换装车中的部分物料
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