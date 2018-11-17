(() => {

  const fixdata = (data) => {
    var o = '',
      l = 0,
      w = 10240
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w,
      l * w + w)))
    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
    return o
  }

  // ワークブックのデータをjsonに変換
  const to_json = (workbook) => {
    var result = {}
    workbook.SheetNames.forEach(function (sheetName) {
      var roa = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName],
        {
          header: ['name_ja', 'name', 'yomi', 'roma', 'keyword'],
        })
      if (roa.length > 0) {
        result[sheetName] = roa
      }
    })
    return result
  }

  const readFile = () => {
    const fileInput = document.getElementById('file')
    const file = fileInput.files[0]
    if (!file) {
      alert('ファイルがありません')
      return
    }

    var reader = new FileReader()
    reader.onload = function (e) {
      var data = e.target.result
      var wb
      var arr = fixdata(data)
      wb = XLSX.read(btoa(arr), {
        type: 'base64',
        cellDates: true,
      })

      const d = Object.values(to_json(wb))[0]
      const nd = d.slice(1)
      const blob = new Blob([JSON.stringify(nd, null, '  ')], {type: 'application\/json'})
      const url = URL.createObjectURL(blob)
      document.getElementById('link').href = url
      document.getElementById('total').textContent = nd.length
    }

    reader.readAsArrayBuffer(file)
  }

  const startButton = document.getElementById('start')
  startButton.addEventListener('click', () => {
    readFile()
  })
})()