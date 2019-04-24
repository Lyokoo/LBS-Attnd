import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Tag from '../Tag';
import { formatDate } from '../../utils/func';
import './index.less';

export default class AttndInfo extends Component {

  static defaultProps = {
    item: {},
    onClick: () => { }
  }

  componentDidMount() { }

  render() {
    const {
      attndName, createTime, hostName, passWd, attndStatus
    } = this.props.item;
    return (
      <View className="attnd-info" onClick={this.props.onClick}>
        <View className="attnd-info__status">
          <Tag
            title={attndStatus === 1 ? '进行中' : '已结束'}
            active={attndStatus === 1}
          />
        </View>
        <View className="attnd-info__title">
          <Text className="attnd-info__title--text">{attndName || 'loading...'}</Text>
        </View>
        <View className="attnd-info__desc">
          <Text className="attnd-info__desc--text">口令：{passWd || 'loading...'}</Text>
          <Text className="attnd-info__desc--text">发布者：{hostName || 'loading...'}</Text>
          <Text className="attnd-info__desc--text">时间：{formatDate(createTime) || 'loading...'}</Text>
        </View>
      </View>
    )
  }
}
