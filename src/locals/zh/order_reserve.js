export default {
    table: {
        action: "操作",
        code: "编码",
        length: "长度(mm)", 
        t_cover: "T保护层", // T-Cover -> 横向保护层（Concrete cover）
        c_cover: "C保护层", // C-Cover -> 纵向保护层（Clear cover）
        producttype_code: "产品类型编码", // Product Type Code -> 产品类型编码
        reserved_order_item: "预留订单项", // Reserved Order Item -> 已预留的订单项
        reserve_status: "预留状态", // Reserve Status -> 预留状态（如：已预留/未预留）
        allocation_status: "分配状态", // Allocation Status -> 分配状态（如：自由库存/已分配）
        spec_code: "规格编码", // Spec Code -> 规格代码（用于产品标准）
        area_code: "区域编码", // Area Code -> 生产/存储区域代码
        is_real: "是否实物", // Is Real -> 是否为实物（用于标记虚拟或实际物料）
        defect: "缺陷", // Defect -> 质量缺陷说明
        rework_type: "返工类型", // Rework Type -> 返工类别（如：修磨、重轧等）
        rework_status: "返工状态", // Rework Status -> 当前返工处理状态
        created_at: "创建时间", // Created At -> 记录创建时间
    },
    button: {
        reserve: "预留",
    },

    search_hint: "通过编码搜索",

    delete: {
        delete_title: "删除该厂区?", // Delete this Site?
        comform_delete: "你确定要删除此厂区吗?" // Are you sure to delete this site?
    },

    edit: {
        service_code: "服务编码", // Service Code -> 服务编号
        service_name: "服务名称", // Service Name -> 服务名称
        description: "描述", // Description -> 描述信息
        description_hint: "请为此服务添加描述" // Description hint
    }
};