import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import AttndList from './AttndList';
import { getAttndListByHostOpenId } from '../../services/attnd';
import { getSigninListBySigninerOpenId } from '../../services/signin';
import * as adLog from '../../utils/adLog';
import { throttle } from '../../utils/func';
import './index.less';

export default class List extends Component {

  config = {
    navigationBarTitleText: ''
  }

  // 高度 state 写成数字方便计算
  state = {
    listHeight: 0,
    windowHeight: 0,
    tabIndex: 0,

    attndData: [],
    attndHasMore: true,
    attndOffsetId: null,
    attndLoading: false,

    signinData: [],
    signinHasMore: true,
    signinOffsetId: null,
    signinLoading: false
  }

  tabList = [
    { title: '我参与的' },
    { title: '我发起的' }
  ]

  componentDidMount() {
    this.computeHeight();
  }

  componentDidShow = throttle(async function () {
    Taro.showNavigationBarLoading();
    await Promise.all([
      this.getSigninList(),
      this.getAttndList()
    ]);
    Taro.hideNavigationBarLoading();
  }, 6000);

  computeHeight = () => {
    try {
      const { windowWidth, windowHeight } = wx.getSystemInfoSync();
      const rpx = windowWidth / 750;
      const headerHeight = 88 * rpx; // PX
      const listHeight = windowHeight - headerHeight;
      this.setState({
        windowHeight,
        listHeight
      });
    } catch (e) {
      console.log(e);
    }
  }

  onTabToggle = (value) => {
    this.setState({
      tabIndex: value
    })
  }

  getAttndList = async (offset = 0) => {
    const { attndOffsetId, attndLoading, attndData } = this.state;
    // 请求第 1 页时激活 loadMore 节点
    if (offset === 0) {
      this.setState({ attndHasMore: true });
    }
    if (attndLoading) return;
    this.setState({ attndLoading: true });

    try {
      const {
        data: { hasMore, offsetId, list }
      } = await getAttndListByHostOpenId({
        offset,
        offsetId: attndOffsetId
      });

      // offset === 0 时更新偏移基准 offsetId
      if (offset === 0 && offsetId) {
        this.setState({ attndOffsetId: offsetId });
      }

      this.setState({
        attndData: offset === 0 ? list : attndData.concat(list),
        attndHasMore: hasMore
      });

    } catch (e) {
      adLog.log('getAttndList-error', e);
    }
    this.setState({ attndLoading: false });
  }

  getSigninList = async (offset = 0) => {
    const { signinOffsetId, signinLoading, signinData } = this.state;
    // 请求第 1 页时激活 loadMore 节点
    if (offset === 0) {
      this.setState({ signinHasMore: true });
    }
    if (signinLoading) return;
    this.setState({ signinLoading: true });

    try {
      const {
        data: { hasMore, offsetId, list }
      } = await getSigninListBySigninerOpenId({
        offset,
        offsetId: signinOffsetId
      });

      // offset === 0 时更新偏移基准 offsetId
      if (offset === 0 && offsetId) {
        this.setState({ signinOffsetId: offsetId });
      }

      this.setState({
        signinData: offset === 0 ? list : signinData.concat(list),
        signinHasMore: hasMore
      });

    } catch (e) {
      adLog.log('getSigninList-error', e);
    }
    this.setState({ signinLoading: false });
  }

  onAttndLoadMore = async () => {
    const offset = this.state.attndData.length;
    this.getAttndList(offset);
  }

  onSigninLoadMore = async () => {
    const offset = this.state.signinData.length;
    this.getSigninList(offset);
  }

  render() {
    const {
      listHeight,
      windowHeight,
      tabIndex,
      attndData,
      attndHasMore,
      signinData,
      signinHasMore
    } = this.state;
    return (
      <View className="list">
        <AtTabs
          current={tabIndex}
          tabList={this.tabList}
          onClick={this.onTabToggle}
          swipeable
          height={`${windowHeight}px`}
        >
          <AtTabsPane current={tabIndex} index={0} >
            <AttndList
              height={listHeight}
              data={signinData}
              hasMore={signinHasMore}
              onLoadMore={this.onSigninLoadMore}
            />
          </AtTabsPane>
          <AtTabsPane current={tabIndex} index={1}>
            <AttndList
              height={listHeight}
              data={attndData}
              hasMore={attndHasMore}
              onLoadMore={this.onAttndLoadMore}
            />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
