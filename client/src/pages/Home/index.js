import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import school from '../../assets/images/school.jpeg';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    value: ''
  }

  onFindAttndClick = () => {
    Taro.navigateTo({
      url: '../FindAttnd/index'
    });
  }

  onEditAttndClick = () => {
    Taro.navigateTo({
      url: '../EditAttnd/index'
    });
  }

  onTest = () => {
    Taro.navigateTo({
      url: '../ShowPassWd/index'
    });
  }

  render() {
    return (
      <View className="home">
        <View onClick={this.onTest}>
          <AtButton size="small">test</AtButton>
        </View>
        <View className="home__img">
          <Image src={school} mode="aspectFit" style={{width: '100%'}}/>
        </View>
        <View className="home__opt">
          <View className="home__opt--1" onClick={this.onFindAttndClick}>
            <AtButton type="primary">签到</AtButton>
          </View>
          <View onClick={this.onEditAttndClick}>
            <AtButton>发起考勤</AtButton>
          </View>
        </View>
      </View>
    )
  }
}
