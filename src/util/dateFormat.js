
function convertDateTimeFormat(dateTimeString) {
    // 测试函数
    // const originalDateTime = '2024-09-28T01:40:26.188391';
    // const convertedDateTime = convertDateTimeFormat(originalDateTime);
    // console.log(convertedDateTime); // 输出: 2024-09-28 01:40:26
    // 创建一个Date对象，传入ISO 8601格式的字符串
    const date = new Date(dateTimeString);

    // 使用getFullYear(), getMonth(), getDate(), getHours(), getMinutes(), getSeconds()获取日期和时间的各个部分
    // 注意：getMonth()返回的月份是从0开始的，所以需要加1
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 补零处理
    const day = ('0' + date.getDate()).slice(-2); // 补零处理
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);

    // 拼接成新格式的字符串
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
}
