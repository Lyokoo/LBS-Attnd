import { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.less';

export default class ProfileItem extends Component {

  static propTypes = {
    openType: PropTypes.string,
    title: PropTypes.string
  }

  static defaultProps = {
    title: '项',
    openType: '',
    onClick: () => { }
  }

  render() {
    const { title, openType, onClick } = this.props;
    return (
      <View className="profile-item">
        <Button
          className="profile-item__btn"
          openType={openType}
          onClick={onClick}
        >
          {title}
        </Button>
      </View>
    )
  }
}
