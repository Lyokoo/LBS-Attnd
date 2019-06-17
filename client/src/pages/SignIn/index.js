import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import AttndInfo from '../../components/AttndInfo';
import SigninList from './SigninList';
import { getAttndByPassWd, updateAttndStatus, deleteAttnd } from '../../services/attnd';
import { signin, updateSigninerStatus } from '../../services/signin';
import { getLocation } from '../../services/location';
import * as adLog from '../../utils/adLog';
import AdToast from '../../components/AdToast';
import { AttndStatus, SigninerStatus } from '../../utils/consts';
import imgLocation from '../../assets/images/location.png';
import CapsuleBar from '../../components/CapsuleBar';
import NoticeBar from '../../components/NoticeBar';
import { formatDate } from '../../utils/func';
import './index.less';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '考勤 Attnd',
    backgroundColor: '#f2f2f2',
    backgroundTextStyle: 'dark',
    navigationStyle: 'custom'
  }

  constructor() {
    try {
      var { windowWidth, windowHeight } = wx.getSystemInfoSync();
      var rpx = windowWidth / 750;
      var headerHeight = 258 * rpx; // PX
      var footerHeight = 100 * rpx; // PX
      var gap = (20 * 4) * rpx; // PX
      var listHeight = windowHeight - headerHeight - footerHeight - gap;
    } catch (e) {
      console.log(e);
    }
    this.state = {
      windowHeight: windowHeight || 0,
      windowWidth: windowWidth || 0,
      listHeight: listHeight || 0,
      capsuleBarHeight: 0,
      noticeBarHeight: 0,
      data: {
        listData: [],
        hasMore: true
      },
      passWd: '',
      attndInfo: {},
      signinInfo: {},
      btnStatus: {},
      notice: '',
      attndBelonging: false
    }
  }

  getInfoLoading = false;
  signinLoading = false;
  finishAtLoading = false;
  deleteLoading = false;
  updateSnLoading = false;
  refreshDisabled = false;

  componentWillMount() {
    const { passWd } = this.$router.params;
    this.setState({
      passWd: decodeURIComponent(passWd)
    });
  }

  async componentDidMount() {
    this.onRefresh();
  }

  onRefresh() {
    this.getInfo();
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

  onAttndDelete = () => {
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
        wx.navigateBack();
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

  // 查看考勤位置和当前位置
  onShowLocation = async () => {
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
  onAttndRefresh = () => {
    if (this.refreshDisabled) {
      Taro.adToast({ text: '操作过于频繁～' });
      return;
    }
    this.refreshDisabled = true;
    this.onRefresh();
    setTimeout(() => {
      this.refreshDisabled = false;
    }, 6000);
  }

  // 更新签到状态
  onSigninerStatusUpdate = async ({ signinerOpenId, signinerStatus }) => {
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
      adLog.log('onSigninerStatusUpdate', e);
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
      path: `/pages/SignIn/index?passWd=${encodeURIComponent(passWd)}`,
      imageUrl: imgLocation
    }
  }

  onCapsuleInit = (capsuleBarHeight) => {
    this.setState({ capsuleBarHeight });
  }

  onNoticeInit = (noticeBarHeight) => {
    this.setState({ noticeBarHeight });
  }

  render() {
    const {
      windowHeight, listHeight, capsuleBarHeight, noticeBarHeight, data, attndInfo, btnStatus, attndBelonging,
    } = this.state;
    const computeListHeight = listHeight - noticeBarHeight - capsuleBarHeight;

    const infoData = {
      title: attndInfo.attndName,
      desc1: `口令：${attndInfo.passWd || 'loading..'}`,
      desc2: `发起者：${attndInfo.hostName || 'loading..'}`,
      desc3: `时间：${formatDate(attndInfo.createTime) || 'loading..'}`,
      tag: attndInfo.attndStatus === 1 ? { active: true, text: '进行中' } : { active: false, text: '已结束' }
    }

    return (
      <View className="signin" style={{ height: `${windowHeight}px`, paddingTop: `${capsuleBarHeight}px` }}>
        <View className="signin__capsulebar">
          <CapsuleBar title="考勤详情" onCapsuleInit={this.onCapsuleInit} />
        </View>
        <NoticeBar type="signin" onNoticeInit={this.onNoticeInit} />
        <View className="signin__body">
          <View className="signin__header">
            <AttndInfo data={infoData} />
          </View>
          <View className="signin__content" style={{ height: `${computeListHeight}px` }}>
            <SigninList
              data={data}
              height={computeListHeight}
              attndBelonging={attndBelonging}
              onAttndRefresh={this.onAttndRefresh}
              onShowLocation={this.onShowLocation}
              onAttndDelete={this.onAttndDelete}
              onStatusUpdate={this.onSigninerStatusUpdate}
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
