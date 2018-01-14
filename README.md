# HackingMap

> HackingMap 是個即時、共編的黑客松專案地圖，讓 g0v 大松現場的坑主、新參者在 g0v 大松徵人、跳坑更容易！

## Demo
[https://g0v.github.io/HackingMap](https://g0v.github.io/HackingMap)

![demo](https://media.giphy.com/media/3oFzmkAlwBUlm96YSs/giphy.gif)

## 開發

``` bash
# 安裝 package.json 中的套件
yarn

# 在 localhost:8080 跑 dev server，開始開發，localhost:8080 的內容會即時更新
yarn dev

# 開發完成後用 webpack 打包輸出到 dist/
yarn build

# 部署到 firebase，完成後造訪 https://g0v.github.io/HackingMap 應該就會更新了！
yarn run deploy

# For detailed explanation on how things work, consult the docs for vue-loader(http://vuejs.github.io/vue-loader).
```

## 資料夾結構
```
backup // *備份大家填寫的專案資訊*
dist // webpack 打包輸出的 production code
node_modules // 第三方套件
src
 |-assets
 |-components // 可重複使用的 Vue Component
 `-config
   |-detailTypes.js // *定義專案可編輯欄位（slack、共編連結...等等）*
 |-service
 `-views
   |-ProjectEditor.vue // 點擊 Edit 跳出的編輯專案表單
   |-TheList.vue // 左側專案列表
   `-TheMap.vue // 右半邊的svg地圖
 |-App.vue
 `-main.js
package.json // 第三方套件列表
webpack.config.js // 詳見 https://webpack.js.org/
```

## Contribution
本專案 follow [Vue.js 官方風格指南](https://cn.vuejs.org/v2/style-guide/) ，commit message 格式請參考[這裏](https://karma-runner.github.io/2.0/dev/git-commit-msg.html)
