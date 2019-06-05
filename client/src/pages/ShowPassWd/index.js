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
    passWd: ''
  }

  componentWillMount() {
    const { passWd } = this.$router.params;
    this.setState({ passWd });
  }

  onClickGotoSignin = () => wx.redirectTo({ url: `/pages/SignIn/index?passWd=${this.state.passWd}` });

  onShareAppMessage() {
    const { passWd } = this.state;
    return {
      title: '快来参加考勤吧！',
      path: `/pages/SignIn/index?passWd=${passWd}`,
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
    return (
      <View className="show-passwd">
        <View className="show-passwd__card" onClick={this.onPassWdClick}>
          <Text className="show-passwd__card--desc">签到口令</Text>
          <Text className="show-passwd__card--passwd">{this.state.passWd}</Text>
          <Text className="show-passwd__card--copy">点击可拷贝口令 :)</Text>
        </View>
        <View className="show-passwd__desc">你可以线下展示口令或通过微信群聊邀请朋友签到</View>
        <View className="show-passwd__opt">
          <AtButton type="secondary" openType="share">邀请朋友签到</AtButton>
        </View>
        <View className="show-passwd__opt">
          <AtButton type="primary" onClick={this.onClickGotoSignin}>进入考勤详情</AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
