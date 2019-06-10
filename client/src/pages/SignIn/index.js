import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtButton, AtNoticebar } from 'taro-ui';
import AttndInfo from '../../components/AttndInfo';
import SigninList from './SigninList';
import { getAttndByPassWd, updateAttndStatus, deleteAttnd } from '../../services/attnd';
import { signin, updateSigninerStatus } from '../../services/signin';
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

  constructor () {
    try {
      var {
        width: capsuleWidth,
        height: capsuleHeight,
        top: capsuleTop
      } = wx.getMenuButtonBoundingClientRect();
      var { windowWidth, windowHeight, statusBarHeight } = Taro.getSystemInfoSync();
      var capsulePadding = capsuleTop - statusBarHeight;
      var navBarHeight = capsuleHeight + 2 * capsulePadding;
      var rpx = windowWidth / 750;
      var headerHeight = 258 * rpx; // PX
      var footerHeight = 100 * rpx; // PX
      var gap = (20 * 4) * rpx; // PX
      var listHeight = windowHeight - headerHeight - footerHeight - gap - navBarHeight - statusBarHeight;
    } catch (e) {
      console.log(e);
    }
    this.state = {
      windowHeight: windowHeight || 0,
      windowWidth: windowWidth || 0,
      listHeight: listHeight || 0,
      navBarHeight: navBarHeight || 0,
      statusBarHeight: statusBarHeight || 0,
      capsuleWidth: capsuleWidth || 0,
      capsuleHeight: capsuleHeight || 0,
      capsulePadding: capsulePadding || 0,
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
      notice: '',
      refreshDisabled: false,
      attndBelonging: false
    }
  }

  getInfoLoading = false;
  signinLoading = false;
  finishAtLoading = false;
  deleteLoading = false;
  updateSnLoading = false;

  componentWillMount() {
    const { passWd } = this.$router.params;
    this.setState({ passWd });
  }

  async componentDidMount() {
    // this.computeHeight();
    this.onRefresh();
  }

  onRefresh() {
    this.getInfo();
    this.getNotice();
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
        windowWidth,
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
    const { passWd } = this.state;
    if (this.getInfoLoading) return;
    this.getInfoLoading = true;
    wx.showLoading({ title: '获取信息', mask: true });
    try {
      const { data: attndData } = await getAttndByPassWd({ passWd, needSigninerList: true });
      const { openId, signinerList = {} } = attndData || {};
      const signinInfo = signinerList[openId] || {};
      const listData = Object.values(signinerList).sort((a, b) => {
        if (a.signinerStuId < b.signinerStuId) {
          return -1;
        }
        if (a.signinerStuId > b.signinerStuId) {
          return 1;
        }
        return 0;
      });
      wx.hideLoading();
      this.getInfoLoading = false;
      this.setState({
        attndInfo: attndData,
        signinInfo,
        data: { listData },
        attndBelonging: attndData.belonging || false
      }, () => {
        this.removeAttndHint();
        this.computeBtnStatus();
      });
    } catch (e) {
      wx.hideLoading();
      this.getInfoLoading = false;
      Taro.adToast({ text: '获取信息出现问题' });
      adLog.warn('getInfo-error', e);
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
    const { passWd } = this.state;
    if (this.getInfoLoading || this.signinLoading) return;
    this.signinLoading = true;
    wx.showLoading({ title: '请稍后', mask: true });
    try {
      // 获取签到这当前位置
      const location = await getLocation();
      if (!location) {
        this.signinLoading = false;
        wx.hideLoading();
        wx.navigateTo({ url: '/pages/EditAuth/index' });
        return;
      }
      const res = await signin({
        passWd,
        location
      });
      this.signinLoading = false;
      wx.hideLoading();
      switch (res.code) {
        case 2000: // 成功
          Taro.adToast({ text: '签到成功', status: 'success' }, () => {
            this.onRefresh();
          });
          break;
        case 3002: // 已签到
          Taro.adToast({ text: '已签到', status: 'success' }, () => {
            this.onRefresh();
          });
          break;
        case 3003: // 个人信息不完整
          wx.showModal({
            title: '个人信息',
            content: '请完善个人信息',
            confirmText: '前往',
            confirmColor: '#78a4fa',
            success: res => res.confirm && wx.navigateTo({ url: '/pages/EditUserInfo/index' })
          });
          break;
        case 3004: // 签到人数超过限制
          Taro.adToast({ text: '抱歉，签到人数超过限制，最多为 100 人', duration: 2500 }, () => {
            this.onRefresh();
          });
          break;
        default:
          break;
      }
    } catch (e) {
      this.signinLoading = false;
      wx.hideLoading();
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
    wx.showModal({
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
    const { passWd } = this.state;
    if (this.getInfoLoading || this.finishAtLoading) return;
    this.finishAtLoading = true;
    wx.showLoading({ title: '请稍后', mask: true });
    try {
      await updateAttndStatus({ passWd, attndStatus: AttndStatus.OFF });
      this.finishAtLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '完成考勤', status: 'success' }, () => {
        this.onRefresh();
      });
    } catch (e) {
      this.finishAtLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '抱歉，结束考勤时遇到了问题' }, () => {
        this.onRefresh();
      });
    }
  }

  onDeleteClick = () => {
    wx.showModal({
      title: '删除考勤',
      content: '删除考勤后，考勤将无法签到且不再显示在记录列表中，确认删除？',
      confirmText: '确认',
      confirmColor: '#78a4fa',
      success: res => res.confirm && this.removeAttnd()
    });
  }

  // 删除考勤
  removeAttnd = async () => {
    try {
      const { passWd } = this.state;
      if (this.deleteLoading) return;
      this.deleteLoading = true;
      wx.showLoading({ title: '请稍后', mask: true });
      await deleteAttnd({ passWd });
      wx.hideLoading();
      this.deleteLoading = false;
      Taro.adToast({ text: '删除成功', status: 'success' });
      setTimeout(() => {
        this.goBack();
      }, 1500);
    } catch (e) {
      adLog.warn('deleteAttnd-error', e);
      wx.hideLoading();
      this.deleteLoading = false;
      Taro.adToast({ text: '操作失败' }, () => {
        this.onRefresh();
      });
    }
  }

  // 已删除提示
  removeAttndHint = () => {
    const { attndInfo } = this.state;
    if (attndInfo.active) {
      return;
    }
    wx.showModal({
      title: '提示',
      content: '考勤已删除',
      confirmText: '知道了',
      confirmColor: '#78a4fa',
      showCancel: false,
      success: res => res.confirm && wx.navigateBack()
    });
  }

  // 拷贝口令
  onAttndInfoClick = () => {
    const { passWd } = this.state;
    if (!passWd) return;
    wx.setClipboardData({
      data: passWd,
      success: () => Taro.adToast({ text: '口令拷贝成功', status: 'success' })
    });
  }

  // 查看考勤位置和当前位置
  onShowLocClick = async () => {
    try {
      // 考勤者位置
      const hostLoc = { longitude: this.state.attndInfo.gcj02Location.lng, latitude: this.state.attndInfo.gcj02Location.lat };

      wx.showLoading({ title: '获取位置', mask: true });
      // 签到者位置
      const { lng, lat } = await getLocation('gcj02');
      const signinerLoc = { longitude: lng, latitude: lat };

      adLog.log('Signin-showLocation', { hostLoc, signinerLoc });
      // 验证
      if (typeof hostLoc.longitude !== 'number' || typeof hostLoc.latitude !== 'number'
        || typeof signinerLoc.longitude !== 'number' || typeof signinerLoc.latitude !== 'number') {
          wx.hideLoading();
          // Taro.adToast({ text: '未获取位置' });
        return;
      }

      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/ShowLocation/index?hostLoc=${JSON.stringify(hostLoc)}&signinerLoc=${JSON.stringify(signinerLoc)}`
      });
    } catch (e) {
      wx.hideLoading();
      // Taro.adToast({ text: '未获取位置' });
    }
  }

  // 刷新
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

  // 更新签到状态
  onUpdateSigninerStatus = async (signinerOpenId, signinerStatus) => {
    try {
      const { passWd } = this.state;
      if (this.updateSnLoading) return;
      this.updateSnLoading = true;
      wx.showLoading({ title: '修改中', mask: true });
      await updateSigninerStatus({ passWd, signinerOpenId, signinerStatus });
      this.updateSnLoading = false;
      wx.hideLoading();
      this.onRefresh();
    } catch (e) {
      adLog.log('onUpdateSigninerStatus', e);
      this.updateSnLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '操作失败' }, () => {
        this.onRefresh();
      });
    }
  }

  onShareAppMessage() {
    const { passWd } = this.state;
    return {
      title: '快来参加考勤吧！',
      path: `/pages/SignIn/index?passWd=${passWd}`,
      imageUrl: imgLocation
    }
  }

  goBack = () => wx.navigateBack();

  goHome = () => wx.switchTab({ url: '/pages/Home/index' });

  getNotice = async () => {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getNotice',
        data: { type: 'signin' }
      });
      const content = result.data.content;
      adLog.log('getNotice-result', content);
      if (content) {
        this.setState({ notice: content });
      } else {
        this.setState({ notice: '' });
      }
    } catch (e) {
      adLog.log('getNotice-error', e);
      this.setState({ notice: '' });
    }
  }

  render() {
    const {
      windowWidth, windowHeight, listHeight, navBarHeight, statusBarHeight, capsuleWidth, capsuleHeight, capsulePadding, data, attndInfo, btnStatus, attndBelonging, notice,
    } = this.state;
    const computeListHeight = notice ? listHeight - (60 * windowWidth / 750) : listHeight;
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
        {notice && <View className="signin__notice">
          <AtNoticebar single marquee speed={50}>{notice}</AtNoticebar>
        </View>}
        <View className="signin__body">
          <View className="signin__header" onClick={this.onAttndInfoClick}>
            <AttndInfo item={attndInfo} />
          </View>
          <View className="signin__content" style={{ height: `${computeListHeight}px` }}>
            <SigninList
              data={data}
              height={computeListHeight}
              attndBelonging={attndBelonging}
              onRefreshClick={this.onRefreshClick}
              onShowLocClick={this.onShowLocClick}
              onDeleteClick={this.onDeleteClick}
              onUpdateStatus={this.onUpdateSigninerStatus}
            />
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
