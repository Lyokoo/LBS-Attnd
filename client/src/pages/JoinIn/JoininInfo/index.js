import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.less';

export default class JoininInfo extends Component {

  static defaultProps = {
    item: {},
    groupBelonging: false,
    onJoinerDelete: () => { }
  }

  onStatusClick = () => {
    const { groupBelonging } = this.props;
    const { signinerOpenId } = this.props.item;
    if (!groupBelonging) {
      return;
    }
    this.props.onJoinerDelete(signinerOpenId);
  }

  render() {
    const { groupBelonging } = this.props;
    const { signinerName = '?', signinerStuId = '' } = this.props.item;
    return (
      <View className="joinin-info">
        <View className="joinin-info__user">
          <Text className="joinin-info__avatar">{signinerName[0]}</Text>
          <View className="joinin-info__info">
            <View className="joinin-info__info--name">{signinerName}</View>
            <View className="joinin-info__info--desc">ID: {signinerStuId || '(空)'}</View>
          </View>
        </View>
        <View className="joinin-info__status" onClick={this.onStatusClick}>
          {groupBelonging && <Text className="joinin-info__status--desc">移除</Text>}
        </View>
      </View>
    )
  }
}
