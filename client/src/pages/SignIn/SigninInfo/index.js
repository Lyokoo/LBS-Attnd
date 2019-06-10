import PropTypes from 'prop-types';
import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon, AtActionSheet, AtActionSheetItem } from 'taro-ui';
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
  }
}

export default class SigninInfo extends Component {

  static propTypes = {
    item: PropTypes.object,
    attndBelonging: PropTypes.bool,
    onUpdateStatus: PropTypes.func
  }

  static defaultProps = {
    item: {},
    attndBelonging: false,
    onUpdateStatus: () => { }
  }

  state = {
    isOpened: false
  }

  componentDidMount() { }

  geiDistance = (d = 0) => {
    // switch (true) {
    //   case d < 0: return '*';
    //   case d >= Number.MAX_SAFE_INTEGER: return '**';
    //   case d < 1: return '< 1m';
    //   case d <= 200: return `${Math.floor(d)}m`;
    //   case d > 200 && d < 1000: return '> 200m';
    //   case d > 1000: default: return '> 1km';
    // }
    switch (true) {
      case d < 0: return '*';
      case d >= Number.MAX_SAFE_INTEGER: return '**';
      case d <= 1000: return '<200m';
      case d > 1000: default: return '>200m';
    }
  }

  onStatusClick = () => this.setState({ isOpened: true });

  onActionClick = (...args) => {
    this.setState({ isOpened: false });
    const { signinerOpenId } = this.props.item;
    this.props.onUpdateStatus(signinerOpenId, ...args);
  }

  render() {
    const { isOpened } = this.state;
    const { attndBelonging } = this.props;
    const { signinerName = '?', signinerStuId = '', distance, signinerStatus } = this.props.item;
    const status = signinStatusConfig[signinerStatus] || {};
    return (
      <View className="signin-info">
        <View className="signin-info__user">
          <Text className="signin-info__avatar">{signinerName[0]}</Text>
          <View className="signin-info__info">
            <View className="signin-info__info--name">{`${signinerStuId + ' '}${signinerName}`}</View>
            <View className="signin-info__info--desc">距离：{this.geiDistance(distance)}</View>
          </View>
        </View>
        <View className="signin-info__status" onClick={this.onStatusClick}>
          <AtIcon value={status.icon} size={16} color={status.color} />
          <Text className="signin-info__status--desc" style={{ color: status.color }}>{status.text}</Text>
          {attndBelonging && <View className="signin-info__status--action"></View>}
        </View>
        <AtActionSheet isOpened={isOpened} cancelText='取消' title={`修改“${signinerName}”的签到状态`}>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.ARRIVED)}>已到</AtActionSheetItem>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.LATE)}>迟到</AtActionSheetItem>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.OUT_OF_DIST)}>超出距离</AtActionSheetItem>        
        </AtActionSheet>
      </View>
    )
  }
}
