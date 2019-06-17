import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import { SigninerStatus } from '../../../utils/consts';
import './index.less';

const signinStatusConfig = {
  [SigninerStatus.ARRIVED]: {
    icon: 'check-circle',
    color: '#78a4fa',
    text: '已到'
  },
  [SigninerStatus.LATE]: {
    icon: 'clock',
    color: '#ffc82c',
    text: '迟到'
  },
  [SigninerStatus.OUT_OF_DIST]: {
    icon: 'map-pin',
    color: '#ff4949',
    text: '超距'
  },
  [SigninerStatus.UN_SIGNIN]: {
    icon: 'user',
    color: '#888888',
    text: '未到'
  }
}

export default class SigninInfo extends Component {

  static defaultProps = {
    item: {},
    attndBelonging: false,
    onStatusClick: () => { }
  }

  onStatusClick = ({ signinerOpenId, signinerName }) => {
    const { attndBelonging } = this.props;
    if (!attndBelonging) {
      return;
    }
    this.props.onStatusClick({ signinerOpenId, signinerName });
  }

  render() {
    const { attndBelonging } = this.props;
    const { signinerName = '?', signinerStuId = '', signinerStatus = SigninerStatus.UN_SIGNIN, signinerOpenId } = this.props.item;
    const status = signinStatusConfig[signinerStatus] || {};
    return (
      <View className="signin-info">
        <View className="signin-info__user">
          <Text className="signin-info__avatar">{signinerName[0]}</Text>
          <View className="signin-info__info">
            <View className="signin-info__info--name">{signinerName}</View>
            <View className="signin-info__info--desc">ID: {signinerStuId || '(空)'}</View>
          </View>
        </View>
        <View className="signin-info__status" onClick={() => this.onStatusClick({ signinerOpenId, signinerName })}>
          <AtIcon value={status.icon} size={16} color={status.color} />
          <Text className="signin-info__status--desc" style={{ color: status.color }}>{status.text}</Text>
          {attndBelonging && <View className="signin-info__status--action"></View>}
        </View>
      </View>
    )
  }
}
