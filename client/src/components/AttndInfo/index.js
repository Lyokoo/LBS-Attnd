import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Tag from '../Tag';
import './index.less';

export default class AttndInfo extends Component {

  static defaultProps = {
    item: {}
  }

  render() {
    const {
      attndName, createTime, hostName, passWd, attndStatus
    } = this.props.item;
    return (
      <View className="attnd-info">
          <View className="attnd-info__status">
            <Tag
              title={attndStatus === 1 ? '进行中' : '已结束'}
              active={attndStatus === 1}
            />
          </View>
        <View className="attnd-info__title">
          <Text className="attnd-info__title--text">{attndName}</Text>
        </View>
        <View className="attnd-info__desc">
          <Text className="attnd-info__desc--text">口令：{passWd}</Text>
          <Text className="attnd-info__desc--text">发布者：{hostName}</Text>
          <Text className="attnd-info__desc--text">时间：{createTime}</Text>
        </View>
      </View>
    )
  }
}
