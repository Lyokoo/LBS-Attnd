import { Component } from '@tarojs/taro';
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

  render () {
    return (
      <View className="find-attnd">
        <View className="find-attnd__title">输入口令</View>
        <View className="find-attnd__desc">*向发起考勤者索要口令</View>
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
          <AtButton type="primary">确定</AtButton>
        </View>
      </View>
    )
  }
}
