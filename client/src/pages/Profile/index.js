import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import ProfileItem from './ProfileItem';
import './index.less';

/**
 * 个人信息、授权管理、邮箱导出、问题反馈、推荐给朋友、关于我们
 */

export default class Profile extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {

  }

  onUserInfoClick = () => {
    Taro.navigateTo({
      url: '../EditUserInfo/index'
    })
  }

  render () {
    return (
      <View className="profile">
        <View className="profile__group">
          <View className="profile__header" onClick={this.onUserInfoClick}>
            <Text className="profile__avatar">W</Text>
            <View className="profile__info">
              <Text className="profile__info--name">无情臭猪</Text>
              <Text className="profile__info--stuid">1506100006</Text>
            </View>
          </View>
        </View>
        <View className="profile__group">
          <ProfileItem title="授权管理" openType="openSetting"/>
        </View>
        <View className="profile__group">
          <ProfileItem title="问题反馈" openType="feedback"/>
          <ProfileItem title="关于我们"/>
        </View>
      </View>
    )
  }
}
