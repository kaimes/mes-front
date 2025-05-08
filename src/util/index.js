import {mapValues, groupBy} from "lodash";
import {customAlphabet} from "nanoid";
import moment from "moment/moment";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 10);
// model.id = nanoid(5) //=> "f01a2"
const nest = function (seq, keys) {
  if (!keys.length) return seq;
  var first = keys[0];
  var rest = keys.slice(1);
  return mapValues(groupBy(seq, first), function (value) {
    return nest(value, rest);
  });
};

const randomElement = (arr = []) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const kebab = str => {
  return (str || "").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

const toggleFullScreen = () => {
  let doc = window.document;
  let docEl = doc.documentElement;

  let requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  let cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;
  let flag = false;
  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    flag = true;
    requestFullScreen.call(docEl);
  } else {
    flag = false;
    cancelFullScreen.call(doc);
  }
  return flag;
};

// 获取地址栏参数
const getQueryVariable = variable => {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
};

// 千位符
const thousandthSign = (num, fixed) => {
  if (!!num) {
    num = Number(num);
    return num.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
  } else if (num === 0) {
    return 0;
  }
};

function formatDecimal(num, decimal) {
  num = num.toString();
  let index = num.indexOf(".");
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
  } else {
    num = num.substring(0);
  }
  return parseFloat(num).toFixed(decimal);
}

function get_random_uuid_custom(value) {
  return nanoid(value);
}

function GET_RANDOM_UUID() {
  return nanoid(5);
}

function generateWeekOptions() {
  const weeks = moment().weeksInYear();
  let options = [];
  for (let i = 1; i <= weeks; i++) {
    options.push({text: `${i}`, value: i});
  }
  return options;
}

export default {
  randomElement,
  toggleFullScreen,
  kebab,
  nest,
  getQueryVariable,
  thousandthSign,
  formatDecimal,
  GET_RANDOM_UUID,
  get_random_uuid_custom,
  generateWeekOptions
};
