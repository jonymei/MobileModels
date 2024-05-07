# 开发说明

## 构建结构化数据

执行：

```shell
npm install
node index.js
```

会在当前目录下生成以下文件，其中：

- out.csv：品牌、型号、名称对照表
- out.json：品牌、型号、名称对照表
- re.json：品牌、型号正则表达式

## 使用示例

参考 `test.js` 源文件，可以根据 UserAgent 进行正则匹配，获取手机的品牌和型号，以及进一步查询对照表获取手机的市场名称。

## 根据品牌名匹配应用商店 URL Scheme

- 华为
  - 匹配品牌：huawei
  - appmarket://details?id=com.iflytek.sparkdoc
- 荣耀
  - 匹配品牌：honor
  - appmarket://details?id=com.iflytek.sparkdoc // 待确认
- OPPO
  - 匹配品牌：oppo、oneplus
  - oppomarket://details?packagename=com.iflytek.sparkdoc
- vivo
  - 匹配品牌：vivo
  - vivomarket://details?id=com.iflytek.sparkdoc
- 小米
  - 匹配品牌：xiaomi
  - mimarket://details?id=com.iflytek.sparkdoc
- 其他
  - market://details?id=com.iflytek.sparkdoc