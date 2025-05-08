import login from "./login";
import base_layout from "./base_layout";

import team from "./team";

import menu from "./menu";
import setting from "./setting";
import users from "./users";
import pluagins from "./pluagins";
import services_pluagins from "./services_pluagins";
import order_items from "./order_items";
import test_sample from "./test_sample";
import test_print_status from "./test_print_status"
import test_result_tensile from "./test_result_tensile"
import test_list from "./test_list"
import test_history from "./test_history"
import test_result_impact from "./test_result_impact"
import test_result_product_analysis from "./test_result_product_analysis"
import test_result_through_thickness_tensile from "./test_result_through_thickness_tensile"
import test_jominy from "./test_jominy";
import config_users from "./config_users";
import config_setting from "./config_setting";
import config_menus from "./config_menus";
import test_covering_usage from "./test_covering_usage";
// 以页面为单位
import global from "./global";
import services from "./services";
import site from "./site";
import spec from "./spec";

import cast from "./cast";
import cast_spec from "./cast_spec";

import site_type from "./site_type";

import area from "./area";
import semi from "./semi";
import tolerance from "./tolerance";
import mill from "./mill";
import shift from "./shift";
import defect_reason from "./defect_reason";
import regrade_reason from "./regrade_reason";
import semi_hold_reason from "./semi_hold_reason";
import hold_reason from "./hold_reason";
import section_type from "./section_type";
import section_weight from "./section_weight";
import product_code from "./product_code";

import semi_detail from "./semi_detail";
import semi_load from "./semi_load";
import semi_history from "./semi_history";
import semi_stock_level from "./semi_stock_level";
import cast_chemical_detail from "./cast_chemical_detail";
import semi_load_detail from "./semi_load_detail";


import runout from "./runout";
import operation_log from "./operation_log";
import message_log from "./message_log";
import shift_delay from "./shift_delay";
import finished_product from "./finished_product";
import transport from "./transport";
import mult from "./mult";
import finished_product_stock_level from "./finished_product_stock_level";
import finished_product_history from "./finished_product_history";
import order_reserve from "./order_reserve";
import load from "./load";
import advice from "./advice";
import batch_hold_and_cover from "./batch_hold_and_cover";
import rolling from "./rolling";

// 为避免混乱，key 全部小写
export default {
    login,
    base_layout,
    team,
    menu,
    setting,
    users,
    pluagins,
    order_items,

    cast,
    cast_spec,

    test_sample,
    test_print_status,
    config_menus,
    test_list,
    test_result_impact,
    config_setting,
    test_result_through_thickness_tensile,
    test_covering_usage,
    config_users,
    test_jominy,
    test_result_tensile,
    test_result_product_analysis,
    test_history,

    services_pluagins,
    global,
    services,
    site,
    area,
    spec,
    semi,
    semi_detail,
    semi_load,
    semi_load_detail,
    semi_history,
    semi_stock_level,
    cast_chemical_detail,
    tolerance,
    mill,
    shift,
    defect_reason,
    section_type,
    section_weight,
    product_code,
    site_type,
    runout,
    operation_log,
    message_log,
    shift_delay,
    regrade_reason,
    semi_hold_reason,
    hold_reason,
    finished_product,
    transport,
    mult,
    finished_product_stock_level,
    finished_product_history,
    order_reserve,
    load,
    advice,
    batch_hold_and_cover,
    rolling
};
