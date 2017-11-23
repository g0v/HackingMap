const urlRegex = /http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/

const detailTypes = {
  slack: {
    name: 'Slack',
    description: '專案於 g0v Slack 的 Channel 或 User ID',
    icon: 'fa fa-slack',
    prefix: 'https://g0v-tw.slack.com/messages/',
    format: /^\w+$/,
    formatErrorMessage: '不含標點，且不需 @ 或 # 開頭！',
    isRequired: false,
  },
  note: {
    name: '共筆',
    description: '專案的共筆 URL',
    icon: 'fa fa-book',
    prefix: '',
    format: urlRegex,
    formatErrorMessage: '請輸入 http(s):// 開頭的有效網址',
    isRequired: false,
  },
  slide: {
    name: 'Slide',
    description: '專案的簡報 URL',
    icon: 'fa fa-newspaper-o',
    prefix: '',
    format: urlRegex,
    formatErrorMessage: '請輸入 http(s):// 開頭的有效網址',
    isRequired: false,
  },
  media: {
    name: 'Media',
    description: '專案的影音介紹（如YouTube）',
    icon: 'fa fa-youtube-play',
    prefix: '',
    format: urlRegex,
    formatErrorMessage: '請輸入 http(s):// 開頭的有效網址',
    isRequired: false,
  },
  github: {
    name: 'GitHub',
    description: 'https://github.com/owner/repo',
    icon: 'fa fa-github',
    prefix: '',
    format: /https:\/\/github.com\/\w+\/\w+(\.git)?/,
    formatErrorMessage: '請輸入有效的 GitHub repo 網址',
    isRequired: false,
  },
  website: {
    name: 'Website',
    description: '專案網站、討論區、社團',
    icon: 'fa fa-window-maximize',
    prefix: '',
    format: urlRegex,
    formatErrorMessage: '請輸入 http(s):// 開頭的有效網址',
    isRequired: false,
  },
}

export { detailTypes }
