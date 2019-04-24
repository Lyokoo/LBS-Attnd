import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import './index.less';

export default class FindAttnd extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    passWd: ''
  }

  onInputChange = (value) => {
    this.setState({ passWd: value });
  }

  onConfirm = () => {
    Taro.redirectTo({
      url: `/pages/SignIn/index?passWd=${this.state.passWd}`
    });
  }

  render () {
    return (
      <View className="find-attnd">
        <View className="find-attnd__title">输入签到口令</View>
        <View className="find-attnd__desc">*向发起考勤者索要签到口令</View>
        <View className="find-attnd__input">
          <AtInput
            type='text'
            placeholder='输入口令'
            placeholderStyle="color: #cccccc"
            maxLength={150}
            value={this.state.passWd}
            onChange={this.onInputChange}
          />
        </View>
        <View className="find-attnd__btn">
          <AtButton type="primary" onClick={this.onConfirm}>确定</AtButton>
        </View>
      </View>
    )
  }
}
