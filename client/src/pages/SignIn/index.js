import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import AttndInfo from '../../components/AttndInfo';
import SininList from './SigninList';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '考勤详情'
  }

  state = {
    windowHeight: 0,
    listHeight: 0,
    data: {
      listData: [1, 2],
      hasMore: true
    }
  }

  componentDidMount() {
    this.computeHeight();
  }

  computeHeight = () => {
    try {
      const { windowWidth, windowHeight } = wx.getSystemInfoSync();
      const rpx = windowWidth / 750;
      const headerHeight = 258 * rpx; // PX
      const footerHeight = 100 * rpx; // PX
      const gap = (20 * 4) * rpx; // PX
      const listHeight = windowHeight - headerHeight - footerHeight - gap;
      this.setState({
        windowHeight,
        listHeight
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { windowHeight, listHeight, data } = this.state;
    return (
      <View className="signin" style={{height: `${windowHeight}px`}}>
        <View className="signin__header">
          <AttndInfo />
        </View>
        <View className="signin__content" style={{height: `${listHeight}px`}}>
          <SininList data={data} height={listHeight}/>
        </View>
        <View className="signin__footer">
          <AtButton type="primary" loading={false}>签到</AtButton>
        </View>
      </View>
    )
  }
}
