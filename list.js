const AVAILABLE_LANG = ['chinese', 'english', 'korean', 'portuguese', 'spanish', 'vietnamese'];

(() => {

  const search = document.getElementById('search')
  search.addEventListener('input', () => {
    const key = search.value
    for (let i = 0; i < table.children.length; i++) {
      const child = table.children[i]
      const dataKey = child.getAttribute('data-key')
      if (!dataKey) continue
      if (dataKey.includes(key)) {
        child.className = ''
      } else {
        child.className = 'hidden'
      }
    }
  })

  const loadLanguages = (lng) => {
    return axios.get(`languages/${lng}.json`)
      .then(res => {
        return {data: res.data, lng}
      })
  }

  const createDataList = (value) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = value
    return option
  }

  const getJapaneseColumns = (langFile) => {
    return langFile.map(lngObj => lngObj.name_ja)
  }

  const createLanguageRow = (key, languageFiles) => {
    const tr = document.createElement('tr')
    tr.setAttribute('data-key', key)
    const td = document.createElement('td')
    td.textContent = key
    tr.appendChild(td)
    languageFiles.map(file => {
      const translate = file.find(f => f.name_ja === key)
      const td = document.createElement('td')
      td.textContent = translate.name
      tr.appendChild(td)
    })
    return tr
  }

  const createLanguageHeader = (languageFile) => {
    const tr = document.createElement('tr')
    const jaTh = document.createElement('th')
    jaTh.textContent = '日本語'
    tr.appendChild(jaTh)
    languageFile.forEach(l => {
      const th = document.createElement('th')
      th.textContent = l.lng
      tr.appendChild(th)
    })
    return tr
  }

  const dataList = document.getElementById('data')
  const table = document.getElementById('tbody')
  const thead = document.getElementById('thead')
  Promise.all(AVAILABLE_LANG.map(loadLanguages))
    .then(languages => {
      const header = createLanguageHeader(languages)
      thead.appendChild(header)
      const ja = getJapaneseColumns(languages[0].data)
      ja.map(key => {
        const option = createDataList(key)
        const row = createLanguageRow(key, languages.map(l => l.data))
        table.appendChild(row)
        // dataList.appendChild(option)
      })
    })
})()