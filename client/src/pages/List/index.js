import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import AttndList from '../../components/AttndList';
import { getAttndListByHostOpenId } from '../../services/attnd';
import { getSigninListBySigninerOpenId } from '../../services/signin';
import * as adLog from '../../utils/adLog';
import { throttle, formatDate } from '../../utils/func';
import './index.less';

export default class List extends Component {

  config = {
    navigationBarTitleText: '记录'
  }

  constructor() {
    try {
      var { windowWidth, windowHeight } = wx.getSystemInfoSync();
      var rpx = windowWidth / 750;
      var headerHeight = 88 * rpx; // PX
      var listHeight = windowHeight - headerHeight;
    } catch (e) {
      console.log(e);
    }
    this.state = {
      listHeight: listHeight || 0,
      windowHeight: windowHeight || 0,
      tabIndex: 0,

      attndData: [],
      attndHasMore: true,
      attndOffsetId: null,

      signinData: [],
      signinHasMore: true,
      signinOffsetId: null,
    };
  }

  attndLoading = false;
  signinLoading = false;

  tabList = [
    { title: '我参与的' },
    { title: '我发起的' }
  ]

  componentDidShow = throttle(function () {
    this.getSigninList();
    this.getAttndList();
  }, 6000);

  onTabToggle = (value) => {
    this.setState({
      tabIndex: value
    })
  }

  getAttndList = async (offset = 0) => {
    const { attndOffsetId, attndData } = this.state;
    // 请求第 1 页时激活 loadMore 节点
    if (offset === 0) {
      this.setState({ attndHasMore: true });
    }
    if (this.attndLoading) return;
    this.attndLoading = true;

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
    this.attndLoading = false;
  }

  getSigninList = async (offset = 0) => {
    const { signinOffsetId, signinData } = this.state;
    // 请求第 1 页时激活 loadMore 节点
    if (offset === 0) {
      this.setState({ signinHasMore: true });
    }
    if (this.signinLoading) return;
    this.signinLoading = true;

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
    this.signinLoading = false;
  }

  onAttndLoadMore = async () => {
    const offset = this.state.attndData.length;
    this.getAttndList(offset);
  }

  onSigninLoadMore = async () => {
    const offset = this.state.signinData.length;
    this.getSigninList(offset);
  }

  getComputeAttndData = (data = []) => {
    return data.map(item => ({
      key: item._id,
      title: item.attndName,
      desc1: `口令：${item.passWd || 'loading..'}`,
      desc2: `发起者：${item.hostName || 'loading..'}`,
      desc3: `时间：${formatDate(item.createTime) || 'loading..'}`,
      tag: item.attndStatus===1 ? { active: true, text: '进行中' } : { active: false, text: '已结束' }
    }));
  }

  onAttndItemClick = (index) => {
    const { attndData } = this.state;
    const passWd = attndData[index] ? attndData[index].passWd : '';
    if (!passWd) {
      return;
    }
    wx.navigateTo({ url: `/pages/SignIn/index?passWd=${encodeURIComponent(passWd)}` });
  }

  onSigninItemClick = (index) => {
    const { signinData } = this.state;
    const passWd = signinData[index] ? signinData[index].passWd : '';
    if (!passWd) {
      return;
    }
    wx.navigateTo({ url: `/pages/SignIn/index?passWd=${encodeURIComponent(passWd)}` });
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

    const computeSigninData = this.getComputeAttndData(signinData);
    const computeAttndData = this.getComputeAttndData(attndData);

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
              data={computeSigninData}
              hasMore={signinHasMore}
              onLoadMore={this.onSigninLoadMore}
              onItemClick={this.onSigninItemClick}
            />
          </AtTabsPane>
          <AtTabsPane current={tabIndex} index={1}>
            <AttndList
              height={listHeight}
              data={computeAttndData}
              hasMore={attndHasMore}
              onLoadMore={this.onAttndLoadMore}
              onItemClick={this.onAttndItemClick}
            />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
