import moment from "moment-timezone";
import {Decimal} from 'decimal.js';
import {isArray, get, filter, includes, isNull, isString, isUndefined, replace} from "lodash";
import printJS from "print-js";
import {useCache, CACHE_KEY} from "@/hooks/useCache";

const { wsCache } = useCache()

const regZero = /^(\d|[1-9]\d+)(\.\d+)?$/;

const regSpecCode = /^[F|S|C|D]\w{0,4}$/;

const DIVISION_MAP = {
  "1": "1 Semi.",
  "2": "2 Wire Rod.",
  "3": "3 Construction.",
  "4": "4 Rail.",
  "5": "5 Special Profiles.",
  "6": "6 By-Products.",
};

const ORDER_TYPE_MAP = {
  "87": " 87 Sales Order",
  "274": "274 Planned Order",
  "184": "184 Stock Transfer",
};

// 获取token
export const getAccessToken = () => {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  const accessToken = wsCache.get(CACHE_KEY.TOKEN)
  return accessToken ? accessToken : wsCache.get('token')
}

// 设置token
export const setToken = (token) => {
  wsCache.set(CACHE_KEY.TOKEN, token)
}

export function formatString(str) {
  return str
    .split('_') // 将字符串按下划线分割成数组
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // 每个单词的首字母大写，其余小写
    .join(' '); // 将数组重新连接成一个字符串
}
export const formatDate = (value, formatString = "YYYY-MM-DD HH:mm:ss") => {
  if (!value) {
    return "--";
  }
  const londonTime = moment.utc(value).tz('Europe/London'); // 将 UTC 时间转换为伦敦时间
  return londonTime.format(formatString); // 格式化输出
}

export const isThanZero = (value) => regZero.test(value)

export const formatDivision = (value) => {
  if (!value) {
    return "--";
  }
  const $value = parseInt(value);
  return DIVISION_MAP[`${$value}`] || "--"
}

export const formatOrderType = (value) => {
  if (!value) {
    return "--";
  }
  const $value = parseInt(value);
  return ORDER_TYPE_MAP[`${$value}`] || "--"
}

export const validateSpecCode = (value) => {
  if (!value) {
    return false;
  }
  return regSpecCode.test(value);
}

export const formatSpecCode = (spec) => {
  if (!spec) {
    return "--";
  }
  return spec.spec_code;
}

export const formatCastCode = (cast) => {
  if (!cast) {
    return "--";
  }
  return cast.cast_code;
}

/// 格式化对象数据 Area Site 等
export const formatObjCode = (obj, code, desc) => {
  if (!obj) {
    return "--";
  }
  let value = obj[code];
  if (desc) {
    value = `${value}-${desc}`;
  }
  return value;
}

export const formatCode = (code, name) => {
  if (!name) {
    return code;
  }
  return `${code}-${name}`;
}

export const secondsToHms = (d) => {
  if (!d) {
    return "--";
  }
  return Math.floor(d / 60) + ":" + (d % 60);
}

// 可以把常用的方法放这里 就不用每个页面都导入Decimal这个包
export const greaterThan = (min, max) => {
  const $min = new Decimal(min || 0);
  const $max = new Decimal(max || parseFloat("Infinity"));
  return $min.gt($max)
}

// 验证是否为blob格式
export function blobValidate(data) {
  return data.type !== 'application/json'
}

export const getLast = (str, length) => {
  if (length <= 0 || !str) {
    return str;
  }
  const $length = str.length;
  return str.substring($length - length, $length);
}

export const getOrderLast = (str, length) => {
  if (length <= 0 || !str) {
    return str;
  }
  if (!str.startsWith("0000")) {
    return str;
  }
  const $length = str.length;
  return str.substring($length - length, $length);
}

// 判断字符是否是字母而且大于等于length
export const hasAtLeastLetters = (str, length = 2) => {
  if (!str) {
    return false;
  }
  // 匹配所有字母
  const letterMatches = str.match(/[a-zA-Z]/g);
  // 判断匹配到的字母数量是否大于等于 2
  return letterMatches && letterMatches.length >= 2;
}

export const isValueEmpty = (value) => {
  return isUndefined(value) || isNull(value) || value === '' || value === 0;
}

// 获取当前周的开始日期和结束日期
export const getWeekRange = (week, format = "MM.DD", divider = "~") => {
  const start = moment().week(week).startOf("week").format(format);
  const end = moment().week(week).endOf("week").format(format);
  return `${start}${divider}${end}`;
}

export const validatePassword = (value) => {
  const re = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z]).{8,32}");
  return re.test(value);
}

export const htmlToText = (html) => {
  // 使用正则表达式移除HTML标签
  return html.replace(/<[^>]*>/g, '');
}


export const floatToFixed = (value, fixed) => {
  if (value) {
    return parseFloat(value).toFixed(fixed);
  }
  return value;
}

// 全局通用打印方法
// 处理数据中的 key 值
const processDataKeys = (data, properties) => {
  const lodashReplace = replace;
  const lodashGet = get;
  data.forEach(item => {
    properties.forEach(({ key }) => {
      if (includes(key, ".")) {
        item[lodashReplace(key, /\./g, "_")] = lodashGet(item, key, '');
      }
      if (!item[key]) {
        item[key] = "";
      }
    });
  });
};

// 生成 printJS 的 properties 配置
const generatePrintProperties = (headers) => {
  const lodashReplace = replace;
  return headers.map(item => ({
    displayName: item.title,
    field: lodashReplace(item.key, /\./g, "_")
  }));
};

export const printTable = (title, headers, data) => {
  // 检查参数是否有效
  if (!isString(title) ||!isArray(headers) ||!isArray(data)) {
    console.error('Invalid parameters provided to printTable function.');
    return;
  }

  const $properties = filter(headers, item => item.key!== "action");
  processDataKeys(data, $properties);

  const printProperties = generatePrintProperties($properties);

  printJS({
    printable: data,
    properties: printProperties,
    type: "json",
    header: title,
    repeatTableHeader: false,
    gridHeaderStyle: 'border: 1px solid #909399;text-align:center;padding: 2px',
    gridStyle: 'border: 1px solid #909399; text-align:center;padding: 2px',
    headerStyle: 'text-align:center;color:#000;width:100%;border:1px #000 solid;',
    scanStyles: false,
    style: '@page{size:landscape;margin: 0cm;}'
  });
};
