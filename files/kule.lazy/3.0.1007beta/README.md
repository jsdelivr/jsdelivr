Kule Lazy 3
=============
版本：3.0.1007beta

使用說明請看：http://www.kule.tw/doc.html

<h2>前言</h2>
<p>這是一個純CSS的Framework，目前不包含 Javascript，但未來陸續會新增 Javascript 的處理、Icon的繪製、更多模組。</p>

<h4>載入檔案</h4>
<p>將依照您的路徑連結您使用的檔案，例如：</p>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-lazy3-full.min.css" /&gt;</code></pre>
<p>在使用 Kule Lazy 之前，建議載入 <a href="http://urbrowser.kule.tw" target="_blank">urBrowser</a>，它能夠幫助你針對不同平台或瀏覽器進行除錯，如果你有使用 kule-grid-ie.min.css 的話，那麼它會是<span class="text-focus">必須載入</span>的 Javascript 檔案，例如：</p>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-grid.min.css" /&gt;
&lt;script src="你的資料夾路徑/kule-urbrowser.min.js" /&gt;</code></pre>
<h5>建議載入的順序</h5>
<p>載入順序可參照上方表格的順序</p>
<h6>使用全部效果：</h6>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-lazy3-full.min.css" /&gt;
&lt;link href="你的資料夾路徑/kule-effects.min.css" /&gt;
&lt;link href="你的資料夾路徑/kule-animates.min.css" /&gt;
&lt;link href="你的資料夾路徑/kule-jquery-ui.min.css" /&gt;
&lt;script src="你的資料夾路徑/kule-urbrowser.min.js" /&gt;</code></pre>
<h6>單獨使用 Grid System：</h6>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-grid.min.css" /&gt;
&lt;script src="你的資料夾路徑/kule-urbrowser.min.js" /&gt;</code></pre>
<h6>只要使用基本樣式：</h6>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-base.min.css" /&gt;
&lt;script src="你的資料夾路徑/kule-urbrowser.min.js" /&gt;</code></pre>
<h6>使用基本樣式與組件：</h6>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-lazy3.min.css" /&gt;
&lt;script src="你的資料夾路徑/kule-urbrowser.min.js" /&gt;</code></pre>
<h6>使用基本樣式與組件搭配附加模組：</h6>
<pre><code class="language-markup">&lt;link href="你的資料夾路徑/kule-lazy3.min.css" /&gt;
&lt;link href="你的資料夾路徑/kule-addons.min.css" /&gt;
&lt;script src="你的資料夾路徑/kule-urbrowser.min.js" /&gt;</code></pre>
<hr />
<h2 id="rule">全域規則</h2>
<p>在你使用 Lazy 之前，請先初步了解基本規則，這樣會幫助你更簡單使用 Lazy。</p>
<h4>配色與狀態</h4>
<p>以下為Lazy的配色與狀態顏色，使用配色時請以 <code>.color-</code> 為開頭並搭配以下配色名稱，例如：<code>.color-primary</code></p>
<pre><code class="language-markup">&lt;a class="btn color-primary"&gt;按鈕&lt;/a&gt;
&lt;a class="btn color-suceess"&gt;按鈕&lt;/a&gt;
&lt;a class="btn color-warning"&gt;按鈕&lt;/a&gt;
&lt;a class="btn color-error"&gt;按鈕&lt;/a&gt;</code></pre>
<p>還有一種情況也能使用配色，當給予父層標籤時，所有內容都會套上顏色，例如：</p>
<pre><code class="language-markup">&lt;div class="btn-grp color-primary"&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;/div&gt;</code></pre>
<hr />
<h4>尺寸大小</h4>
<p>除了原本的預設大小之外，大部分的元素或組件都有其他四種尺寸變化，包含</p>
<pre><code class="language-markup">&lt;a class="btn size-xs"&gt;按鈕&lt;/a&gt;
&lt;a class="btn size-sm"&gt;按鈕&lt;/a&gt;
&lt;a class="btn size-lg"&gt;按鈕&lt;/a&gt;
&lt;a class="btn size-xl"&gt;按鈕&lt;/a&gt;</code></pre>
<p>當然這也與配色一樣可以直接給予父層讓所有元素有著相同尺寸</p>
<pre><code class="language-markup">&lt;div class="btn-grp size-sm"&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;/div&gt;</code></pre>
<hr />
<h4>Disabled</h4>
<p>只要使用到 <code>disabled</code> 屬性或是 <code>.disabled</code> 時，該區塊或是元件就會無法點選並且加上透明度。</p>
<pre><code class="language-markup">&lt;input type="text" class="ctrl-input" disabled /&gt;
&lt;div class="btn-grp disabled"&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;a class="btn"&gt;按鈕&lt;/a&gt;
&lt;/div&gt;</code></pre>
<hr />
<h2 id="supported">瀏覽器與裝置</h2>
<h4>各平台上的瀏覽器支援</h4>
<p>基本上市面主流系統與瀏覽器都有支援，但Opera的版本煩亂就沒有刻意去處理，至於 IE 瀏覽器主要支援 IE 9以上版本，當然如果本身CSS 3屬性完全不支援的情況下就無法支援。至於微軟最新的 Edge 瀏覽器採用的是 Webkit 核心，所以支援度應該與 Chrome 差不了太多。<span class="text-note">根據<a href="https://zh.wikipedia.org/zh-tw/Microsoft_Edge" target="_blank">維基百科</a>指出：『Microsoft Edge 使用了名為 EdgeHTML 的瀏覽器引擎，該引擎是 Trident 的一個分支。』但從 userAgent 來看，的確是顯示 Webkit。(Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240)</span></p>
<p class="text-note">我自己專案的瀏覽器支援度通常是最新版號-1。</p>
<div class="table-responsive-scroll">
<table class="table table-definition">
    <thead>
        <tr>
            <th></th>
            <th>Chrome</th>
            <th>Firefox</th>
            <th>Edge</th>
            <th>IE</th>
            <th>Safari</th>
            <th>Opera</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Windows</th>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-warning">局部支援<br /><span class="text-note">請見下方表格</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
        <tr>
            <th>Mac OS</th>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
        <tr>
            <th>iOS</th>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-error">不支援</span></td>
        </tr>
        <tr>
            <th>Android</th>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-muted">不存在</span></td>
            <td><span class="text-error">不支援</span></td>
        </tr>
    </tbody>
</table>
</div>
<hr />
<h4>IE 瀏覽器支援度</h4>
<p>使用有關動畫效果如 Effects, Animates時，請先注意 IE 支援度是否符合你的專案。</p>
<div class="table-responsive-scroll">
<table class="table table-definition">
    <thead>
        <tr>
            <th></th>
            <th>6, 7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
            <th>11</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Lazy</th>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-warning">局部支援</span></td>
            <td><span class="text-warning">局部支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
        <tr>
            <th>Grid System</th>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-warning">局部支援<br /><span class="text-note">支援 Grid<br />但不含 Responsive</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
        <tr>
            <th>Animates</th>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
        <tr>
            <th>Effects</th>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
        <tr>
            <th>jQuery UI Theme</th>
            <td><span class="text-error">不支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
            <td><span class="text-success">支援</span></td>
        </tr>
    </tbody>
</table>
</div>
<hr />
<h3>Hacks</h3>
<p>Hack 基本上是針對 IE 瀏覽器，尤其是 IE 8，因為部分模組有使用 @media query，因此另外寫 Hack 給 IE 8，所以請記得載入 <a href="http://urBrowser.kule.tw" target="_blank">urBrowser</a>，Hack 才能生效。</p>
<hr />
<h2 id="license">使用授權</h2>
<p>完全免費，真是佛心來著。其實當初只是用不慣其他 CSS Frameworks，所以把以前寫過的東西拿出來整理，然後自己刻了一套。</p>
<hr />
<h2 id="feedback">問題與回報</h2>
<p>目前處於 beta 版本中，但大致上都已完成，主要剩下 IE Hack 以及 Mobile 上的測試。當然如果你有發現任何疑問或是 bug，歡迎隨時到 <a href="https://www.facebook.com/kule.tw" target="_black">Facebook</a> 上告訴我，謝謝你。</p>