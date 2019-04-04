import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtInput, AtButton } from 'taro-ui';
import './index.less';

export default class EditUserInfo extends Component {

  config = {
    navigationBarTitleText: '个人信息'
  }

  state = {
    userName: '',
    stuId: ''
  }

  onUserNameChange = (value) => {
    this.setState({ userName: value });
  }

  onStuIdChange = (value) => {
    this.setState({ stuId: value });
  }

  render() {
    return (
      <View className="edit-userinfo">
        <View className="edit-userinfo__form">
          <AtForm>
            <AtInput
              title='姓名'
              type='text'
              placeholder="填写真实姓名"
              placeholderStyle="color: #cccccc"
              maxLength={150}
              value={this.state.userName}
              onChange={this.onUserNameChange}
            />
            <AtInput
              title='学号/工号'
              type='text'
              placeholder="填写学号或工号"
              placeholderStyle="color: #cccccc"
              maxLength={150}
              border={false}
              value={this.state.stuId}
              onChange={this.onStuIdChange}
            />
          </AtForm>
        </View>
        <View className="edit-userinfo__btn">
          <AtButton type="primary" loading={false}>保存</AtButton>
        </View>
      </View>
    )
  }
}
