import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.less';

export default class UpdateLog extends Component {

  config = {
    navigationBarTitleText: '更新日志'
  }

  state = {
    logs: [
      {
        version: 'v2.0.0 @2019.06.17',
        points: [
          '[feat] 新增考勤小组功能',
          '[fix] 修复“修改状态”的弹出菜单在iOS上的层级太低问题',
          '[fix] 修复口令中出现“=”导致无法通过路由跳转到对应考勤的问题',
          '[fix] 修复学号/工号为空时无法提交的问题',
          '[improve] 隐藏签到页距离显示',
          '[improve] 多处地方点击拷贝口令换成长按选中自由拷贝'
        ]
      },
      {
        version: 'v1.10.0 @2019.06.10',
        points: [
          '[feat] 新增考勤者手动更改签到者状态的功能',
          '[feat] 新增签到页通告栏',
          '[improve] 卡片去除边框阴影使整体UI明亮'
        ]
      },
      {
        version: 'v1.8.3 @2019.06.08',
        points: [
          '[feat] 新增删除考勤功能',
          '[feat] 新增文本内容合法性检测',
          '[feat] 主页菜单新增转发分享功能',
          '[fix] 修复页面返回时隐藏小程序的问题',
          '[improve] 接口调整优化',
          '[improve] “签到页”与“我的”布局调整'
        ]
      },
      {
        version: 'v1.5.0 @2019.06.01',
        points: [
          '[feat] 新增赞赏功能 感谢支持 😘'
        ]
      },
      {
        version: 'v1.4.3 @2019.05.31',
        points: [
          '[feat] 签到页新增打开地图查看考勤位置',
          '[feat] 在“我的”页面新增查看更新日志的入口',
          '[fix] 修复签到时签到者出现两次的问题',
          '[improve] 优化小程序未获取地理位置时的引导页文案',
          '[improve] 优化签到后“超出距离”的按钮文案',
          '备注：“打开地图查看位置”的功能只能在v1.1.0或更高的版本使用'
        ]
      },
      {
        version: 'v1.2.7 @2019.05.14',
        points: [
          '[fix] 修复考勤列表排序不正确的问题',
          '[fix] 修复签到页列表名字可上下滚动的问题',
          '[improve] 优化签到交互，通过点击分享的小程序跳转到签到详情页'
        ]
      },
      {
        version: 'v1.2.4 @2019.05.13',
        points: [
          '[improve] 签到页中签到者按照“学号/工号 姓名”显示',
          '[improve] 签到页签到者列表按照学号的 ASCII 升序排序',
          '[improve] 个人信息页面不使用本地缓存'
        ]
      },
      {
        version: 'v1.2.1 @2019.05.04',
        points: [
          '[feat] 新增小程序分享转发邀请签到的功能',
          '[improve] 优化口令展示页，用更加友好的方式引导签到',
        ]
      },
      {
        version: 'v1.1.11 @2019.05.03',
        points: [
          '[improve] 优化签到页关于考勤者角色的交互',
        ]
      },
      {
        version: 'v1.1.10 @2019.05.02',
        points: [
          '[feat] 新增口令拷贝功能',
          '[fix] 修复输入不存在口令也能跳转到签到页的问题',
          '[fix] 修复距离显示单位错误的问题',
          '[improve] 优化距离显示',
          '[improve] 结束考勤时需要弹窗询问，规避误操作',
          '[improve] 优化结束考勤后按钮的文案'
        ]
      },
      {
        version: 'v1.0.5 @2019.04.28',
        points: [
          '[fix] 修复姓名是奇怪字符，头像显示为空问题',
          '[fix] 修复“我的”页面学号显示不全的问题',
          '[fix] 修复考勤时间时区不正确的问题',
          '[fix] 修复考勤发起前没有验证个人信息和位置是否获取的问题',
          '[improve] 优化“完善个人信息提示”的交互，将轻提示换成模态框'
        ]
      },
      {
        version: 'v1.0.0 @2019.04.27',
        points: [
          '考勤 Attnd 小程序上线！'
        ]
      }
    ]
  }

  render() {
    const { logs } = this.state;
    return (
      <View className="update-log">
        {logs.map(log => (
          <View className="update-log__item" key={log.version}>
            <View className="update-log__item--version">{log.version}</View>
            {log.points.map(point => (
              <View className="update-log__item--point" key={point}>{point}</View>
            ))}
          </View>
        ))}
      </View>
    );
  }
}
