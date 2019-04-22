import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import AttndInfo from '../../components/AttndInfo';
import SininList from './SigninList';
import { getAttndByPassWd } from '../../services/attnd';
import { signin } from '../../services/signin';
import { getLocation } from '../../services/location';
import * as adLog from '../../utils/adLog';
import AdToast from '../../components/AdToast';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '考勤详情',
    enablePullDownRefresh: true,
    backgroundColor: '#f2f2f2',
    backgroundTextStyle: 'dark'
  }

  state = {
    windowHeight: 0,
    listHeight: 0,
    data: {
      listData: [1, 2],
      hasMore: true
    },
    passWd: '',
    getAtInfoLoading: false,
    signinLoading: false,
    attndInfo: {}
  }

  componentWillMount() {
    const { passWd } = this.$router.params;
    this.setState({ passWd });
  }

  componentDidMount() {
    this.computeHeight();
    this.getAttndInfo();
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

  getAttndInfo = async () => {
    const { getAtInfoLoading, passWd } = this.state;
    if (getAtInfoLoading) return;
    this.setState({ getAtInfoLoading: true });
    Taro.showLoading({ title: '加载中', mask: true });
    try {
      const { data } = await getAttndByPassWd({ passWd });
      this.setState({ attndInfo: data });
    } catch (e) {
      adLog.warn('getAttndInfo-error', e);
    }
    this.setState({ getAtInfoLoading: false });
    Taro.hideLoading();
  }

  // 略复杂
  computeBtnStatus = () => {
    const { isAttndBelong, attndStatus } = this.state.attndInfo;
    if (isAttndBelong) {
      // 此考勤属于我
      
    } else {
      // 此考勤不属于我
    }
  }

  onSignin = async () => {
    const { passWd, getAtInfoLoading, signinLoading } = this.state;
    if (getAtInfoLoading || signinLoading) return;
    this.setState({ signinLoading: true });
    Taro.showLoading({ title: '请稍后', mask: true });

    try {
      // 获取签到这当前位置
      const location = await getLocation();

      if (!location) {
        this.setState({ signinLoading: false });
        Taro.hideLoading();
        Taro.navigateTo({ url: '../EditAuth/index' });
        return;
      }

      const res = await signin({ passWd, location });

      if (res.code === 3002) {
        this.setState({ signinLoading: false });
        Taro.hideLoading();
        Taro.adToast({ text: '已签到', status: 'success' });
        return;
      }

      this.setState({ signinLoading: false });
      Taro.hideLoading();
      Taro.adToast({ text: '签到成功', status: 'success' });
    } catch (e) {
      this.setState({ signinLoading: false });
      Taro.hideLoading();
      Taro.adToast({ text: '无法签到', status: 'error' });
    }
  }

  render() {
    const {
      windowHeight, listHeight, data, attndInfo
    } = this.state;
    return (
      <View className="signin" style={{height: `${windowHeight}px`}}>
        <View className="signin__header">
          <AttndInfo item={attndInfo}/>
        </View>
        <View className="signin__content" style={{height: `${listHeight}px`}}>
          <SininList data={data} height={listHeight}/>
        </View>
        <View className="signin__footer">
          <AtButton
            type="primary"
            loading={false}
            disabled={false}
            onClick={this.onSignin}
          >签到
          </AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
