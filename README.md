## \# 安装与运行

### Taro CLI

```bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli
```

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

![QR-Code-12.jpg](https://upload-images.jianshu.io/upload_images/2351420-be3506b3de26d05f.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

考勤 Attnd 是基于 LBS 开发的考勤和签到小程序，旨在提高课堂考勤的效率

### 开发

技术栈：Taro、Taro UI、云开发

### 贡献者

鲤资姨、FOON、纸纸纸盆、脑浮泥


