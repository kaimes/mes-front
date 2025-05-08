import useCommonStore from "@/app/common"

export function getDictLabel(code, value, itemValue = 'value', itemTitle = 'title') {
  const store = useCommonStore();
  const dictItems = store.dict[code] || [];
  const item = dictItems.find(item => item[itemValue] === value);
  return item ? item[itemTitle] : value;
}
