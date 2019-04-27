## \# 安装与运行

### project.config.json

在根目录新建 project.config.json，拷贝下面这段代码并修改 AppId

```json
{
  "miniprogramRoot": "client/dist/",
  "cloudfunctionRoot": "cloud/functions/",
  "projectname": "attnd-taro",
  "description": "LBS Attnd.",
  "appid": "your AppId",
  "setting": {
    "urlCheck": true,
    "es6": false,
    "postcss": false,
    "minified": false,
    "newFeature": true
  },
  "compileType": "miniprogram",
  "condition": {}
}
```

### npm install

进入 client 目录安装依赖

```bash
cd client
npm install
```

等待依赖安装完成，即可运行

接下来这条命令将项目编译成微信小程序

```bash
npm run dev:weapp
```

### 注意点

- 打开微信开发者工具，注意选择项目的根目录打开，即包含 client 和 cloud 目录
- 本项目使用 Taro 开发，使用微信开发者工具有几点需要注意的，参考 [Taro 开发前注意](https://nervjs.github.io/taro/docs/before-dev-remind.html)
- 需要开通微信小程序云开发，具体参考 [云开发起步](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

## \# 关于我们

### 考勤 Attnd

考勤 Attnd 是基于 LBS 开发的考勤和签到小程序，旨在提高课堂考勤的效率。

### 优势与局限

考勤 Attnd 被设计成快捷、轻量级的考勤应用，老师创建考勤以快速记录已到学生和人数，学生输入对应口令即可签到。

但也存在其局限性，没有创建班级或导入功能，即无法知道班级名单，简单来说，老师知道 “谁到了”，但不知道 “谁没到”。后续会考虑加入 “导出到邮箱” 功能，以便老师统计和存档。

考勤 Attnd 如今的设计似乎更适用于自主举办活动的人数记录和统计。

### 开发

考勤 Attnd 尝鲜微信小程序云开发，使用 Taro + Taro UI，重构曾使用 WePY + Java 开发的第一版。本项目只用于技术学习和交流，欢迎提 issue。

旧前端仓库：https://github.com/PolluxLee/attnd-weapp
旧后端仓库：https://github.com/WisperDin/attnd-server

### 贡献者

鲤资姨、FOON、纸纸纸盆、脑浮泥


