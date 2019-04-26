import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import AttndInfo from '../../components/AttndInfo';
import SininList from './SigninList';
import { getAttndByPassWd, updateAttndStatus } from '../../services/attnd';
import { getSigninInfo, signin, getSigninerList } from '../../services/signin';
import { getLocation } from '../../services/location';
import * as adLog from '../../utils/adLog';
import AdToast from '../../components/AdToast';
import { AttndStatus, SigninerStatus } from '../../utils/consts';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '考勤 Attnd',
    enablePullDownRefresh: true,
    backgroundColor: '#f2f2f2',
    backgroundTextStyle: 'dark'
  }

  state = {
    windowHeight: 0,
    listHeight: 0,
    data: {
      listData: [],
      hasMore: true
    },
    passWd: '',
    attndInfo: {},
    signinInfo: {},
    btnStatus: {},
    attndBelonging: false,
    getInfoLoading: false,
    getListLoading: false,
    signinLoading: false,
    finishAtLoading: false
  }

  componentWillMount() {
    const { passWd } = this.$router.params;
    this.setState({ passWd });
  }

  async componentDidMount() {
    this.computeHeight();
    await this.getInfo();
    this.getSigninerList();
  }

  async onPullDownRefresh() {
    await this.getInfo();
    await this.getSigninerList();
    Taro.stopPullDownRefresh();
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

  // 获取考勤信息和签到信息
  getInfo = async () => {
    const { getInfoLoading, passWd } = this.state;
    if (getInfoLoading) return;
    this.setState({ getInfoLoading: true });
    Taro.showLoading({ title: '获取信息', mask: true });
    try {
      const [attndResult, signinResult] = await Promise.all([
        getAttndByPassWd({ passWd }),
        getSigninInfo({ passWd })
      ]);
      Taro.hideLoading();
      this.setState({
        attndInfo: attndResult.data || {},
        signinInfo: signinResult.data || {},
        attndBelonging: attndResult.data.belonging || false,
        getInfoLoading: false
      }, () => this.computeBtnStatus());
    } catch (e) {
      Taro.hideLoading();
      this.setState({ getInfoLoading: false });
      Taro.adToast({ text: '获取信息出现问题' });
      adLog.warn('getInfo-error', e);
    }
  }

  // 获取签到人员列表
  getSigninerList = async () => {
    const { passWd, getListLoading } = this.state;
    if (getListLoading) return;
    this.setState({ getListLoading: true });
    Taro.showLoading({ title: '获取列表', mask: true });
    try {
      const { data: listData } = await getSigninerList({ passWd });
      Taro.hideLoading();
      this.setState({
        getListLoading: false,
        data: { listData }
      });
    } catch (e) {
      Taro.hideLoading();
      this.setState({ getListLoading: false });
      Taro.adToast({ text: '获取列表出现问题' });
      adLog.warn('getSigninerList-error', e);
    }
  }

  // 计算底部功能性按钮的状态
  // belonging: true/false
  // attndStatus: 1-->进行中，0-->已结束
  // signinStatus: 1-->已到，0-->超出距离，2-->迟到，-1-->未签到
  computeBtnStatus = () => {
    const btnStatus = {
      text: '签到',
      disabled: false,
      handleFunc: () => { }
    };
    const { belonging = false, attndStatus = 0 } = this.state.attndInfo;
    const { signinerStatus = SigninerStatus.UN_SIGNIN } = this.state.signinInfo;
    if (belonging) {
      if (attndStatus === AttndStatus.ON) {
        btnStatus.text = '结束此考勤';
        btnStatus.handleFunc = this.onFinishAttnd;
      } else {
        btnStatus.text = '已结束';
        btnStatus.disabled = true;
      }
    } else {
      if (signinerStatus === SigninerStatus.ARRIVED || signinerStatus === SigninerStatus.LATE) {
        btnStatus.text = '已签到';
        btnStatus.disabled = true;
      } else {
        btnStatus.text = '签到';
        btnStatus.handleFunc = this.onSignin;
      }
    }
    this.setState({ btnStatus });
  }

  onSignin = async () => {
    const { passWd, getInfoLoading, signinLoading } = this.state;
    if (getInfoLoading || signinLoading) return;
    this.setState({ signinLoading: true });
    Taro.showLoading({ title: '请稍后', mask: true });
    try {
      // 获取签到这当前位置
      const location = await getLocation();
      if (!location) {
        this.setState({ signinLoading: false });
        Taro.hideLoading();
        Taro.navigateTo({ url: '/pages/EditAuth/index' });
        return;
      }
      const res = await signin({ passWd, location });
      switch (res.code) {
        case 2000: // 成功
          this.setState({ signinLoading: false });
          Taro.hideLoading();
          Taro.adToast({ text: '签到成功', status: 'success' }, () => {
            Taro.startPullDownRefresh(); // 触发下拉刷新
          });
          break;
        case 3002: // 已签到
          this.setState({ signinLoading: false });
          Taro.hideLoading();
          Taro.adToast({ text: '已签到', status: 'success' }, () => {
            Taro.startPullDownRefresh(); // 触发下拉刷新
          });
          break;
        case 3003: // 个人信息不完整
          this.setState({ signinLoading: false });
          Taro.hideLoading();
          Taro.showModal({
            title: '个人信息',
            content: '请完善个人信息',
            confirmText: '前往',
            confirmColor: '#78a4fa',
            success: res => res.confirm && Taro.navigateTo({ url: '/pages/EditUserInfo/index' })
          });
          break;
        case 3004: // 签到人数超过限制
          this.setState({ signinLoading: false });
          Taro.hideLoading();
          Taro.adToast({ text: '抱歉，签到人数超过限制，最多为 100 人', duration: 2500 }, () => {
            Taro.startPullDownRefresh(); // 触发下拉刷新
          });
          break;
        default:
          break;
      }
    } catch (e) {
      this.setState({ signinLoading: false });
      Taro.hideLoading();
      Taro.adToast({ text: '抱歉，无法签到' }, () => {
        Taro.startPullDownRefresh(); // 触发下拉刷新
      });
    }
  }

  onFinishAttnd = () => {
    Taro.showModal({
      title: '结束考勤',
      content: '即将结束考勤，考勤结束之后的签到会被记为迟到',
      confirmText: '现在结束',
      cancelText: '稍后',
      confirmColor: '#78a4fa',
      success: res => res.confirm && this.finishAttnd()
    });
  }

  // 结束考勤
  finishAttnd = async () => {
    const { passWd, getInfoLoading, finishAtLoading } = this.state;
    if (getInfoLoading || finishAtLoading) return;
    this.setState({ finishAtLoading: true });
    Taro.showLoading({ title: '请稍后', mask: true });
    try {
      await updateAttndStatus({ passWd, attndStatus: AttndStatus.OFF });
      this.setState({ finishAtLoading: false });
      Taro.hideLoading();
      Taro.adToast({ text: '完成考勤', status: 'success' }, () => {
        Taro.startPullDownRefresh(); // 触发下拉刷新
      });
    } catch (e) {
      this.setState({ finishAtLoading: false });
      Taro.hideLoading();
      Taro.adToast({ text: '抱歉，结束考勤时遇到了问题' }, () => {
        Taro.startPullDownRefresh(); // 触发下拉刷新
      });
    }
  }

  render() {
    const {
      windowHeight, listHeight, data, attndInfo, btnStatus, attndBelonging
    } = this.state;
    return (
      <View className="signin" style={{ height: `${windowHeight}px` }}>
        <View className="signin__header">
          <AttndInfo item={attndInfo} />
        </View>
        <View className="signin__content" style={{ height: `${listHeight}px` }}>
          <SininList data={data} height={listHeight} />
        </View>
        <View className="signin__footer">
          {attndBelonging
            ? <AtButton type="primary" disabled={btnStatus.disabled} onClick={this.onFinishAttnd}>{btnStatus.text}</AtButton>
            : <AtButton type="primary" disabled={btnStatus.disabled} onClick={this.onSignin}>{btnStatus.text}</AtButton>
          }
        </View>
        <AdToast />
      </View>
    )
  }
}
