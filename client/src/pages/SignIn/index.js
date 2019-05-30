import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton, AtIcon } from 'taro-ui';
import AttndInfo from '../../components/AttndInfo';
import SigninList from './SigninList';
import { getAttndByPassWd, updateAttndStatus } from '../../services/attnd';
import { getSigninInfo, signin, getSigninerList } from '../../services/signin';
import { getLocation } from '../../services/location';
import * as adLog from '../../utils/adLog';
import AdToast from '../../components/AdToast';
import { AttndStatus, SigninerStatus } from '../../utils/consts';
import imgLocation from '../../assets/images/location.png';
import imgBack from '../../assets/images/back.png';
import imgGoHome from '../../assets/images/go-home.png';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '考勤 Attnd',
    backgroundColor: '#f2f2f2',
    backgroundTextStyle: 'dark',
    navigationStyle: 'custom'
  }

  state = {
    windowHeight: 0,
    listHeight: 0,
    navBarHeight: 0,
    statusBarHeight: 0,
    capsuleWidth: 0,
    capsuleHeight: 0,
    capsulePadding: 0,
    data: {
      listData: [
        // { name: '李梓鹏', stuId: '1506100006', distance: 28, signinerStatus: 1 },
        // { name: '王莹', stuId: '1501500009', distance: 20, signinerStatus: 1 },
        // { name: '刘圳', stuId: '1506100006', distance: 2000, signinerStatus: 0 },
        // { name: '黎梓毅', stuId: '1506100006', distance: 16, signinerStatus: 2 },
      ],
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
    finishAtLoading: false,
    refreshDisabled: false
  }

  componentWillMount() {
    const { passWd } = this.$router.params;
    this.setState({ passWd });
  }

  async componentDidMount() {
    this.computeHeight();
    this.onRefresh();
  }

  async onRefresh() {
    await this.getInfo();
    await this.getSigninerList();
  }

  computeHeight = async () => {
    try {
      const {
        width: capsuleWidth,
        height: capsuleHeight,
        top: capsuleTop
      } = wx.getMenuButtonBoundingClientRect();
      const { windowWidth, windowHeight, statusBarHeight } = Taro.getSystemInfoSync();
      const capsulePadding = capsuleTop - statusBarHeight;
      const navBarHeight = capsuleHeight + 2 * capsulePadding;
      const rpx = windowWidth / 750;
      const headerHeight = 258 * rpx; // PX
      const footerHeight = 100 * rpx; // PX
      const gap = (20 * 4) * rpx; // PX
      const listHeight = windowHeight - headerHeight - footerHeight - gap - navBarHeight - statusBarHeight;
      this.setState({
        windowHeight,
        listHeight,
        navBarHeight,
        statusBarHeight,
        capsuleHeight,
        capsuleWidth,
        capsulePadding
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
      }, () => {
        this.computeBtnStatus();
      });
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
      // 根据学号对签到列表排序
      if (Array.isArray(listData)) {
        listData.sort((a, b) => {
          if (a.stuId < b.stuId) {
            return -1;
          }
          if (a.stuId > b.stuId) {
            return 1;
          }
          return 0;
        });
      }
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
      } else if (signinerStatus === SigninerStatus.OUT_OF_DIST) {
        btnStatus.text = '(超距)重新签到';
        btnStatus.disabled = false;
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
            this.onRefresh();
          });
          break;
        case 3002: // 已签到
          this.setState({ signinLoading: false });
          Taro.hideLoading();
          Taro.adToast({ text: '已签到', status: 'success' }, () => {
            this.onRefresh();
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
            this.onRefresh();
          });
          break;
        default:
          break;
      }
    } catch (e) {
      this.setState({ signinLoading: false });
      Taro.hideLoading();
      adLog.warn('Signin-error', e);
      if (typeof e === 'object' && e.errCode === 5001) {
        Taro.adToast({ text: '操作频繁，请稍后再试～' }, () => {
          this.onRefresh();
        });
        return;
      }
      Taro.adToast({ text: '抱歉，无法签到' }, () => {
        this.onRefresh();
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
        this.onRefresh();
      });
    } catch (e) {
      this.setState({ finishAtLoading: false });
      Taro.hideLoading();
      Taro.adToast({ text: '抱歉，结束考勤时遇到了问题' }, () => {
        this.onRefresh();
      });
    }
  }

  onAttndInfoClick = () => {
    const { passWd } = this.state;
    if (!passWd) return;
    Taro.setClipboardData({
      data: passWd,
      success: () => Taro.adToast({ text: '口令拷贝成功', status: 'success' })
    });
  }

  onRefreshClick = () => {
    const { refreshDisabled } = this.state;
    if (refreshDisabled) {
      Taro.adToast({ text: '操作过于频繁～' });
      return;
    }
    this.setState({ refreshDisabled: true });
    this.onRefresh();
    setTimeout(() => {
      this.setState({ refreshDisabled: false });
    }, 6000);
  }

  computeRefreshBg = () => {
    const { refreshDisabled } = this.state;
    return refreshDisabled ? '#B8CBEE' : '#6190e8';
  }

  onShareAppMessage() {
    const { passWd } = this.state;
    return {
      title: '快来参加考勤吧！',
      path: `/pages/SignIn/index?passWd=${passWd}`,
      imageUrl: imgLocation
    }
  }

  goBack = () => Taro.navigateBack();

  goHome = () => Taro.switchTab({ url: '/pages/Home/index' });

  render() {
    const {
      windowHeight, listHeight, navBarHeight, statusBarHeight, capsuleWidth, capsuleHeight, capsulePadding, data, attndInfo, btnStatus, attndBelonging, getListLoading
    } = this.state;
    return (
      <View className="signin" style={{ height: `${windowHeight}px` }}>
        <View className="signin__statusbar" style={{ height: `${statusBarHeight}px` }}></View>
        <View className="signin__nav" style={{ height: `${navBarHeight}px` }}>
          <View className="signin__capsule" style={{ top: `${capsulePadding}px` }}>
            <View
              className="signin__capsule--left"
              style={{
                height: `${capsuleHeight}px`,
                width: `${capsuleWidth / 2}px`,
                borderTopLeftRadius: `${capsuleHeight / 2}px`,
                borderBottomLeftRadius: `${capsuleHeight / 2}px`
              }}
              onClick={this.goBack}
            >
              <View className="signin__capsule--iconleft">
                <Image src={imgBack} style={{ width: '20px', height: '20px' }} />
              </View>
            </View>
            <View
              className="signin__capsule--right"
              style={{
                height: `${capsuleHeight}px`,
                width: `${capsuleWidth / 2}px`,
                borderTopRightRadius: `${capsuleHeight / 2}px`,
                borderBottomRightRadius: `${capsuleHeight / 2}px`
              }}
              onClick={this.goHome}
            >
              <View className="signin__capsule--iconright">
                <Image src={imgGoHome} style={{ width: '20px', height: '20px' }} />
              </View>
            </View>
          </View>
          <View className="signin__nav--title">考勤详情</View>
        </View>
        <View className="signin__body">
          <View className="signin__header" onClick={this.onAttndInfoClick}>
            <AttndInfo item={attndInfo} />
          </View>
          <View className="signin__content" style={{ height: `${listHeight}px` }}>
            {data.listData.length === 0 && !getListLoading
              ? <View className="signin__content--emptyhint">暂时还没有人签到 :) <Text className="signin__content--emptyrefresh" onClick={this.onRefreshClick}>点击刷新</Text></View>
              : <SigninList data={data} height={listHeight} onRefreshClick={this.onRefreshClick}/>
            }
          </View>
          <View className="signin__footer">
            <View className="signin__footer--btn">
              {attndBelonging
                ? <AtButton type="primary" disabled={btnStatus.disabled} onClick={this.onFinishAttnd}>{btnStatus.text}</AtButton>
                : <AtButton type="primary" disabled={btnStatus.disabled} onClick={this.onSignin}>{btnStatus.text}</AtButton>
              }
            </View>
          </View>
        </View>
        <AdToast />
      </View>
    )
  }
}
