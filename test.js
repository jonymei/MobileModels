const db = require('./out.json')
const patterns = require('./re.json')

const ua =
  'Mozilla/5.0 (Linux; Android 13;2304FPN6DCBuild/TKQ1.221114.001; wv) AppleWebKit/537.36(KHTML, like Gecko) Version/4.0 chrome/116.0.0.0 Mobile Safari/537.36 XWEB/1160117 MMWEBSDK/20240404 MMWEBID/6054 MicroMessenger/8.0.49.2600(0x28003133) WeChat/arm64 Weixin NetType/4G Language/zh CN ABl/arm64'

for (const key of Object.keys(patterns)) {
  const match = ua.match(patterns[key])
  if (match) {
    const model = match[0]
    console.log('model:', model)
    const item = db.find((i) => i.model === model)
    console.log('item:', item)
    break
  }
}