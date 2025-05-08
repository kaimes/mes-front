import Mock from "mockjs";

Mock.mock(RegExp("/api/v1/finished_product/list/mock.*"), "get", [{
    "id": "@id",
    "items|1-5": [{
        "id": "@uuid()",
        "bar_no|+100": "1",
        "length": "@float(1,100, 0, 2)",
        "mults": "@string(2,4)",
        "order_no": "@string(2,5)",
        "line_item_no": "@string(2,5)",
        "spec_code": "@string(2,5)",
        "location": "@string(2,5)",
        "is_real": "YES|NO",
        "defect": "@string(2,5)",
        "status": "Success|Fail",
    }],
}])
// manual semi end use
Mock.mock(RegExp("/api/v1/spec/manual_semi_end_use/mock.*"), "get", {
    "status": 200,
    "data": {
        "total": "@integer(5, 20)",
        "items|5-10": [{
            "id|+1": 1,
            "section_type": "@integer(1, 100)-@integer(1, 100)",
            "weight_min": "@integer(1, 100)",
            "weight_max": "@integer(1, 100)",
            "spec_code": "@string(2,5)",
            "short_name": "@name(1,3)",
            "full_name": "@string(2,5)",
        }]
    },
})
Mock.mock("/api/v1/spec/manual_semi_end_use/mock", "post", {
    "status": 200,
    "data": {
        "msg": "ok"
    }
})
