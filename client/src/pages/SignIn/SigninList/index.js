import { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import LoadMore from '../../../components/LoadMore';
import SigninInfo from '../SigninInfo';
import PropTypes from 'prop-types';
import './index.less';

export default class AttndList extends Component {

  static propTypes = {
    height: PropTypes.number,
    data: PropTypes.object,
    onLoadMore: PropTypes.func,
    onRefreshClick: PropTypes.func
  }

  static defaultProps = {
    height: 0,
    data: {
      listData: [],
      hasMore: true
    },
    onLoadMore: () => { },
    onRefreshClick: () => { }
  }

  onLoadMore = () => {
    console.log('loadmore');
  }

  render() {
    const { data, height } = this.props;
    return (
      <View className="signin-list">
        <ScrollView
          style={{ height: `${height}px` }}
          scrollY
          lowerThreshold={50}
          enableBackToTop
          onScrollToLower={this.onLoadMore}
        >
          <View className="signin-list__content">
            <View className="signin-list__content--bar">
              <View className="signin-list__content--count">当前人数：{data.listData.length}</View>
              <View className="signin-list__content--refresh" onClick={this.props.onRefreshClick}>刷新</View>
            </View>
            {data.listData.map(item => (
              <View className="signin-list__content--item" key={item}>
                <SigninInfo item={item} />
              </View>
            ))}
          </View>
          {/* <LoadMore hasMore={data.hasMore}/> */}
        </ScrollView>
      </View>
    )
  }
}
