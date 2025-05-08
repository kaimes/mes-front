// Icons are from:
// https://pictogrammers.com/library/mdi/
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
const Menu = [
    {
        header: "Order",
        name: "Order",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Order",
        group: "Order",
        name: "orderOrderList",
        desc: "Order",
        icon: "mdi-invoice-list-outline",
        href: "/order",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Order Line Item",
        group: "Order",
        name: "orderOrderLineItem",
        desc: "Order Line Item",
        icon: "mdi-invoice-list-outline",
        href: "/order_item",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Rolling",
        name: "Rolling",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Rolling",
        group: "Rolling",
        name: "rollingRollingList",
        desc: "Covers OE14, TY23, TY44",
        icon: "mdi-gas-burner",
        href: "/rolling_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Rolling Detail",
        group: "Rolling",
        name: "rollingRollingDetail",
        desc: "Covers TE29, OE17, TY44",
        icon: "mdi-gas-burner",
        href: "/rolling_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi Charge Status",
        group: "Charge Plan",
        icon: "mdi-gas-burner",
        href: "/opreation_log",
        name: "chargePlanSemiChargeStatus",
        desc: "Semi Charge Status",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    {
        header: "Section Weight",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    {
        title: "Section Weight",
        group: "Section Weight",
        name: "ProductType",
        desc: "Section Weight",
        icon: "mdi-account-group",
        href: "/product_type_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    {
        title: "Product Code",
        group: "Section Weight",
        name: "ProductCode",
        desc: "ProductCode",
        icon: "mdi-account-group",
        href: "/product_class",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    {
        header: "Semi",
        name: "Semi",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Cast",
        name: "semiCastList",
        desc: "Cast",
        group: "Semi",
        icon: "mdi-clock-time-three-outline",
        href: "/semi_cast_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Cast Spec",
        name: "semiCastSpec",
        desc: "Cast",
        group: "Semi",
        icon: "mdi-clock-time-three-outline",
        href: "/semi_cast_spec",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi",
        desc: "Semi",
        group: "Semi",
        name: "semiSemiList",
        icon: "mdi-account-group",
        href: "/semi_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi Detail",
        desc: "Semi Detail",
        group: "Semi",
        name: "semiSemiDetail",
        icon: "mdi-account-group",
        href: "/semi_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi Load List",
        desc: "Semi Load List",
        group: "Semi",
        name: "semiSemiLoadList",
        icon: "mdi-account-group",
        href: "/semi_load_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi Load Detail",
        desc: "Semi Load Detail",
        group: "Semi",
        name: "semiSemiLoadDetail",
        icon: "mdi-account-group",
        href: "/semi_load_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi History",
        desc: "Semi History",
        group: "Semi",
        name: "semiSemiMoveHistory",
        icon: "mdi-account-group",
        href: "/semi_move_history",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    // {
    //     title: "Candidate For Order",
    //     name: "semiCandidateForOrder",
    //     desc: "Candidate For Order",
    //     group: "Semi",
    //     icon: "mdi-clock-time-three-outline",
    //     href: "/semi_candidate_for_order",
    //     visibleRoles: ["sys", "Owner", "Planner"]
    // },
    {
        title: "Semi Load Detail",
        group: "Semi",
        name: "semiLoadDetail",
        icon: "mdi-account-group",
        href: "/semi_load_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Candidate For Order",
        name: "semiCandidateForOrder",
        desc: "Candidate For Order",
        group: "Semi",
        icon: "mdi-clock-time-three-outline",
        href: "/semi_candidate_for_order",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Semi End Use To Spec",
        name: "SemiEndUseToSpec",
        desc: "Semi End Use To Spec",
        group: "Semi",
        icon: "mdi-clock-time-three-outline",
        href: "/semi_end_use_to_spec",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Product Spec",
        name: "productSpec",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Manual Semi End Use",
        name: "ManualSemiEndUse",
        desc: "Manual Semi End Use",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/manual_semi_end_use",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Spec",
        group: "Product Spec",
        name: "specList",
        desc: "Spec",
        component: "Jobs",
        icon: "mdi-account-group",
        href: "/spec_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Detail",
        name: "specDetail",
        desc: "Detail",
        group: "Product Spec",
        icon: "mdi-account-group",
        href: "/spec_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Impact",
        name: "SpecImpact",
        desc: "Impact",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/spec_impact",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Tensile",
        name: "SpecTensile",
        desc: "Tensile",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/spec_tensile",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Yield Stress",
        name: "SpecYieldStress",
        desc: "Yield Stress",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/spec_yield_stress",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Elongation Details",
        name: "SpecElongationDetails",
        desc: "Elongation Details",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/spec_elongation_details",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Main Element Analysis",
        name: "MainElementAnalysis",
        desc: "Main Element Analysis",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/main_element_analysis",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Combined Element Analysis",
        name: "CombinedElementAnalysis",
        desc: "Combined Element Analysis",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/combined_element_analysis",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Product Analysis",
        name: "ProductAnalysis",
        desc: "Product Analysis",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/product_analysis",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "CEV For Spec",
        name: "CEVListForSpec",
        desc: "CEV For Spec",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/cev_list_for_spec",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "CEV Analysis",
        name: "CEVAnalysis",
        desc: "CEV Analysis",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/cev_analysis",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Routing Requirement",
        name: "RoutingRequirement",
        desc: "Routing Requirement",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/routing_requirement",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Jominy Details",
        name: "JominyDetails",
        desc: "Jominy Details",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/jominy_details",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Bend Test Spec",
        name: "BendTestDetails",
        desc: "Bend Test Spec",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/bend_test_details",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Deoxidation Details",
        name: "DeoxidationDetails",
        desc: "Deoxidation Details",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/deoxidation_details",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Test Cert Extra Details",
        name: "TestCertExtraDetails",
        desc: "Test Cert Extra Details",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/test_cert_extra_details",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Supply Conditions",
        name: "SupplyConditions",
        desc: "Supply Conditions",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/supply_conditions",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Inspector",
        name: "Inspector",
        desc: "Inspector",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/inspector",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Test",
        name: "test",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Test Sample",
        name: "TextSampleList",
        desc: "Test Sample",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_sample_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Test Result Tensile",
        name: "TestResultTensile",
        desc: "TestResultTensile",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_result_tensile",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Test Result Impact",
        name: "testResultImpactList",
        desc: "Test Result Impact",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_result_impact",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Test Result Chemical",
        name: "TestResultChemicalList",
        desc: "Test Result Chemical",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_result_chemical",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Test Result Tensile Thickness",
        name: "TestResultTensileThicknessList",
        desc: "Test Result Tensile Thickness",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_result_tensile_thickness",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Bend Test Card",
        name: "BendTestCard",
        desc: "Bend Test Card",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/bend_test_card",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
        {
        title: "Decarburisation Test Card",
        name: "DecarburisationTestCard",
        desc: "Decarburisation Test Card",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/decarburisation_test_card",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
            {
        title: "ProductHydrogen Test Card",
        name: "ProductHydrogenTestCard",
        desc: "Product Hydrogen Test Card",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/product_hydrogen_test_card",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Runout Covering",
        name: "runoutCovering",
        desc: "Runout Covering",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_runout_covering",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Cast Analysis Checking",
        name: "castAnalysisChecking",
        desc: "Cast Analysis Checking",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_cast_analysis_checking",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Tempest Spec",
        name: "tempestSpec",
        desc: "Tempest Spec",
        group: "Test",
        icon: "mdi-clock-time-three-outline",
        href: "/test_tempest_spec",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Finished Product",
        name: "finishedProduct",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "CutBar",
        group: "finishedProduct",
        name: "barList",
        desc: "CutBar",
        icon: "mdi-clock-time-three-outline",
        href: "/bar_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Runout",
        group: "finishedProduct",
        name: "RunoutList",
        desc: "Runout",
        icon: "mdi-clock-time-three-outline",
        href: "/runout_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Finished Product",
        group: "finishedProduct",
        name: "Finished Product",
        desc: "Finished Product",
        icon: "mdi-clock-time-three-outline",
        href: "/finished_product",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
      title: "Finished Product Hold",
      group: "finishedProductHold",
      name: "Finished Product Hold",
      desc: "Finished Product Hold",
      icon: "mdi-clock-time-three-outline",
      href: "/finished_project_hold",
      visibleRoles: ["sys", "Owner", "Planner"]
  },
    {
        title: "Finished Product Detail",
        group: "finishedProduct",
        name: "Finished Product Detail",
        desc: "Finished Product Detail",
        icon: "mdi-clock-time-three-outline",
        href: "/finished_product_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Finished Product History",
        group: "finishedProduct",
        name: "Finished Product History",
        desc: "Finished Product History",
        icon: "mdi-clock-time-three-outline",
        href: "/finished_product_history",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Order Reserve",
        group: "finishedProduct",
        name: "Order Reserve",
        desc: "Finished Product History",
        icon: "mdi-clock-time-three-outline",
        href: "/order_reserve",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Impact",
        group: "finishedProduct",
        name: "finishedProductImpact",
        desc: "Finished Product Impact",
        icon: "mdi-clock-time-three-outline",
        href: "/finished_impact",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Advice",
        group: "finishedProduct",
        name: "Advice",
        desc: "Advice",
        icon: "mdi-clock-time-three-outline",
        href: "/advice_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Advice Detail",
        group: "finishedProduct",
        name: "AdviceDetail",
        desc: "Advice Detail",
        icon: "mdi-clock-time-three-outline",
        href: "/advice_detail",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Maintenance",
        name: "maintenance",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Operation Log",
        desc: "Operation Log",
        group: "config",
        name: "operationLog",
        icon: "mdi-cog-outline",
        href: "/operation_log",
        visibleRoles: ["sys", "Owner"]
    },
    {
        title: "Message Log",
        desc: "Message Log",
        group: "config",
        name: "MessageLog",
        icon: "mdi-cog-outline",
        href: "/message_log",
        visibleRoles: ["sys", "Owner"]
    },
    {
        header: "Config",
        name: "config",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Setting",
        desc: "Setting",
        group: "config",
        name: "Setting",
        icon: "mdi-cog-outline",
        href: "/organization",
        visibleRoles: ["sys", "Owner"]
    },
    {
        title: "Accounts",
        desc: "Accounts",
        group: "config",
        name: "loginAccounts",
        icon: "mdi-account-group",
        href: "/users"
    },
    {
        title: "Menus",
        desc: "Menus",
        group: "config",
        name: "menus",
        icon: "mdi-account-group",
        href: "/menus",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Roles",
        desc: "Roles",
        group: "config",
        name: "roles",
        icon: "mdi-account-group",
        href: "/roles",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Site",
        name: "site",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    {
        title: "Site Type",
        group: "Site",
        name: "SiteTypeList",
        desc: "Site Type",
        icon: "mdi-clock-time-three-outline",
        href: "/site_type",
        visibleRoles: [
          "sys",
          "Owner",
          "Planner"
        ]
      },
    {
        title: "Site",
        group: "Site",
        name: "SiteList",
        desc: "Site",
        icon: "mdi-clock-time-three-outline",
        href: "/site",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Area",
        group: "Site",
        name: "area",
        desc: "Area",
        icon: "mdi-toy-brick-outline",
        href: "/area",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Pens",
        name: "Pens",
        visibleRoles: ["sys", "Owner", "Planner"]
    },

    {
        title: "Pen",
        group: "Pens",
        name: "PenList",
        desc: "Pen",
        icon: "mdi-clock-time-three-outline",
        href: "/pen_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Mill",
        name: "Mill",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Mill",
        group: "Mill",
        name: "MillList",
        desc: "Mill",
        icon: "mdi-clock-time-three-outline",
        href: "/mill",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Shift",
        name: "Shift",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Shift",
        desc: "Shift",
        group: "Shift",
        name: "ShiftList",
        icon: "mdi-clock-time-three-outline",
        href: "/shift_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        header: "Defect Reason",
        name: "DefectReason",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Defect Reason",
        desc: "Defect Reason",
        group: "Defect Reason",
        name: "DefectReasonList",
        icon: "mdi-clock-time-three-outline",
        href: "/defect_reason",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
    {
        title: "Holdreason",
        name: "Holdreason",
        desc: "Holdreason",
        group: "Semi",
        icon: "mdi-account-group",
        href: "/holdreason_list",
        visibleRoles: ["sys", "Owner", "Planner"]
    },
];

export default Menu;
