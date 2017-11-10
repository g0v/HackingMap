const urlRe = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/

export default {
  note: {
    name: '共筆',
    description: '專案的共筆 URL',
    format: urlRe,
    formatErrorMessage: '請輸入有效的網址',
    isRequired: true,
  },
  slide: {
    name: 'Slide',
    description: '專案的簡報 URL',
    format: urlRe,
    formatErrorMessage: '請輸入有效的網址',
    isRequired: false,
  },
  slack: {
    name: 'Slack',
    description: '專案的 Slack 邀請 URL',
    format: /(@|#)\w+$/,
    formatErrorMessage: 'Slack帳號需為 @ 或 # 開頭喔！',
    isRequired: false,
  },
  mdeia: {
    name: 'Media',
    description: '專案的影音介紹（如YouTube）',
    format: urlRe,
    formatErrorMessage: '請輸入有效的網址',
    isRequired: false,
  },
}
