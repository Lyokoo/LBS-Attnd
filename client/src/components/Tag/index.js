import { Component } from '@tarojs/taro';
import { Text } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';

export default class Tag extends Component {

  static propTypes = {
    title: PropTypes.string,
    active: PropTypes.bool
  }

  static defaultProps = {
    title: 'tag',
    active: true
  }

  render() {
    const { title, active } = this.props;
    return (
      <View className="tag">
        {active
          ? <Text className="tag__active">{title}</Text>
          : <Text className="tag__disabled">{title}</Text>
        }
      </View>
    );
  }
}