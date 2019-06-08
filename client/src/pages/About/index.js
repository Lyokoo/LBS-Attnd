import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import AdToast from '../../components/AdToast';
import avatarLzy from '../../assets/images/avatar-lzy.jpg';
import avatarLyx from '../../assets/images/avatar-lyx.jpeg';
import avatarLzp from '../../assets/images/avatar-lzp.jpg';
import avatarWy from '../../assets/images/avatar-wy.jpg';
import './index.less';

export default class About extends Component {

  config = {
    navigationBarTitleText: '关于我们'
  }

  state = {
    t1: '考勤 Attnd',
    aps1: [
      '考勤 Attnd 是基于 LBS 开发的考勤和签到小程序，旨在提高课堂考勤的效率'
    ],
    t3: '开发 Development',
    aps3: [
      '考勤 Attnd 尝鲜微信小程序云开发，使用 Taro + Taro UI 快速迭代。本项目只用于技术学习和交流，欢迎提 issue'
    ],
    t4: '贡献者 Contributors',
    github: 'https://github.com/Lyokoo/LBS-Attnd',
    contributors: [
      { avatar: avatarLzy, name: '鲤资姨' },
      { avatar: avatarLyx, name: 'FOON' },
      { avatar: avatarLzp, name: '纸纸纸盆' },
      { avatar: avatarWy, name: '脑浮泥' }
    ],
    t5: '联系 Contact',
    aps5: [
      'zhipen1874'
    ]
  }

  onCopy = (str) => {
    if (!str) return;
    wx.setClipboardData({
      data: str,
      success: () => Taro.adToast({ text: '拷贝成功', status: 'success' })
    });
  }

  checkUpdateLog = () => wx.navigateTo({ url: '/pages/UpdateLog/index' });

  render() {
    const { t1, t2, t3, t4, t5, aps1, aps2, aps3, github, aps5 } = this.state;
    return (
      <View className="about">
        {/* 考勤 Attnd */}
        <View className="about__title">{t1}</View>
        <View>
          {aps1.map(p => <View key={p} className="about__paragraph">{p}</View>)}
        </View>
        {/* 开发 Development */}
        <View className="about__title">{t3}</View>
        <View>
          {aps3.map(p => <View key={p} className="about__paragraph">{p}</View>)}
          <View className="about__paragraph">仓库地址: <Text onClick={() => this.onCopy(github)} className="about__link">{github}</Text></View>
          <View className="about__paragraph"><Text onClick={() => this.checkUpdateLog()} className="about__link">查看更新日志</Text></View>
        </View>
        {/*联系 Contact*/}
        <View className="about__title">{t5}</View>
        <View>
          {aps5.map(p => <View key={p} className="about__paragraph">微信：<Text onClick={() => this.onCopy(p)} className="about__link">{p}</Text></View>)}
        </View>
        {/* 贡献者 Contributors */}
        <View className="about__title">{t4}</View>
        <View className="about__flexbox">
          {contributors.map(ctr => (
            <View key={ctr.name} className="about__contributors">
              <Image
                className="about__contributors--avatar"
                lazyLoad mode="aspectFill"
                src={ctr.avatar}
              />
              <View className="about__contributors--name">{ctr.name}</View>
            </View>
          ))}
        </View>
        <AdToast />
      </View>
    )
  }
}
