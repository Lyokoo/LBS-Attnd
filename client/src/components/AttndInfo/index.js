import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Tag from '../Tag';
import './index.less';

export default class AttndInfo extends Component {

  static defaultProps = {
    item: {}
  }

  render() {
    return (
      <View className="attnd-info">
          <View className="attnd-info__status">
            <Tag title="进行中" active={true}/>
          </View>
        <View className="attnd-info__title">
          <Text className="attnd-info__title--text">计算机网络</Text>
        </View>
        <View className="attnd-info__desc">
          <Text className="attnd-info__desc--text">时间：2019-04-02</Text>
          <Text className="attnd-info__desc--text">发布者：Lyokoo</Text>
          <Text className="attnd-info__desc--text">口令：Lyokoo</Text>
        </View>
      </View>
    )
  }
}
