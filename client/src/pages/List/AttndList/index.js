import { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import LoadMore from '../../../components/LoadMore';
import AttndInfo from '../../../components/AttndInfo';
import PropTypes from 'prop-types';
import './index.less';

export default class AttndList extends Component {

  static propTypes = {
    height: PropTypes.number,
    data: PropTypes.object,
    onLoadMore: PropTypes.func
  }

  static defaultProps = {
    height: 0,
    data: {
      listData: [],
      hasMore: true
    },
    onLoadMore: () => { }
  }

  onLoadMore = () => {
    console.log('loadmore');
  }

  render() {
    const { data, height } = this.props;
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
            {data.listData.map(item => (
              <View className="attnd-list__item" key={item}>
                <AttndInfo item={item}/>
              </View>
            ))}
          </View>
          <LoadMore hasMore={data.hasMore}/>
        </ScrollView>
      </View>
    )
  }
}
