import { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import LoadMore from '../LoadMore';
import AttndInfo from '../AttndInfo';
import './index.less';

export default class AttndList extends Component {

  static defaultProps = {
    height: 0,
    data: [],
    hasMore: true,
    onLoadMore: () => { },
    onItemClick: () => { }
  }

  onLoadMore = () => {
    if (!this.props.hasMore) return;
    this.props.onLoadMore();
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
            {data.map((item, index) => {
              return (
                <View className="attnd-list__item" key={item.key}>
                  <AttndInfo data={item} onClick={() => this.props.onItemClick(index)} />
                </View>
              );
            })}
          </View>
          <LoadMore hasMore={hasMore} />
        </ScrollView>
      </View>
    )
  }
}
