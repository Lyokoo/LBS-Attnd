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

  onClickGotoSignin = () => Taro.redirectTo({ url: `/pages/SignIn/index?passWd=${this.state.passWd}` });

  onShareAppMessage() {
    return {
      title: '快来参加考勤吧！',
      path: '/pages/Home/index',
      imageUrl: imgLocation
    }
  }

  onPassWdClick = () => {
    const { passWd } = this.state;
    if (!passWd) return;
    Taro.setClipboardData({
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
        <View className="show-passwd__desc">请向签到者展示签到口令</View>
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
