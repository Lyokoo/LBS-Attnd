import { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import JoininInfo from '../JoininInfo';
import { GroupStatus } from '../../../utils/consts';
import './index.less';

export default class JoininList extends Component {

  static defaultProps = {
    height: 0,
    data: {
      listData: [],
      hasMore: true
    },
    groupBelonging: false,
    groupStatus: 0,
    onLoadMore: () => { },
    onGroupDelete: () => { },
    onGroupReopen: () => { },
    onGroupRefresh: () => { },
    onJoinerDelete: () => { }
  }

  onLoadMore = () => {
    console.log('loadmore');
  }

  render() {
    const { data, height, groupBelonging, groupStatus } = this.props;
    const count = data.listData.length > 999 ? '999+' : data.listData.length;
    return (
      <View className="joinin-list">
        <ScrollView
          style={{ height: `${height}px` }}
          scrollY
          lowerThreshold={50}
          enableBackToTop
          onScrollToLower={this.onLoadMore}
        >
          <View className="joinin-list__content">
            <View className="joinin-list__content--bar">
              <View className="joinin-list__content--count">人数: {count}</View>
              <View className="joinin-list__content--opt">
                {groupBelonging && <View className="joinin-list__content--link" onClick={this.props.onGroupDelete}>删除小组</View>}
                {groupStatus===GroupStatus.OFF && groupBelonging &&
                  <View 
                    className="joinin-list__content--link"
                    onClick={this.props.onGroupReopen}
                  >打开邀请
                  </View>
                }
                <View className="joinin-list__content--link" onClick={this.props.onGroupRefresh}>刷新</View>
              </View>
            </View>
            {data.listData.length === 0 ?
              <View className="joinin-list__hint">暂时还没有人加入，可点击页面右上角菜单转发到群聊邀请朋友加入...</View>
              : data.listData.map(item => (
                <View className="joinin-list__content--item" key={item}>
                  <JoininInfo
                    item={item}
                    groupBelonging={groupBelonging}
                    onJoinerDelete={this.props.onJoinerDelete}
                  />
                </View>
              ))}
          </View>
          {/* <LoadMore hasMore={data.hasMore}/> */}
        </ScrollView>
      </View>
    )
  }
}
