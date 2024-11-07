# form11

 Version: 0.9.1

 Author  :

 date    : 2024/11/06

 update  : 2024/11/07

***

D1 database + form edit

* claude.ai generate , code fix

***
### workers + D1 database

https://github.com/kuc-arc-f/hono_34api

***
### Setup
* .env

```
VITE_APP_NAME="remix51"
VITE_AUTH_USER_MAIL="test@example.com"
VITE_AUTH_PASSWORD="1234"
VITE_AUTH_USER_ID="1"
VITE_API_URI="https://localhost"
```


***
### Prompt

```
コード生成して欲しいです。
TODO アプリ、Remix shadcn/ui 使用したいです。

項目は、下記を追加したい。
title: INPUTタグ type=text
content: INPUTタグ type=text
content_type: INPUTタグ type=text
age: INPUTタグ type=text
public(公開、非公開) INPUTタグ type=radio
food_orange: INPUTタグ type=checkbox
food_apple: INPUTタグ type=checkbox
food_banana:  INPUTタグ type=checkbox
food_melon:  INPUTタグ type=checkbox
food_grape:  INPUTタグ type=checkbox
date_publish: INPUTタグ type=date
date_update: INPUTタグ type=date
post_number: INPUTタグ type=text
address_country: INPUTタグ type=text
address_pref: INPUTタグ type=text
address_city: INPUTタグ type=text
address_1: INPUTタグ type=text
address_2: INPUTタグ type=text
text_option1: INPUTタグ type=text
text_option2: INPUTタグ type=text


・TODOの追加機能を、ダイアログで編集したいです。
・TODOの編集機能を、ダイアログで編集したいです。
・TODOの削除機能を、追加したいです。
・TODOの検索機能を、追加したいです。

```

***
```
コード生成して欲しいです。
上記、
Remix action 関数で
バリデーション追加したい。react-hook-form未使用にしたい
npmは zod 使用したい

検証内容は、下記です。
title: １文字以下は。エラー
content: 未入力は。エラー
content_type: 未入力は。エラー

```


***
