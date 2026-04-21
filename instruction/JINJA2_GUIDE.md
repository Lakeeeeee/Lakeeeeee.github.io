# MkDocs 裡常用的 Jinja2 語法筆記

這份筆記整理的是在 MkDocs，尤其是 Material for MkDocs 裡最常用到的 Jinja2 模板語法。

## 1. 繼承模板

```html
{% extends "base.html" %}
```

這表示目前這個模板不是從零開始寫，而是繼承 `base.html` 的整體結構。

在 MkDocs 裡，`base.html` 通常已經包含：
- 頁首
- 側邊欄
- 頁尾
- CSS 與 JavaScript 載入
- 主要頁面框架

所以客製化時通常不會整頁重寫，而是先繼承，再覆寫局部區塊。

## 2. 覆寫區塊

```html
{% block content %}
{% endblock %}
```

這表示要覆寫名為 `content` 的模板區塊。

`block` 可以理解成「父模板預留給子模板修改的一塊區域」。

常見區塊包含：
- `content`
- `scripts`
- `extrahead`

實際可覆寫的區塊名稱，要看主題模板本身怎麼定義。

## 3. 保留父模板原本內容

```html
{{ super() }}
```

這表示把父模板在同一個 `block` 裡原本的內容插回來。

這個語法很重要，因為很多時候我們不是要把原本內容整個刪掉，而是要在外面多包一層 HTML，或在前後加一些自訂區塊。

例如：

```html
{% extends "base.html" %}

{% block content %}
  <div class="custom-page-shell">
    {{ super() }}
  </div>
{% endblock %}
```

這樣會保留原本頁面內容，只是在外面多包一層 `div`，方便做版面設計。

## 4. 輸出變數

```html
{{ page.title }}
{{ config.site_name }}
```

雙大括號表示把變數值輸出到 HTML 中。

在 MkDocs 裡常見的變數有：
- `page.title`：目前頁面的標題
- `config.site_name`：`mkdocs.yml` 裡設定的網站名稱
- `page.content`：頁面主要內容
- `nav`：整體導覽資料

例如：

```html
<h1>{{ page.title }}</h1>
<p>{{ config.site_name }}</p>
```

## 5. 條件判斷

```html
{% if page.title %}
  <h1>{{ page.title }}</h1>
{% endif %}
```

這表示如果 `page.title` 有值，就顯示標題。

這很適合用來做不同頁面的差異化顯示，例如首頁和一般文章頁分開處理。

例如：

```html
{% if page.is_homepage %}
  <section class="hero">
    <h1>{{ config.site_name }}</h1>
  </section>
{% endif %}
```

## 6. 迴圈

```html
{% for item in nav %}
  <a href="{{ item.url }}">{{ item.title }}</a>
{% endfor %}
```

這表示把 `nav` 裡的項目逐一處理。

通常用在：
- 產生導覽列
- 文章清單
- 分類或標籤列表

## 7. 註解

```html
{# 這是註解 #}
```

這種註解只存在模板裡，不會出現在最後輸出的 HTML。

它適合拿來寫模板內部說明。

## 8. 一個安全的起手式

如果只是想改每頁內容框的外觀，而不想破壞原本文章內容，最安全的寫法通常是：

```html
{% extends "base.html" %}

{% block content %}
  <div class="custom-page-shell">
    {{ super() }}
  </div>
{% endblock %}
```

這種做法的優點是：
- 保留 MkDocs Material 原本的內容區
- 方便用 CSS 控制內容寬度、背景、圓角、陰影
- 風險比整頁重寫低很多

## 9. 要避免的寫法

```html
{% extends "base.html" %}
{% block content %}
{% endblock %}
```

這會把 `content` 區塊清空。

如果沒有補上任何內容，頁面中間主體可能會整塊消失。

## 10. 在這個專案裡怎麼用

你目前專案裡和 Jinja2 客製化最相關的檔案是：
- `mkdocs.yml`
- `overrides/main.html`
- `stylesheets/extra.css`
- `javascripts/extra.js`

建議分工如下：
- 改網站設定與掛載自訂資源：編輯 `mkdocs.yml`
- 改頁面 HTML 框架：編輯 `overrides/main.html`
- 改排版與視覺：編輯 `stylesheets/extra.css`
- 改互動效果：編輯 `javascripts/extra.js`
