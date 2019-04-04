import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { SigninStatus } from '../../../utils/consts';
import './index.less';

const IconConfig = {
  [SigninStatus.ARRIVED]: {
    value: 'check-circle',
    color: '#78a4fa',
    text: '已到'
  },
  [SigninStatus.LATE]: {
    value: 'clock',
    text: '迟到'
  },
  [SigninStatus.OUT_OF_DIST]: {
    value: 'map-pin',
    text: '超距'
  }
}

export default class SigninInfo extends Component {

  static defaultProps = {
    item: {}
  }

  render() {
    return (
      <View className="signin-info">
        <View className="signin-info__user">
          <Text className="signin-info__avatar">臭</Text>
          <View className="signin-info__info">
            <Text className="signin-info__info--name">臭猪asdfasd上了肯德基弗雷斯科就到了疯狂世界</Text>
            <Text className="signin-info__info--desc">距离：200m阿里斯顿肌肤垃圾数量的减肥路上看见的</Text>
          </View>
        </View>
        <View className="signin-info__status">
          <AtIcon value="check-circle" size={16} color="#78a4fa"/>
          <Text className="signin-info__status--desc" style={{color: '#78a4fa'}}>已到</Text>
        </View>
      </View>
    )
  }
}
