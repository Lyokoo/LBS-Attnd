import { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Tag from '../Tag';
import './index.less';

export default class AttndInfo extends Component {

  static defaultProps = {
    data: {
      title: 'loading...',
      desc1: 'loading...',
      desc2: 'loading...',
      desc3: 'loading...',
      tag: {
        active: false,
        text: '已结束'
      },
    },
    onClick: () => { }
  }

  render() {
    const { title, desc1, desc2, desc3, tag } = this.props.data;
    return (
      <View className="attnd-info" onClick={this.props.onClick}>
        <View className="attnd-info__status">
          <Tag title={tag.text} active={tag.active} />
        </View>
        <View className="attnd-info__title">
          <Text className="attnd-info__title--text" selectable>{title}</Text>
        </View>
        <View className="attnd-info__desc">
          <Text className="attnd-info__desc--text" selectable>{desc1}</Text>
          <Text className="attnd-info__desc--text" selectable>{desc2}</Text>
          <Text className="attnd-info__desc--text" selectable>{desc3}</Text>
        </View>
      </View>
    );
  }
}
