import { Component } from '@tarojs/taro';
import { View, Image, Button } from '@tarojs/components';
import location from '../../assets/images/location.png';
import './index.less';

export default class EditAuth extends Component {

  config = {
    navigationBarTitleText: ''
  }

  render() {
    return (
      <View className="edit-auth">
        <View className="edit-auth__img">
          <Image src={location} mode="aspectFit" style={{ width: '100%' }} />
        </View>
        <View className="edit-auth__msg">获取地理位置</View>
        <View className="edit-auth__wrapper">
          <View className="edit-auth__desc">1. 确保移动数据已打开（可以上网）</View>
          <View className="edit-auth__desc">2. 检查手机系统设置中的定位服务（GPS）是否开启</View>
          <View className="edit-auth__desc">3. 检查是否已授权同意小程序获取你的地理位置 <Button className="edit-auth__link" openType="openSetting">点击查看</Button></View>
        </View>
      </View>
    )
  }
}
