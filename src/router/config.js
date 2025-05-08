import { DefaultLayout, AuthLayout } from "@/components/layouts";


export const publicRoute = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "errors-404" */ "@/views/error/NotFound.vue")
  },
  {
    path: "/login",
    component: AuthLayout,
    meta: {title: "Login", icon: "view_compact", group: "auth"},
    children: [
      {
        path: "/login",
        name: "Login",
        component: () => import(/* webpackChunkName: "auth-login" */ "@/auth/Login.vue")
      }
    ]
  },
  {
    path: "/login_billing",
    component: AuthLayout,
    meta: {title: "Login Billing", icon: "view_compact", group: "auth"},
    children: [
      {
        path: "/login_billing",
        name: "Login_Billing",
        component: () =>
          import(/* webpackChunkName: "auth-login-billing" */ "@/auth/LoginBilling.vue")
      }
    ]
  },
  {
    path: "/register",
    component: AuthLayout,
    meta: {title: "Register", icon: "view_compact", group: "auth"},
    children: [
      {
        path: "/register",
        name: "Register",
        component: () =>
          import(/* webpackChunkName: "auth-register" */ "@/auth/Register.vue")
      }
    ]
  },
  {
    path: "/register_eng",
    component: AuthLayout,
    // name: "register in org",
    // meta: { title: "register in org" },
    // props: (route) => ({ orgCode: route.query.orgCode}),
    // component: () =>
    //   import(/* webpackChunkName: "errors-500" */ "@/auth/RegisterInOrg.vue"),
    meta: {title: "Register in org", icon: "view_compact", group: "auth"},
    children: [
      {
        path: "/register_eng",
        name: "RegisterEngineer",
        component: () =>
          import(/* webpackChunkName: "auth-register" */ "@/auth/RegisterOrgWorker.vue")
      }
    ]
  },
  {
    path: "/register_customer",
    component: AuthLayout,
    meta: {
      title: "Register as a Customer",
      icon: "view_compact",
      group: "auth"
    },
    children: [
      {
        path: "/register_customer",
        name: "RegisterCustomer",
        component: () =>
          import(/* webpackChunkName: "auth-register" */ "@/auth/RegisterOrgCustomer.vue")
      }
    ]
  },
  {
    path: "/404",
    name: "404",
    meta: {title: "Not Found"},
    component: () => import(/* webpackChunkName: "errors-404" */ "@/views/error/NotFound.vue")
  },
  {
    path: "/500",
    name: "500",
    meta: {title: "Server Error"},
    component: () => import(/* webpackChunkName: "errors-500" */ "@/views/error/Error.vue")
  }
];


const userId= localStorage.getItem("user_id")
console.log("USEUSER id",userId)
// NOTE: The order in which routes are added to the list matters when evaluated. For example, /jobs/report will take precendence over /jobs/:name.
export const protectedRoute = [
  {
    path: "/",
    component: DefaultLayout,
    meta: {title: "Dispatch", group: "jobs", icon: ""},
    redirect: '/rolling_list',
    children: [
      {
        path: "/403",
        name: "Forbidden",
        meta: {title: "Access Denied", hiddenInMenu: true},
        component: () =>
          import(/* webpackChunkName: "error-403" */ "@/views/error/Deny.vue")
      }
    ]
  },
  {
    path: "/jobs/types",
    component: DefaultLayout,
    meta: {
      title: "Job Types",
      icon: "view_compact",
      group: "configuration",
      requiresAuth: true
    }
  },
  // {
  //   path: "/profile",
  //   component: DefaultLayout,
  //   meta: {
  //     title: "Profile",
  //     icon: "view_compact",
  //     group: "contacts"
  //   },
  //   children: [
  //     {
  //       path: "/profile",
  //       name: "ProfileTable",
  //       component: () =>
  //         import(/* webpackChunkName: "worker-table" */ "@/profile/index.vue")
  //     }
  //   ]
  // },
  {
    path: "/order",
    component: DefaultLayout,
    meta: {
      title: "Order",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/order",
        name: "OrderTable",
        meta: {
          title: "Order",
          group: "order",
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/order_admin/order/index.vue")
      },
      {
        path: "/order_item",
        name: "OrderItemTable",
        meta: {
          title: "Order Item",
          group: "order",
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/order_admin/order/detail.vue")
      },
      {
        path: "/order_item/detail",
        name: "OrderItemDetail",
        meta: {
          title: "Order Item Detail",
          group: "order",
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/order_admin/order_line_item/detail.vue")
      },
      {
        path: "/order_group",
        name: "OrderGroup",
        meta: {
          title: "Order Group",
          group: "order",
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/order_admin/order_group/index.vue")
      },
      {
        path: "/order_group_block",
        name: "OrderGroupBlock",
        meta: {
          title: "Order Group Block",
          group: "order",
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/order_admin/order_group/block.vue")
      },
      {
        path: "/itemStatistics",
        name: "OirderItemsStatistics",
        meta: {
          title: "Order Items Statistics",
          group: "order",
          requiresAuth: true
        },
        component: () => import("@/order_admin/order_item_statistics/index.vue")
      }
    ]
  },
  {
    path: "/services",
    component: DefaultLayout,
    meta: {
      title: "Planner Service",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/services",
        name: "ServiceTable",
        component: () =>
          import(/* webpackChunkName: "service-table" */ "@/service/Table.vue")
      }
    ]
  },
  {
    path: "/service_plugin",
    component: DefaultLayout,
    meta: {
      title: "plugins_in_services",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/service_plugin",
        name: "ServicePluginTable",
        component: () =>
          import(
            /* webpackChunkName: "service-table-plugin" */ "@/service_plugin/Table.vue"
            )
      }
    ]
  },
  {
    path: "/operation_log",
    component: DefaultLayout,
    meta: {
      title: "Operation Log",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/operation_log",
        name: "OperationLogTable",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/operation_log/index.vue")
      }
    ]
  },
  {
    path: "/message_log",
    component: DefaultLayout,
    meta: {
      title: "Message Log",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/message_log",
        name: "MessageLogTable",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/message_log/index.vue")
      }
    ]
  },

  {
    path: "/site_type",
    component: DefaultLayout,
    meta: {
      title: "Site Type",
      icon: "view_compact",
      group: "SiteAndArea",
      requiresAuth: true
    },
    children: [
      {
        path: "/site_type",
        name: "siteTypeTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/site_type/Table.vue")
      }
    ]
  },

  {
    path: "/site",
    component: DefaultLayout,
    meta: {
      title: "Site",
      icon: "view_compact",
      group: "SiteAndArea",
      requiresAuth: true
    },
    children: [
      {
        path: "/site",
        name: "siteTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/site/Table.vue")
      }
    ]
  },
  {
    path: "/area",
    component: DefaultLayout,
    meta: {
      title: "Area",
      icon: "view_compact",
      group: "SiteAndArea",
      requiresAuth: true
    },
    children: [
      {
        path: "/area",
        name: "areaTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/area/Table.vue")
      }
    ]
  },


  {
    path: "/mill",
    component: DefaultLayout,
    meta: {
      title: "Mill",
      icon: "view_compact",
      group: "SiteAndArea",
      requiresAuth: true
    },
    children: [
      {
        path: "/mill",
        name: "millTable",
        meta: {
          title: "Mill List",
        },
        component: () => import(/* webpackChunkName: "item-table" */ "@/mill/index.vue")
      },
      {
        path: "/mill/edit",
        name: "millDetail",
        meta: {
          title: "Mill Edit",
        },
        component: () => import(/* webpackChunkName: "item-table" */ "@/mill/edit.vue")
      }
    ]
  },
  {
    path: "/plugins",
    component: DefaultLayout,
    meta: {
      title: "plugins",
      icon: "view_compact",
      group: "configuration",
      requiresAuth: true
    },
    children: [
      {
        path: "/plugins",
        name: "PluginTable",
        component: () => import("@/plugin/Table.vue")
      }
    ]
  },
  {
    path: "/users",
    component: DefaultLayout,
    meta: {
      title: "Users",
      icon: "view_compact",
      group: "configuration",
      requiresAuth: true
    },
    children: [
      {
        path: "/users",
        name: "UserTable",
        component: () => import("@/auth/Table.vue")
      }
    ]
  },
  {
    path: "/roles",
    component: DefaultLayout,
    meta: {
      title: "Roles",
      icon: "view_compact",
      group: "configuration",
      requiresAuth: true
    },
    children: [
      {
        path: "/roles",
        name: "RoleTable",
        component: () => import("@/system_admin/role/Table.vue")
      },
      {
        path: "/roles_detail",
        name: "RoleDetail",
        meta: {
          title: "Role Detail",
        },
        component: () => import("@/system_admin/role/NewDetail.vue")
      }
    ]
  },
  {
    path: "/menus",
    component: DefaultLayout,
    meta: {
      title: "Menus",
      icon: "view_compact",
      group: "configuration",
      requiresAuth: true
    },
    children: [
      {
        path: "/menus",
        name: "MenuTable",
        component: () => import("@/system_admin/menu/Table.vue")
      },
      {
        path: "/menus_button",
        name: "MenuButtonTable",
        component: () => import("@/system_admin/menu_button/Table.vue")
      }
    ]
  },
  {
    path: "/organization",
    component: DefaultLayout,
    meta: {
      title: "Organization",
      icon: "view_compact",
      group: "configuration",
      requiresAuth: true
    },
    children: [
      {
        path: "/organization",
        name: "OrganizationTable",
        component: () => import("@/org/Table.vue")
      }
    ]
  },
  {
    path: "/rolling_list",
    component: DefaultLayout,
    meta: {
      title: "Rolling",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/rolling_list",
        name: "RollingListTable",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/rolling_list/Table.vue")
      }
    ]
  },
  {
    path: "/rolling_detail",
    component: DefaultLayout,
    meta: {
      title: "Rolling Detail",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/rolling_detail",
        name: "RollingDetail",
        title: "Rolling Detail",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/rolling_detail/index.vue")
      }
    ]
  },
  {
    path: "/cut_seq_plan_detail",
    component: DefaultLayout,
    meta: {
      title: "Cut Sequence Plan Detail",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/cut_seq_plan_detail",
        name: "CutSequencePlanDetail",
        title: "Cut Sequence Plan Detail",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/cut_sequence_plan/index.vue")
      }
    ]
  },
  {
    path: "/rolling_status",
    component: DefaultLayout,
    meta: {
      title: "Rolling Status",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/rolling_status",
        name: "RollingStatus",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/rolling_status/index.vue")
      }
    ]
  },
  {
    path: "/semi_reblocking",
    component: DefaultLayout,
    meta: {
      title: "Semi Reblocking",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/semi_reblocking",
        name: "SemiReblocking",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/semi_reblocking/index.vue")
      }
    ]
  },
  {
    path: "/rolling/statistics",
    component: DefaultLayout,
    meta: {
      title: "Rolling Statistics",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/rolling/statistics",
        name: "RollingStatistics",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/rolling_statistics/index.vue")
      }
    ]
  },
  {
    path: "/order_items",
    component: DefaultLayout,
    meta: {
      title: "Order Items",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/order_items",
        name: "OrderItems",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/order_items/index.vue")
      }
    ]
  },

  {
    path: "/product_type_list",
    component: DefaultLayout,
    meta: {
      title: "Section Weight",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/product_type_list",
        name: "ProductTypeListTable",
        component: () => import("@/product_type/Table.vue")
      }
    ]
  },


  {
    path: "/product_class",
    component: DefaultLayout,
    meta: {
      title: "Product Code",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/product_class",
        name: "ProductCode",
        component: () => import("@/product_class/Table.vue")
      }
    ]
  },

  {
    path: "/product_category",
    component: DefaultLayout,
    meta: {
      title: "Section Type",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/product_category",
        name: "ProductCategory",
        component: () => import("@/product_category/Table.vue")
      }
    ]
  },

    {
    path: "/product_size",
    component: DefaultLayout,
    meta: {
      title: "Product Size",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/product_size",
        name: "ProductSizeList",
        component: () => import("@/product_size/index.vue")
      }
    ]
  },


  {
    path: "/semi_charge_list",
    component: DefaultLayout,
    meta: {
      title: "Semi Charge List",
      icon: "view_compact",
      group: "Rolling",
      requiresAuth: true
    },
    children: [
      {
        path: "/semi_charge_list",
        title: "Semi Charge List",
        name: "SemiChargeList",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/rolling/semi_charge_list/index.vue")
      }
    ]
  },
  {
    path: "/semi",
    component: DefaultLayout,
    meta: {
      title: "Semi",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/semi_cast_list",
        name: "SemiCastList",
        meta: {
          title: "Cast List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_cast/index.vue")
      },
      {
        path: "/semi_cast_spec",
        name: "SemiCastSpec",
        meta: {
          title: "Cast Spec",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/cast_spec/index.vue")
      },
      {
        path: "/cast_chemical_detail",
        name: "CastChemicalDetail",
        meta: {
          title: "Cast Chemical Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/cast_chemical_detail/index.vue")
      },
      {
        path: "/semi_list",
        name: "SemiTable",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi/Table.vue")
      },
      {
        path: "/semi_detail",
        name: "SemiDetailTable",
        meta: {
          title: "Semi Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_detail/Table.vue")
      },
      {
        path: "/semi_load_list",
        name: "SemiLoadList",
        meta: {
          title: "Semi Load",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_load_list/index.vue")
      },
      {
        path: "/semi_load_detail",
        name: "SemiLoadDetail",
        meta: {
          title: "Semi Load Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_load_detail/index.vue")
      },
      {
        path: "/alternative_semi_size",
        name: "AlternativeSemiSize",
        meta: {
          title: "Alternative Semi Size",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/alternative_semi_size/index.vue")
      },
      {
        path: "/semi_size",
        name: "SemiSize",
        meta: {
          title: "Semi Size",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_size/Table.vue")
      },
      {
        path: "/semi_size_detail",
        name: "SemiSizeDetail",
        meta: {
          title: "Semi Size Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_size_detail/index.vue")
      },
      {
        meta: {
          title: "Semi History",
        },
        path: "/semi_move_history",
        name: "SemiMoveHistory",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_move_history/Table.vue")
      },
      {
        meta: {
          title: "Semi Hold Reason",
        },
        path: "/semi_hold_reason",
        name: "SemiHoldReason",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/semi_hold_reason/index.vue")
      },
      {
        meta: {
          title: "Semi Stock Level",
        },
        path: "/stock_level",
        name: "StockLevel",
        component: () => import(/* webpackChunkName: "worker-table" */ "@/semi_admin/stock_level/index.vue")
      }
    ]
  },
  {
    path: "/fp",
    component: DefaultLayout,
    meta: {
      title: "Finished Product",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    redirect: "/runout_list",
    children: [
      {
        path: "/runout_list",
        name: "RunoutList",
        meta: {
          title: "Runout List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/runout_list/index.vue")
      },
      {
        path: "/runout_detail",
        name: "RunoutDetail",
        meta: {
          title: "Runout Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/runout_detail/index.vue")
      },
      {
        path: "/finished_product",
        name: "finishedProduct",
        meta: {
          title: "Finished Product",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/finished_product/index.vue")
      },
      {
        path: "/finished_product/edit",
        name: "finishedProductEdit",
        meta: {
          title: "Finished Product Create",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/finished_product/edit.vue")
      },
      {
        path: "/finished_product_detail",
        name: "finishedProductDetail",
        meta: {
          title: "Finished Product Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/finished_product_detail/index.vue")
      },
      {
        path: "/finished_product_stock_level",
        name: "finishedProductStockLevel",
        meta: {
          title: "Finished Product Stock Level",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/finished_product_stock_level/index.vue")
      },
      {
        path: "/mult_list",
        name: "multList",
        meta: {
          title: "Mult List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/mult_list/index.vue")
      },
      {
        path: "/mult_detail",
        name: "multDetail",
        meta: {
          title: "Mult Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/mult_list/detail.vue")
      },
      {
        path: "/finished_product_history",
        name: "finishedProductHistory",
        meta: {
          title: "Finished Product History",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/finished_product_history/index.vue")
      },
      {
        path: "/finished_product_hold",
        name: "Batch Hold and Cover",
        meta: {
          title: "Batch Hold and Cover",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/finished_product_hold/index.vue")
      },
      {
        path: "/holdreason_list",
        name: "HoldReasonList",
        meta: {
          title: "Hold Reason List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/hold_reason/index.vue")
      },
      {
        path: "/advice_list",
        name: "adviceList",
        meta: {
          title: "Advice/Consignment",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/advice_list/index.vue")
      },
      {
        path: "/advice_detail",
        name: "AdviceDetail",
        meta: {
          title: "Advice Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/advice_detail/index.vue")
      },

      {
        path: "/finished_impact",
        name: "FinishedImpact",
        meta: {
          title: "List Page For Impacts",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/impact/index.vue")
      },
      {
        path: "/advice_tip",
        name: "AdviceTip",
        meta: {
          title: "Advice Tip",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/advice_tip/index.vue")
      },
      {
        path: "/order_reserve",
        name: "OrderReserve",
        meta: {
          title: "Order Reserve",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/order_reserve/index.vue")
      },
      {
          path: "/finished_product_load_list",
          name: "finishedProductLoadList",
          meta: {
              title: "Finished Product Load",
          },
          component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/load_list/index.vue")
      },
      {
          path: "/finished_product_load_detail",
          name: "finishedProductLoadDetail",
          meta: {
              title: "Finished Product Load Detail",
          },
          component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/load_list/detail.vue")
      },
      {
        path: "/transport_list",
        name: "TransportList",
        meta: {
          title: "Transport List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/transport/index.vue")
      },
      {
        path: "/transport_history",
        name: "TransportHistory",
        meta: {
          title: "Transport History",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/finished_product/transport_history/index.vue")
      },
    ]
  },

  {
    path: "/spec",
    component: DefaultLayout,
    meta: {
      title: "Spec",
      icon: "view_compact",
      group: "contacts",
      requiresAuth: true
    },
    children: [
      {
        path: "/spec_list",
        name: "SpecTable",
        meta: {
          title: "Spec List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec/Table.vue")
      },
      {
        path: "/spec_detail",
        name: "SpecDetailTable",
        meta: {
          title: "Spec Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec_detail/Table.vue")
      },

      {
        path: "/spec_remark",
        name: "SpecRemark",
        meta: {
            title: "Spec Remark",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec_remark/index.vue")
      },
      {
        path: "/manual_semi_end_use",
        name: "ManualSemiEndUse",
        meta: {
          title: "Manual Semi End Use",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/manual_semi_end_use/index.vue")
      },
      {
        path: "/spec_impact",
        name: "SpecImpact",
        meta: {
          title: "Spec Impact",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec_impact/index.vue")
      },
      {
        path: "/through_thickness",
        name: "Through Thickness Tensile",
        meta: {
          title: "Through Thickness Tensile",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spria/index.vue")
      },
      {
        path: "/spec_tensile",
        name: "SpecTensile",
        meta: {
          title: "Spec UTS",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec_tensile/index.vue")
      },
      {
        path: "/spec_yield_stress",
        name: "SpecYieldStress",
        meta: {
          title: "Spec Yield Stress",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec_yield_stress/index.vue")
      },
      {
        path: "/spec_elongation_details",
        name: "SpecElongationDetails",
        meta: {
          title: "Spec Elongation Details",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/spec_elongation_details/index.vue")
      },
      {
        path: "/main_element_analysis",
        name: "MainElementAnalysis",
        meta: {
          title: "Main Element Analysis",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/main_element_analysis/index.vue")
      },
      {
        path: "/main_element_analysis/detail",
        name: "MainElementAnalysisEdit",
        meta: {
          title: "Main Element Analysis Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/main_element_analysis/edit.vue")
      },
      {
        path: "/combined_element_analysis",
        name: "CombinedElementAnalysis",
        meta: {
          title: "Combined Element Analysis",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/combined_element_analysis/index.vue")
      },
      {
        path: "/product_analysis",
        name: "ProductAnalysis",
        meta: {
          title: "Product Analysis",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/product_analysis/index.vue")
      },
      {
        path: "/product_analysis/detail",
        name: "ProductAnalysisEdit",
        meta: {
          title: "Product Analysis Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/product_analysis/edit.vue")
      },
      {
        path: "/cev_list_for_spec",
        name: "CEVListForSpec",
        meta: {
          title: "CEV End Use",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/cev_list_for_spec/index.vue")
      },
      {
        path: "/cev_analysis",
        name: "CEVAnalysis",
        meta: {
          title: "CEVAnalysis",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/cev_analysis/index.vue")
      },
      {
        path: "/routing_requirement",
        name: "RoutingRequirement",
        meta: {
          title: "Routing Requirement",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/routing_requirement/index.vue")
      },
      {
        path: "/jominy_details",
        name: "JominyDetails",
        meta: {
          title: "Jominy Details",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/jominy_details/index.vue")
      },
      {
        path: "/bend_test_details",
        name: "BendTestDetails",
        meta: {
          title: "Bend Test Spec",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/bend_test_details/index.vue")
      },
      {
        path: "/deoxidation_details",
        name: "DeoxidationDetails",
        meta: {
          title: "Deoxidation Details",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/deoxidation_details/index.vue")
      },
      {
        path: "/test_cert_extra_details",
        name: "TestCertExtraDetails",
        meta: {
          title: "Test Cert Extra Details",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/test_cert_extra_details/index.vue")
      },
      {
        path: "/tolerance",
        name: "Tolerance",
        meta: {
          title: "Tolerance",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/tolerance/Table.vue")
      },
      {
        path: "/tolerance_detail",
        name: "ToleranceDetail",
        meta: {
          title: "Tolerance Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/tolerance_detail/index.vue")
      },
      {
        path: "/inspector",
        name: "Inspector",
        meta: {
          title: "Inspector",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/inspector/index.vue")
      },
      {
        path: "/spec_remarks",
        name: "SpecRemarks",
        meta: {
          title: "Spec Remarks",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/remarks/index.vue")
      },
      {
        path: "/spec_various",
        name: "SpecVarious",
        meta: {
          title: "Spec Various",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/various/index.vue")
      },
      {
        path: "/spec_formula",
        name: "SpecFormula",
        meta: {
          title: "Spec Formula",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/formula/index.vue")
      },
      {
        path: "/sp_element ",
        name: "SpecElement",
        meta: {
          title: "Spec Element",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/sp_element/index.vue")
      },
      {
        path: "/spec_other_test",
        name: "SpecOtherTest",
        meta: {
          title: "Spec Other Test",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/sp_other_test/index.vue")
      },
      {
        path: "/mill_reference_spec",
        name: "Mill Reference Spec",
        meta: {
          title: "Mill Reference Spec",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/mill_reference_spec/index.vue")
      },
      {
        path: "/supply_conditions",
        name: "SupplyConditions",
        meta: {
          title: "Supply Conditions",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/supply_conditions/index.vue")
      },
      {
        path: "/quality",
        name: "Quality",
        meta: {
          title: "Quality List",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/quality/index.vue")
      },
      {
        path: "/quality_element",
        name: "QualityElement",
        meta: {
          title: "Quality Element",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/quality_element/index.vue")
      },
      {
        path: "/quality_element/detail",
        name: "QualityElementEdit",
        meta: {
          title: "Quality Element Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/spec_admin/quality_element/edit.vue")
      },
    ]
  },
  {
    path: "/shift_list",
    component: DefaultLayout,
    meta: {
      title: "Shift",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/shift_list",
        name: "shiftListTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/shift_admin/shift/Table.vue")
      }
    ]
  },
  {
    path: "/shift_delay_list",
    component: DefaultLayout,
    meta: {
      title: "Shift Delay",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/shift_delay_list",
        name: "shiftDelayListTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/shift_admin/shift_delay/Table.vue")
      }
    ]
  },
  {
    path: "/defect_reason",
    component: DefaultLayout,
    meta: {
      title: "Defect Reason",
      icon: "view_compact",
      group: "Defect",
      requiresAuth: true
    },
    children: [
      {
        path: "/defect_reason",
        name: "DefectReasonTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/defect_reason/Table.vue")
      }
    ]
  },
  {
    path: "/regradereason",
    component: DefaultLayout,
    meta: {
      title: "Regrade Reason",
      icon: "view_compact",
      group: "Regrade",
      requiresAuth: true
    },
    children: [
      {
        path: "/regradereason",
        name: "RegradeReasonTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/regrade_reason/Table.vue")
      }
    ]
  },
  {
    path: "/customer",
    component: DefaultLayout,
    meta: {
      title: "Customer",
      icon: "view_compact",
      group: "Customer",
      requiresAuth: true
    },
    children: [
      {
        path: "/customer",
        name: "CustomerTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/customer/index.vue")
      },
      {
        path: "/customer/detail",
        name: "CustomerDetail",
        meta: {
          title: "Customer Detail",
        },
        component: () => import(/* webpackChunkName: "worker-table" */ "@/customer_detail/index.vue")
      }
    ]
  },
  {
    path: "/test_sample_list",
    component: DefaultLayout,
    meta: {
      title: "Test Sample",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_sample_list",
        name: "TestSampleTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_sample/index.vue")
      }
    ]
  },
  {
    path: "/test_list",
    component: DefaultLayout,
    meta: {
      title: "Test List",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_list",
        name: "testList",
        meta: {
          title: "Test List",
          icon: "view_compact",
          group: "shift",
          requiresAuth: true
        },
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_list/index.vue")
      },
      {
        path: "/test_edit",
        meta: {
          title: "Test Detail",
          icon: "view_compact",
          group: "shift",
          requiresAuth: true
        },
        name: "TestEditTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_list/edit.vue")
      },
      {
        path: "/test_print_status",
        meta: {
          title: "Test Print Status",
          icon: "view_compact",
          group: "shift",
          requiresAuth: true
        },
        name: "TestPrintStatus",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_print_status/index.vue")
      }
    ]
  },
  {
    path: "/test_tensile_card",
    component: DefaultLayout,
    meta: {
      title: "Test Tensile Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_tensile_card",
        name: "TestTensileCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_tensile_card/index.vue")
      }
    ]
  },
  {
    path: "/cleanness_test_card",
    component: DefaultLayout,
    meta: {
      title: "Cleanness Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/cleanness_test_card",
        name: "CleannessTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/cleanness_test_card/Table.vue")
      }
    ]
  },
  {
    path: "/impact_test_card",
    component: DefaultLayout,
    meta: {
      title: "Impact Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/impact_test_card",
        name: "ImpactTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/impact_test_card/Table.vue")
      }
    ]
  },
  {
    path: "/sulphur_test_card",
    component: DefaultLayout,
    meta: {
      title: "Sulphur Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/sulphur_test_card",
        name: "SulphurTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/sulphur_test_card/Table.vue")
      }
    ]
  },
  {
    path: "/hardness_test_card",
    component: DefaultLayout,
    meta: {
      title: "Hardness Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/hardness_test_card",
        name: "HardnessTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/hardness_test_card/Table.vue")
      }
    ]
  },
  {
    path: "/tensile_test_card",
    component: DefaultLayout,
    meta: {
      title: "Tensile Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/tensile_test_card",
        name: "TensileTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_tensile_card/index.vue")
      }
    ]
  },
  {
    path: "/test_result_tensile",
    component: DefaultLayout,
    meta: {
      title: "Test Result Tensile",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_result_tensile",
        name: "TestResultTensileTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_result_tensile/index.vue")
      }
    ]
  },
  {
    path: "/test_result_impact",
    component: DefaultLayout,
    meta: {
      title: "Test Result Impact",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_result_impact",
        name: "TestResultImpactTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_result_impact/index.vue")
      }
    ]
  },
  {
    path: "/test_result_chemical",
    component: DefaultLayout,
    meta: {
      title: "Test Result Product Analysis",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_result_chemical",
        name: "TestResultChemicalTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_result_chemical/index.vue")
      }
    ]
  },
  {
    path: "/test_result_tensile_thickness",
    component: DefaultLayout,
    meta: {
      title: "Test Result Through Thickness Tensile",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_result_tensile_thickness",
        name: "TestResultTensileThicknessTable",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_result_tensile_thickness/index.vue")
      }
    ]
  },
  {
    path: "/bend_test_card",
    component: DefaultLayout,
    meta: {
      title: "Bend Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/bend_test_card",
        name: "BendTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/bend_test_card/index.vue")
      }
    ]
  },
  {
    path: "/decarburisation_test_card",
    component: DefaultLayout,
    meta: {
      title: "Decarburisation Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/decarburisation_test_card",
        name: "DecarburisationTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/decarburisation_test_card/index.vue")
      }
    ]
  },
  {
    path: "/product_hydrogen_test_card",
    component: DefaultLayout,
    meta: {
      title: "Product Hydrogen Test Card",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/product_hydrogen_test_card",
        name: "ProductHydrogenTestCard",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/product_hydrogen_test_card/index.vue")
      }
    ]
  },
  {
    path: "/test_history",
    component: DefaultLayout,
    meta: {
      title: "Test History",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_history",
        name: "Test History",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_history/index.vue")
      }
    ]
  },
  {
    path: "/test_jominy",
    component: DefaultLayout,
    meta: {
      title: "Test Jominy",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_jominy",
        name: "Test Jominy",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_jominy/index.vue")
      }
    ]
  },
  {
    path: "/test_jominy/detail",
    component: DefaultLayout,
    meta: {
      title: "Test Jominy Detail",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_jominy/detail",
        name: "Test Jominy Detail",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_jominy/edit.vue")
      }
    ]
  },
  {
    path: "/test_mljc",
    component: DefaultLayout,
    meta: {
      title: "MLJC Job List",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_mljc",
        name: "MLJC Job List",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_mljc/index.vue")
      }
    ]
  },
  {
    path: "/test_mljc/detail",
    component: DefaultLayout,
    meta: {
      title: "Test MLJC Detail",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/test_mljc/detail",
        name: "Test MLJC Detail",
        component: () => import(/* webpackChunkName: "item-table" */ "@/test_admin/test_mljc/detail.vue")
      }
    ]
  },
  {
    path: "/alt_quality_code",
    component: DefaultLayout,
    meta: {
      title: "Alternative Quality Code",
      icon: "view_compact",
      group: "shift",
      requiresAuth: true
    },
    children: [
      {
        path: "/alt_quality_code",
        name: "Alternative Quality Code",
        component: () => import(/* webpackChunkName: "item-table" */ "@/spec_admin/alt_quality_code/Table.vue")
      }
    ]
  },
  {
    path: "/covering_usage",
    component: DefaultLayout,
    meta: {
      title: "Covering Usage",
      icon: "view_compact",
      group: "test",
      requiresAuth: true
    },
    children: [
      {
        path: "/covering_usage",
        name: "Covering Usage",
        component: () => import(/* webpackChunkName: "item-table" */ "@/spec_admin/covering_usage/Table.vue")
      }
    ]
  }
];


export const Route404 = [
  {
    path: '/:pathMatch(.*)',
    component: DefaultLayout,
    meta: {
      title: "404",
      icon: "view_compact",
      requiresAuth: true
    },
    children: [
      {
        path: "",
        name: "404",
        component: () => import(/* webpackChunkName: "job-table" */ "@/views/error/NotFound.vue")
      }
    ]
  },
];
