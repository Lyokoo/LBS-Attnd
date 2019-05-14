import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '考勤 Attnd',
    backgroundColor: '#f2f2f2'
  }

  state = {
    windowHeight: 0
  }

  componentDidMount() {
    this.computeHeight();
  }

  computeHeight = () => {
    try {
      const { windowHeight } = wx.getSystemInfoSync();
      this.setState({ windowHeight });
    } catch (e) {
      console.log(e);
    }
  }

  onFindAttndClick = () => Taro.navigateTo({ url: '/pages/FindAttnd/index' });

  onEditAttndClick = () => Taro.navigateTo({ url: '/pages/EditAttnd/index' });

  // onTest = () => Taro.navigateTo({ url: '/pages/ShowPassWd/index?passWd=ht2ADJ' });

  render() {
    const { windowHeight } = this.state;
    return (
      <View className="home">
        {/* <Button onClick={this.onTest}>test</Button> */}
        <View className="home__wrapper" style={{ height: `${windowHeight / 2}px` }}>
          <View className="home__signin home__opt" onClick={this.onFindAttndClick}>
            <View className="home__circle">签</View>
            <View className="home__text">我要签到</View>
          </View>
        </View>
        <View className="home__wrapper" style={{ height: `${windowHeight / 2}px` }}>
          <View className="home__attnd home__opt" onClick={this.onEditAttndClick}>
            <View className="home__circle">勤</View>
            <View className="home__text">发起考勤</View>
          </View>
        </View>
      </View>
    )
  }
}
