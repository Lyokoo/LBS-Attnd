import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import ProfileItem from './ProfileItem';
import { getUserInfo } from '../../services/userInfo';
import imgLocation from '../../assets/images/location.png';
import { AppIds } from '../../utils/consts';
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

  onShareAppMessage() {
    return {
      title: '快来参加考勤吧！',
      path: '/pages/Home/index',
      imageUrl: imgLocation
    }
  }

  getUserInfo = async () => {
    const { pulling } = this.state;
    if (pulling) return;
    this.setState({ pulling: true });
    try {
      const result = await getUserInfo(true);
      if (result.code === 2000) {
        const { name, stuId } = result.data;
        this.setState({ name, stuId });
      }
    } catch (e) { }
    this.setState({ pulling: false });
  }

  onUserInfoClick = () => wx.navigateTo({ url: '/pages/EditUserInfo/index' });

  onAboutClick = () => wx.navigateTo({ url: '/pages/About/index' });

  onUpdateLogClick = () => wx.navigateTo({ url: '/pages/UpdateLog/index' });

  onRewardClick = () => {
    wx.navigateToMiniProgram({
      appId: AppIds.GeiZan,
      path: 'pages/apps/largess/detail?id=AZtypSUMi4s%3D'
    });
  }

  render() {
    const { name, stuId = '', pulling } = this.state;
    const getAvatar = () => (name && name[0]) ? name[0] : '';
    const getName = () => pulling ? '获取中...' : name || '完善个人信息';
    const getStuId = () => pulling ? '获取中...' : stuId;
    return (
      <View className="profile">
        <View className="profile__group">
          <View className="profile__header" onClick={this.onUserInfoClick}>
            <Text className="profile__avatar">{getAvatar()}</Text>
            <View className="profile__info">
              <Text className="profile__info--name">{getName()}</Text>
              <Text className="profile__info--stuid">{getStuId()}</Text>
            </View>
          </View>
        </View>
        <View className="profile__group">
          <ProfileItem title="授权管理" openType="openSetting" />
        </View>
        <View className="profile__group">
          <ProfileItem title="问题反馈" openType="feedback" />  
          <ProfileItem title="关于我们" onClick={this.onAboutClick} />
        </View>
        <View className="profile__group">
          <ProfileItem title="赞赏一下" onClick={this.onRewardClick} />
          <ProfileItem title="推荐给朋友" openType="share" />
        </View>
        <View className="profile__group">
          <ProfileItem title="更新日志" onClick={this.onUpdateLogClick} />
        </View>
      </View>
    )
  }
}
