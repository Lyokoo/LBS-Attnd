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
        version: '当前版本 v1.1.1',
        points: [
          '[todo] 部分机型定位偏差较大'
        ]
      },
      {
        version: 'v1.1.1 @2019.06.01',
        points: [
          '[feat] 新增赞赏功能 么么哒😘'
        ]
      },
      {
        version: 'v1.1.0 @2019.05.31',
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
        version: 'v1.0.6 @2019.05.14',
        points: [
          '[fix] 修复考勤列表排序不正确的问题',
          '[fix] 修复签到页列表名字可上下滚动的问题',
          '[improve] 优化签到交互，通过点击分享的小程序跳转到签到详情页'
        ]
      },
      {
        version: 'v1.0.5 @2019.05.13',
        points: [
          '[improve] 签到页中签到者按照“学号/工号 姓名”显示',
          '[improve] 签到页签到者列表按照学号的 ASCII 升序排序',
          '[improve] 个人信息页面不使用本地缓存'
        ]
      },
      {
        version: 'v1.0.4 @2019.05.04',
        points: [
          '[feat] 新增小程序分享转发邀请签到的功能',
          '[improve] 优化口令展示页，用更加友好的方式引导签到',
        ]
      },
      {
        version: 'v1.0.3 @2019.05.03',
        points: [
          '[improve] 优化签到页关于考勤者角色的交互',
        ]
      },
      {
        version: 'v1.0.2 @2019.05.02',
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
        version: 'v1.0.1 @2019.04.28',
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
