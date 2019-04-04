### \# project.config.json

在根目录新建 project.config.json 并修改 AppId

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
