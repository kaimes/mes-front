import i18n from '../locals/index'  // 引入

export function getI18nText(key) {
    return i18n.global.t(key);
}

export function getI18nTextNew(key) {
    // 将下划线变为空格
    let formattedText = key.replace(/_/g, ' ');
  
    // 将每个单词的首字母大写
    formattedText = formattedText.replace(/\b\w/g, char => char.toUpperCase());
  
    return formattedText;
  }
  

