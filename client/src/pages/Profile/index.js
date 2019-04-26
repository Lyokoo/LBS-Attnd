import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import ProfileItem from './ProfileItem';
import { getUserInfo } from '../../services/userInfo';
import './index.less';

/**
 * 个人信息、授权管理、邮箱导出、问题反馈、推荐给朋友、关于我们
 */

export default class Profile extends Component {

  config = {
    navigationBarTitleText: '',
    backgroundColor: '#f2f2f2'
  }

  state = {
    name: '',
    stuId: '',
    pulling: false
  }

  componentDidShow() {
    this.getUserInfo();
  }

  getUserInfo = async () => {
    const { pulling } = this.state;
    if (pulling) return;
    this.setState({ pulling: true });
    try {
      const result = await getUserInfo();
      if (result.code === 2000) {
        const { name, stuId } = result.data;
        this.setState({ name, stuId });
      }
    } catch (e) {}
    this.setState({ pulling: false });
  }

  onUserInfoClick = () => Taro.navigateTo({ url: '/pages/EditUserInfo/index' });

  onAboutClick = () => Taro.navigateTo({ url: '/pages/About/index' });

  render () {
    const { name, stuId } = this.state;
    return (
      <View className="profile">
        <View className="profile__group">
          <View className="profile__header" onClick={this.onUserInfoClick}>
            <Text className="profile__avatar">{name[0]}</Text>
            <View className="profile__info">
              <Text className="profile__info--name">{name || '完善个人信息'}</Text>
              <Text className="profile__info--stuid">{stuId}</Text>
            </View>
          </View>
        </View>
        <View className="profile__group">
          <ProfileItem title="授权管理" openType="openSetting"/>
        </View>
        <View className="profile__group">
          <ProfileItem title="问题反馈" openType="feedback"/>
          <ProfileItem title="关于我们" onClick={this.onAboutClick}/>
        </View>
      </View>
    )
  }
}
