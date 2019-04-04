import { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import location from '../../assets/images/location.png';
import './index.less';

export default class EditAuth extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    value: ''
  }

  render() {
    return (
      <View className="edit-auth">
        <View className="edit-auth__img">
          <Image src={location} mode="aspectFit" style={{width: '100%'}}/>
        </View>
        <View className="edit-auth__desc">需要授权开启位置服务才能参加考勤的哦</View>
        <View className="edit-auth__opt">
          <AtButton type="primary">开启定位</AtButton>
        </View>
      </View>
    )
  }
}
