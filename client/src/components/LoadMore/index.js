import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import PropTypes from 'prop-types';
import './index.less';

export default class LoadMore extends Component {

  static propTypes = {
    hasMore: PropTypes.bool,
    loadingText: PropTypes.string,
    noMoreText: PropTypes.string
  }

  static defaultProps = {
    hasMore: true,
    loadingText: '加载中',
    noMoreText: '没有更多'
  }

  render() {
    const { hasMore, loadingText, noMoreText } = this.props;
    return (
      <View className="loadmore">
        {hasMore
          ? <AtActivityIndicator size={24} content={loadingText} />
          : noMoreText
        }
      </View>
    );
  }
}