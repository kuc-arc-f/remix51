# form5

 Version: 0.9.1

 Author  :
 
 date    : 2024/11/03

 update : 2024/11/04

***

tanstack/react-table + form edit

* claude.ai generate , code fix
* localStorage save, data


***
### Prompt

```
コード生成して欲しいです。
TODO アプリ、Remix shadcn/ui 使用したいです。

項目は、下記を追加したい。
title: INPUTタグ type=text
content: INPUTタグ type=text
public(公開、非公開) INPUTタグ type=radio
food_orange: INPUTタグ type=checkbox
food_apple: INPUTタグ type=checkbox
food_banana:  INPUTタグ type=checkbox
pub_date: INPUTタグ type=date
qty1: INPUTタグ type=text
qty2: INPUTタグ type=text
qty3: INPUTタグ type=text

・TODOの追加機能を、ダイアログで編集したいです。
・TODOの編集機能を、ダイアログで編集したいです。
・TODOの削除機能を、追加したいです。
・TODOの検索機能を、追加したいです。


・Remix action 関数で
バリデーション追加したい。react-hook-form未使用にしたい
npmは zod 使用したい

検証内容は、下記です。
title: １文字以下は。エラー
content: 未入力は。エラー
qty1: 未入力は。エラー
qty2: 未入力は。エラー
qty3: 未入力は。エラー
```
***
