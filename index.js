const fs = require('fs')
const readline = require('readline')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

function parse(path, verify = true) {
  return new Promise((resolve, reject) => {
    // 创建一个可读流
    const fileStream = fs.createReadStream(path)

    // 使用readline逐行读取
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    })

    // 定义你的正则表达式
    // const regex = /^`(.+)`: (.+)$/
    // const regex = /^`([^`]+)`\s*(`([^`]+)`\s*)*:\s*(.+)$/
    const regex = /`([^`]+)`/g
    let matched = 0
    const items = []
    rl.on('line', (line) => {
      if (line.startsWith('`') && line.indexOf(':') > -1) {
        matched++
        const models = [...line.matchAll(regex)].map((match) => match[1])
        const name = line.split(':')[1].trim()
        for (const model of models) {
          items.push({ model, name })
        }
      }
    })

    rl.on('close', () => {
      console.log(
        `Finished reading the file ${path}, ${matched} lines matched, ${items.length} items found.`
      )
      if (verify) {
        const text = fs.readFileSync(path, 'utf-8')
        const matches = [...text.matchAll(/`[^`]+`[\s:]/g)]
        if (matches.length !== items.length) {
          console.error(
            'items mismatch:',
            path,
            items.length,
            matches.length,
            text
          )
          reject(new Error('items mismatch'))
        }
      }
      resolve(items)
    })
  })
}

const filelist = [
  {
    path: './brands/honor_cn.md',
    brand: 'honor',
  },
  {
    path: './brands/huawei_cn.md',
    brand: 'huawei',
  },
  {
    path: './brands/meizu.md',
    brand: 'meizu',
  },
  {
    path: './brands/nubia.md',
    brand: 'nubia',
  },
  {
    path: './brands/oneplus.md',
    brand: 'oneplus',
  },
  {
    path: './brands/oppo_cn.md',
    brand: 'oppo',
  },
  {
    path: './brands/realme_cn.md',
    brand: 'oppo',
  },
  {
    path: './brands/samsung_cn.md',
    brand: 'samsung',
  },
  {
    path: './brands/vivo_cn.md',
    brand: 'vivo',
  },
  {
    path: './brands/xiaomi.md',
    brand: 'xiaomi',
  },
  {
    path: './brands/zte.md',
    brand: 'zte',
  },
]

const data = []
Promise.all(
  filelist.map(({ path, brand }) =>
    parse(path).then((items) => {
      data.push(...items.map((item) => ({ ...item, brand })))
    })
  )
)
  .then(() => {
    // 定义CSV文件的路径和列头
    const csvWriter = createCsvWriter({
      path: 'out.csv', // 输出文件的路径
      header: [
        { id: 'brand', title: 'BRAND' },
        { id: 'model', title: 'MODEL' },
        { id: 'name', title: 'NAME' },
      ],
    })
    return csvWriter.writeRecords(data)
  })
  .then(() => {
    console.log('The CSV file was written successfully')
    return fs.promises.writeFile('out.json', JSON.stringify(data, null, 2))
  })
  .then(() => {
    console.log('The JSON file was written successfully')
    const result = data.reduce((result, item) => {
      result[item.brand] = result[item.brand] || []
      result[item.brand].push(item.model)
      return result
    }, {})

    Object.keys(result).forEach((key) => {
      result[key] = result[key].join('|')
    })

    return fs.promises.writeFile('./re.json', JSON.stringify(result))
  })
  .then(() => {
    console.log('The re JSON file was written successfully')
  })
