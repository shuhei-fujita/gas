
## セットアップ

1. **asdfのセットアップ**

`.tool-versions`に記載されているツールをインストールします。

```bash
asdf install
```

2. **claspのグローバルインストール**

```bash
npm install -g @google/clasp
```

3. **claspのログイン**

```bash
clasp login
```

ブラウザが開き、Googleアカウントでログインします。

4. **プロジェクトの設定**

`.clasp.json`を編集して、`scriptId`を設定します。

```json
{
    "scriptId": "<YOUR_SCRIPT_ID>",
    "rootDir": "./src"
}
```

## 開発

1. **コードのプッシュ**

```bash
clasp push
```

2. **新しいバージョンのデプロイ**

```bash
clasp deploy
```

## 実行

```
clasp open
```

GASのコードはWebブラウザで実行できます。GASエディタで対象の関数を選択し、実行ボタンをクリックします。

## GASで生成されるファイルと設定情報

### コマンド実行後に生成される主なファイル

1. **`.clasp.json`**:

`clasp clone`または`clasp create`を実行した後に生成されます。このファイルは、Google Apps ScriptのプロジェクトIDとローカルプロジェクトの設定を保持します。

2. **`appsscript.json`**:

GASプロジェクトの設定を含むJSONファイル。`clasp pull`を初めて実行したときにダウンロードされます。

3. **`.js`, `.gas`ファイル**:

GASのスクリプトファイル。`clasp pull`でダウンロードまたは`clasp push`でアップロードされます。

4. **`credentials.json`**:

（必要な場合）APIを呼び出すための認証情報。手動でダウンロードと配置が必要です。

### 設定情報

#### `.clasp.json`

このファイルは、以下のような形式で設定情報をJSON形式で保持します。

```json
{
    "scriptId": "<YOUR_SCRIPT_ID>",
    "rootDir": "./src",
    "projectId": "<YOUR_GCP_PROJECT_ID>"
}
```

## 参考文献

ggoel-apps-script/reference
- https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja
