import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import AdToast from '../../components/AdToast';
import imgLocation from '../../assets/images/location.png';
import './index.less';

export default class ShowPassWd extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    passWd: '',
    type: 'attnd'
  }

  componentWillMount() {
    // type: attnd | group
    const { passWd, type = 'attnd' } = this.$router.params;
    this.setState({
      passWd: decodeURIComponent(passWd),
      type
    });
  }

  onGotoDetial = () => {
    const { passWd } = this.state;
    if (this.state.type === 'attnd') {
      wx.redirectTo({ url: `/pages/SignIn/index?passWd=${encodeURIComponent(passWd)}` });
    } else {
      wx.redirectTo({ url: `/pages/JoinIn/index?passWd=${encodeURIComponent(passWd)}` });
    }
  }

  onShareAppMessage() {
    const { passWd, type } = this.state;
    if (type === 'attnd') {
      return {
        title: '快来参加考勤吧！',
        path: `/pages/SignIn/index?passWd=${encodeURIComponent(passWd)}`,
        imageUrl: imgLocation
      }
    }
    return {
      title: '邀请你加入小组',
      path: `/pages/JoinIn/index?passWd=${encodeURIComponent(passWd)}`,
      imageUrl: imgLocation
    }
  }

  onPassWdClick = () => {
    const { passWd } = this.state;
    if (!passWd) return;
    wx.setClipboardData({
      data: passWd,
      success: () => Taro.adToast({ text: '拷贝成功', status: 'success' })
    });
  }

  render() {
    const { passWd, type } = this.state;
    const title = type === 'attnd' ? '签到口令' : '小组加入口令';
    const desc = `你可以线下展示口令或通过微信群聊邀请朋友${type === 'attnd' ? '签到' : '加入小组'}`;
    const opt = `邀请朋友${type === 'attnd' ? '签到' : '加入'}`;
    return (
      <View className="show-passwd">
        <View className="show-passwd__card" onClick={this.onPassWdClick}>
          <Text className="show-passwd__card--desc">{title}</Text>
          <Text className="show-passwd__card--passwd">{passWd}</Text>
          <Text className="show-passwd__card--copy">点击可拷贝口令 :)</Text>
        </View>
        <View className="show-passwd__desc">{desc}</View>
        <View className="show-passwd__opt">
          <AtButton type="secondary" openType="share">{opt}</AtButton>
        </View>
        <View className="show-passwd__opt">
          <AtButton type="primary" onClick={this.onGotoDetial}>进入详情</AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
