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
    attndBelonging: PropTypes.bool,
    onLoadMore: PropTypes.func,
    onRefreshClick: PropTypes.func,
    onShowLocClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onUpdateStatus: PropTypes.func
  }

  static defaultProps = {
    height: 0,
    data: {
      listData: [],
      hasMore: true
    },
    attndBelonging: false,
    onLoadMore: () => { },
    onRefreshClick: () => { },
    onShowLocClick: () => { },
    onDeleteClick: () => { },
    onUpdateStatus: () => { }
  }

  onLoadMore = () => {
    console.log('loadmore');
  }

  render() {
    const { data, height, attndBelonging } = this.props;
    const count = data.listData.length > 999 ? '999+' : data.listData.length;
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
              <View className="signin-list__content--count">当前人数: {count}</View>
              <View className="signin-list__content--opt">
                {attndBelonging && <View className="signin-list__content--link" onClick={this.props.onDeleteClick}>删除考勤</View>}
                <View className="signin-list__content--link" onClick={this.props.onShowLocClick}>查看位置</View>
                <View className="signin-list__content--link" onClick={this.props.onRefreshClick}>刷新</View>
              </View>
            </View>
            {data.listData.length === 0 ?
              <View className="signin-list__hint">暂时还没有人签到，可点击页面右上角菜单转发到群聊邀请签到...</View>
              : data.listData.map(item => (
                <View className="signin-list__content--item" key={item}>
                  <SigninInfo
                    item={item}
                    attndBelonging={attndBelonging}
                    onUpdateStatus={this.props.onUpdateStatus}
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
