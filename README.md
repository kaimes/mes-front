    # vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install

# 如果npm install报错
npm install --legacy-peer-deps
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```




# FONT & Icons
> 找字体和图标用这个网站 ,  名字前面 要加上  `mdi-` 不然不生效

[FONT](https://pictogrammers.com/library/mdi/)


# 升级记录
[升级记录](https://aliyuque.antfin.com/mgxw3i/lp0aar/ymqztva05zzbuz1q?singleDoc)

https://www.kuaihe.tech/zh/

demo@demo.com demo1234
vue tree 使用文档
https://gitee.com/TinyWisp/vue-tree#%E5%BC%80%E5%A7%8B%E4%BD%BF%E7%94%A8
python -m dispatch.cli server start --port 8000 dispatch.main:app

注意:npm i --legacy-peer-deps
1.更新代码后启动错误 提示缺少包: 
2.提示组件请用vue3-toastify 不要走pinia 一个提示会导致无用的页面渲染 用法:
```js
import { toast } from "vue3-toastify";

toast("Hello! Wow so easy!", {
  "theme": "colored",
  "type": "error",
  "position": "bottom-center",
  "dangerouslyHTMLString": true
})

```


https://www.figma.com/proto/jjAnSuipeE9MxIKFbYjWBK/Finished-Product?node-id=124-18649&node-type=canvas&t=gs6sbR3rssTLYz4a-0&scaling=scale-down&content-scaling=fixed&page-id=124%3A18235&starting-point-node-id=124%3A18236

底部desc配置规则:
```js
/// 第一步引入hook
import useFooterEvent from "@/hooks/useFooterEvent"; // 控制业务逻辑
import useSearchFieldVisibility from '@/hooks/useSearchFieldVisibility' // 抽离v-show的判断条件

/// 第二步 引入组件
/// 需要确认好搜索表单的key值必须唯一 先定义好对应key的数字
const fields = ["runoutCode", "siteType", "siteCode", "其他值"]; // 最好用搜索的key值
/// 为了渲染效率 没有做成动态表单 而是用v-show组件控制搜索表单的显示和隐藏, 配置如下:
/// <v-col v-show="handleFieldShow('runoutCode')" cols="2">
/// handleFieldShow是useSearchFieldVisibility通用的方法不需要单独实现 需要在每个能控制的搜索条件添加v-show
/// 第三步 调用hook
/// 第一个参数代表当前的页面 必须唯一, 可以直接取router/config.js里面的name值
useFooterEvent('finishedProduct', {
    handleReset, // 配置重置 点击关闭后恢复默认的查询
    fields, // 这个就是搜索表单全部的key值
    column: $colums, // 这个表格的表头key值 可以参考 finished_product/index.vue
    columnRef: tableHeaders, // 这个是表头的ref 动态控制
    queryFields: searchFields,// 这个就是搜索表单全部的key值的ref
    queryParams: searchOptions, // 这个是搜索条件 内部会更改默认的搜索条件
})

/// 配置的数据结构
"finishedProduct": {
    "TF17": {
        "fields": [
            "runoutCode",
            "siteType",
            "siteCode",
            "areaCode"
        ],
        "query": {
            "runout_id": 2
        },
        "column": [
            "code",
            "rework_complete_comment",
            "area.code"
        ]
    }
}

{
    const opt = {
        margin: [5, 5, 5, 5],
        filename: 'test-reports.pdf',
        html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            windowWidth: 148 * 5,  // A5横向宽度（148mm * 5倍）
            scrollX: 0,
            scrollY: 0
        }
    }
```
