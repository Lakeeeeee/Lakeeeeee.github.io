# `mkdocs-asciidoctor-backend` 設定參考

這份文件整理的是 `mkdocs-asciidoctor-backend` 目前可在 `mkdocs.yml` 中設定的項目。

你的專案目前使用方式大致如下：

```yaml
plugins:
  - search
  - asciidoctor_backend:
      fail_on_error: false
      safe_mode: safe
      attributes:
        showtitle: true
        imagesdir: images
        sectanchors: true
        sectlinks: true
        source-highlighter: rouge
```

## 1. `attributes` 可設定的常用內容

這些不是 plugin 自己新增的設定鍵，而是透過 `attributes:` 傳給 Asciidoctor 的屬性。

嚴格來說，Asciidoctor 可用的 attributes 遠不只這裡列的幾個；下面這份是目前最常用，也最貼近你這個專案需求的整理。

### `showtitle`

- 用途：讓文件標題真正輸出到 HTML。
- 常見效果：`.adoc` 裡的 `= 標題` 會轉成頁面裡的標題元素。

```yaml
attributes:
  showtitle: true
```

### `imagesdir`

- 用途：設定圖片相對目錄。

```yaml
attributes:
  imagesdir: images
```

### `sectanchors`

- 用途：替各節標題加上 anchor。

```yaml
attributes:
  sectanchors: true
```

### `sectlinks`

- 用途：讓標題可以直接連到自己。

```yaml
attributes:
  sectlinks: true
```

### `source-highlighter`

- 用途：指定程式碼區塊的語法高亮器。

```yaml
attributes:
  source-highlighter: rouge
```

### `icons`

- 用途：控制 icon 顯示方式。

```yaml
attributes:
  icons: font
```

### `idprefix`

- 用途：控制自動產生錨點 id 的前綴。

```yaml
attributes:
  idprefix: ""
```

### `idseparator`

- 用途：控制自動產生 id 時的分隔字元。

```yaml
attributes:
  idseparator: "-"
```

### `outfilesuffix`

- 用途：控制交叉連結輸出的副檔名。

```yaml
attributes:
  outfilesuffix: .html
```

這對 `xref` 行為常常有影響。

## 2. Plugin 本身的設定鍵

以下這些是 plugin 原始碼 `config_scheme` 中明確定義的設定鍵。

### `asciidoctor_cmd`

- 型別：`string`
- 預設值：`asciidoctor`
- 用途：指定要呼叫哪個 Asciidoctor 指令。
- 例子：

```yaml
plugins:
  - asciidoctor_backend:
      asciidoctor_cmd: asciidoctor
```

如果你的環境裡有自訂命令名稱或包裝腳本，可以在這裡改。

### `safe_mode`

- 型別：`string`
- 可用值：`unsafe`、`safe`、`server`、`secure`
- 預設值：`safe`
- 用途：控制 Asciidoctor 的安全模式。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      safe_mode: safe
```

一般來說：
- `safe` 是較常見的平衡選擇
- `secure` 會更嚴格
- `unsafe` 最寬鬆，但風險也最高

### `base_dir`

- 型別：`string`
- 預設值：`null`
- 用途：設定 Asciidoctor 的 base directory。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      base_dir: .
```

這會影響 include 路徑與部分相對資源解析。

### `attributes`

- 型別：`dict`
- 預設值：`{}`
- 用途：把 Asciidoctor attributes 注入到文件轉換流程中。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      attributes:
        showtitle: true
        imagesdir: images
        sectanchors: true
        sectlinks: true
        source-highlighter: rouge
```

這一塊不是 plugin 私有設定，而是「傳給 Asciidoctor 的屬性」。

### `requires`

- 型別：`list`
- 預設值：`[]`
- 用途：指定 Asciidoctor 執行時需要先載入的 Ruby library。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      requires:
        - asciidoctor-diagram
```

如果你有用擴充套件，通常會從這裡掛。

### `fail_on_error`

- 型別：`bool`
- 預設值：`true`
- 用途：遇到轉換錯誤時，是否讓 build 直接失敗。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      fail_on_error: false
```

在內容還常常調整的階段，設成 `false` 比較寬鬆；正式部署時很多人會改回 `true`。

### `trace`

- 型別：`bool`
- 預設值：`false`
- 用途：是否輸出較完整的追蹤資訊。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      trace: true
```

這通常用在除錯轉換問題時。

### `max_workers`

- 型別：`int`
- 預設值：`0`
- 用途：控制並行渲染 `.adoc` 檔案的 worker 數量。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      max_workers: 4
```

補充：
- `0` 代表自動使用可用 CPU 核心數
- 設成 `1` 表示不並行

### `ignore_missing`

- 型別：`bool`
- 預設值：`false`
- 用途：遇到缺失檔案時是否忽略。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      ignore_missing: true
```

如果你的文件正在搬移、拆分，這個選項有時可以減少 build 中斷。

### `edit_includes`

- 型別：`bool`
- 預設值：`false`
- 用途：啟用 included AsciiDoc 模組的「edit include」連結功能。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      edit_includes: true
```

這個功能通常會搭配 `repo_url`、`edit_uri` 或 `edit_base_url` 使用。

### `edit_base_url`

- 型別：`string`
- 預設值：空字串
- 用途：手動指定 edit include 連結的 base URL。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      edit_includes: true
      edit_base_url: https://github.com/your-name/your-repo/edit/main/
```

如果已經有 `repo_url` 加 `edit_uri`，plugin 也會嘗試自動組出這個值。

### `repo_root`

- 型別：`string`
- 預設值：`null`
- 用途：指定 repository root，供 edit include 功能計算檔案位置。

例子：

```yaml
plugins:
  - asciidoctor_backend:
      edit_includes: true
      repo_root: .
```

如果不手動指定，plugin 會嘗試自動找 git root。

## 3. 一份較完整的範例

```yaml
plugins:
  - search
  - asciidoctor_backend:
      asciidoctor_cmd: asciidoctor
      safe_mode: safe
      fail_on_error: false
      ignore_missing: true
      max_workers: 0
      attributes:
        showtitle: true
        imagesdir: images
        sectanchors: true
        sectlinks: true
        icons: font
        idprefix: ""
        idseparator: "-"
        outfilesuffix: .html
        source-highlighter: rouge
```

## 4. 實務上怎麼分辨「該改哪裡」

可以用這個方式判斷：

- 想改 plugin 行為：
  改 `asciidoctor_backend:` 底下的設定鍵，例如 `fail_on_error`、`safe_mode`、`max_workers`
- 想改 AsciiDoc 文件的輸出行為：
  改 `attributes:` 底下的屬性，例如 `showtitle`、`imagesdir`、`outfilesuffix`

## 5. 目前你專案最值得保留的設定

以你現在這個部落格專案來說，這幾個通常最有感：

- `safe_mode: safe`
- `fail_on_error: false`
- `attributes.showtitle: true`
- `attributes.imagesdir: images`
- `attributes.sectanchors: true`
- `attributes.sectlinks: true`
- `attributes.source-highlighter: rouge`

## 6. 來源

這份整理主要依據以下來源：

- PyPI 專案頁：<https://pypi.org/project/mkdocs-asciidoctor-backend/>
- GitHub README：<https://github.com/aireilly/mkdocs-asciidoctor-backend>
- Plugin 原始碼 `config_scheme`：
  <https://github.com/aireilly/mkdocs-asciidoctor-backend/blob/main/asciidoctor_backend/plugin.py>
- 組態處理邏輯：
  <https://github.com/aireilly/mkdocs-asciidoctor-backend/blob/main/asciidoctor_backend/config.py>

補充：
- `attributes` 能傳入的 Asciidoctor 屬性其實遠不只這裡列的幾個，這份文件只整理目前最常用、也最貼近你專案需求的部分。
- 這個 plugin 目前仍屬早期版本，之後可設定項目有可能變動。
