import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import './index.less';

export default class EditAttnd extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    attndName: ''
  }

  onInputChange = (value) => {
    this.setState({ attndName: value });
  }

  render () {
    return (
      <View className="edit-attnd">
        <View className="edit-attnd__title">发起考勤</View>
        <View className="edit-attnd__desc">*考勤范围为 200 米</View>
        <View className="edit-attnd__input">
          <AtInput
            type='text'
            placeholder='输入考勤名称'
            placeholderStyle="color: #cccccc"
            maxLength={150}
            value={this.state.attndName}
            onChange={this.onInputChange}
          />
        </View>
        <View className="edit-attnd__btn">
          <AtButton type="primary">立即发起</AtButton>
        </View>
      </View>
    )
  }
}
