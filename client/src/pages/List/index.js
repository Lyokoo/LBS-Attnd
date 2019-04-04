import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';
import AttndList from './AttndList';
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
    attndData: {
      listData: [1],
      hasMore: true
    },
    siginData: {
      listData: [1, 2, 3, 4, 5, 6, 7, 8],
      hasMore: true
    }
  }

  tabList = [
    { title: '我参与的' },
    { title: '我发起的' }
  ]

  componentDidMount() {
    this.computeHeight();
  }

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

  render () {
    const { listHeight, windowHeight, tabIndex, attndData, siginData } = this.state;
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
            <AttndList height={listHeight} data={attndData}/>
          </AtTabsPane>
          <AtTabsPane current={tabIndex} index={1}>
            <AttndList height={listHeight} data={siginData}/>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
