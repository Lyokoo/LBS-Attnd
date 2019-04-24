import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import LoadMore from '../../../components/LoadMore';
import AttndInfo from '../../../components/AttndInfo';
import PropTypes from 'prop-types';
import './index.less';

export default class AttndList extends Component {

  static propTypes = {
    height: PropTypes.number,
    data: PropTypes.array,
    hasMore: PropTypes.bool,
    onLoadMore: PropTypes.func
  }

  static defaultProps = {
    height: 0,
    data: [],
    hasMore: true,
    onLoadMore: () => { }
  }

  onLoadMore = () => {
    if (!this.props.hasMore) return;
    this.props.onLoadMore();
    console.log('loadmore');
  }

  onAttndClick = (passWd) => {
    if (passWd) {
      Taro.navigateTo({ url: `/pages/SignIn/index?passWd=${passWd}` });
    }
  }

  render() {
    const { data, height, hasMore } = this.props;
    return (
      <View className="attnd-list">
        <ScrollView
          style={{ height: `${height}px` }}
          scrollY
          lowerThreshold={50}
          enableBackToTop
          onScrollToLower={this.onLoadMore}
        >
          <View className="attnd-list__content">
            {data.map(item => (
              <View className="attnd-list__item" key={item._id}>
                <AttndInfo item={item} onClick={() => this.onAttndClick(item.passWd)}/>
              </View>
            ))}
          </View>
          <LoadMore hasMore={hasMore}/>
        </ScrollView>
      </View>
    )
  }
}
