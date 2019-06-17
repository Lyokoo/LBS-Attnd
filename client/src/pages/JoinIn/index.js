import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import * as adLog from '../../utils/adLog';
import AdToast from '../../components/AdToast';
import imgLocation from '../../assets/images/location.png';
import CapsuleBar from '../../components/CapsuleBar';
import NoticeBar from '../../components/NoticeBar';
import { formatDate } from '../../utils/func';
import { getGroupByPassWd, updateGroupStatus, deleteGroup, joinin, deleteJoiner } from '../../services/group';
import { GroupStatus } from '../../utils/consts';
import JoininList from './JoininList';
import AttndInfo from '../../components/AttndInfo';
import './index.less';

export default class JoinIn extends Component {

  config = {
    navigationStyle: 'custom',
    backgroundColor: '#f2f2f2',
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
      groupInfo: {},
      btnStatus: {},
      notice: '',
      groupBelonging: false
    }
  }

  getInfoLoading = false;
  finishGroupLoading = false;
  refreshDisabled = false;
  deleteGroupLoading = false;
  joininLoading = false;
  deleteJoinerLoading = false;
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

  // 获取小组信息
  getInfo = async () => {
    const { passWd } = this.state;
    if (this.getInfoLoading) return;
    this.getInfoLoading = true;
    wx.showLoading({ title: '获取信息', mask: true });
    try {
      const { data: groupData } = await getGroupByPassWd({
        passWd,
        needMembers: true
      });
      const { openId, members = {} } = groupData || {};
      const memberInfo = members[openId] || {};
      const listData = Object.values(members).sort((a, b) => {
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
        groupInfo: groupData,
        memberInfo,
        data: { listData },
        groupBelonging: groupData.belonging || false
      }, () => {
        this.removeGroupHint();
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
  // groupStatus: 1-->邀请中，0-->已完成
  computeBtnStatus = () => {
    const btnStatus = {
      text: '加入',
      disabled: false,
      handleFunc: () => { }
    };
    const { belonging = false, groupStatus = GroupStatus.OFF } = this.state.groupInfo;
    if (belonging) {
      if (groupStatus === GroupStatus.ON) {
        btnStatus.text = '结束邀请';
        btnStatus.handleFunc = this.onGroupFinish;
      } else {
        btnStatus.text = '已结束';
        btnStatus.disabled = true;
      }
    } else {
      if (groupStatus === GroupStatus.ON) {
        btnStatus.text = '加入';
        btnStatus.handleFunc = this.onGroupSignin;
      } else {
        btnStatus.text = '已完成';
        btnStatus.disabled = true;
      }
    }
    this.setState({ btnStatus });
  }

  onGroupFinish = () => {
    wx.showModal({
      title: '结束小组邀请',
      content: '即将结束邀请，结束后，新的朋友将无法加入小组，后续可再打开邀请',
      confirmText: '现在结束',
      cancelText: '稍后',
      confirmColor: '#78a4fa',
      success: res => res.confirm && this.finishGroup()
    });
  }

  // 完成小组创建
  finishGroup = () => {
    this.onGroupStatusUpdate(GroupStatus.OFF);
  }

  // 重新打开小组
  onGroupReopen = () => {
    this.onGroupStatusUpdate(GroupStatus.ON);
  }

  // 更新小组状态
  onGroupStatusUpdate = async (groupStatus = GroupStatus.OFF) => {
    const { passWd } = this.state;
    if (this.getInfoLoading || this.finishGroupLoading) return;
    this.finishGroupLoading = true;
    wx.showLoading({ title: '请稍后', mask: true });
    try {
      await updateGroupStatus({ passWd, groupStatus });
      this.finishGroupLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '成功', status: 'success' }, () => {
        this.onRefresh();
      });
    } catch (e) {
      this.finishGroupLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '抱歉，遇到点问题' }, () => {
        this.onRefresh();
      });
    }
  }

  onGroupDelete = () => {
    wx.showModal({
      title: '删除小组',
      content: '删除小组后，小组将不再显示在列表中，但使用过该小组的考勤不受影响',
      confirmText: '确认',
      confirmColor: '#78a4fa',
      success: res => res.confirm && this.deleteGroup()
    });
  }

  // 删除小组
  deleteGroup = async () => {
    try {
      const { passWd } = this.state;
      if (this.deleteLoading) return;
      this.deleteLoading = true;
      wx.showLoading({ title: '请稍后', mask: true });
      await deleteGroup({ passWd });
      wx.hideLoading();
      this.deleteLoading = false;
      Taro.adToast({ text: '删除成功', status: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (e) {
      adLog.warn('deleteGroup-error', e);
      wx.hideLoading();
      this.deleteLoading = false;
      Taro.adToast({ text: '操作失败' }, () => {
        this.onRefresh();
      });
    }
  }

  // 已删除提示
  removeGroupHint = () => {
    const { groupInfo } = this.state;
    if (groupInfo.active) {
      return;
    }
    wx.showModal({
      title: '提示',
      content: '小组已删除',
      confirmText: '知道了',
      confirmColor: '#78a4fa',
      showCancel: false,
      success: res => res.confirm && wx.navigateBack()
    });
  }

  // 删除组员
  onJoinerDelete = (signinerOpenId) => {
    wx.showModal({
      title: '移除组员',
      content: '移除组员后无法恢复',
      confirmText: '确认',
      confirmColor: '#ff4949',
      success: res => res.confirm && this.deleteJoiner(signinerOpenId)
    });
  }

  // 删除组员
  deleteJoiner = async (signinerOpenId) => {
    if (this.deleteJoinerLoading) {
      return;
    }
    this.deleteJoinerLoading = true;
    const { passWd } = this.state;
    wx.showLoading({ title: '请稍后', mask: true });
    try {
      await deleteJoiner({ passWd, signinerOpenId });
      wx.hideLoading();
      Taro.adToast({ text: '移除成功', status: 'success' }, () => {
        this.onRefresh();
      });
    } catch (e) {
      adLog.warn('JoinerDelete-error', e);
      wx.hideLoading();
      Taro.adToast({ text: '操作失败' }, () => {
        this.onRefresh();
      });
    }
    this.deleteJoinerLoading = false;
  }

  // 刷新
  onGroupRefresh = () => {
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

  // 加入小组
  onGroupJoinin = async () => {
    const { passWd } = this.state;
    if (this.getInfoLoading || this.joininLoading) return;
    this.joininLoading = true;
    wx.showLoading({ title: '请稍后', mask: true });
    try {
      const res = await joinin({ passWd });
      this.joininLoading = false;
      wx.hideLoading();
      switch (res.code) {
        case 2000: // 成功
          Taro.adToast({ text: '签到成功', status: 'success' }, () => {
            this.onRefresh();
          });
          break;
        case 3002: // 已加入
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
        default:
          break;
      }
    } catch (e) {
      this.joininLoading = false;
      wx.hideLoading();
      adLog.warn('Joinin-error', e);
      if (typeof e === 'object' && e.errCode === 5001) {
        Taro.adToast({ text: '操作频繁，请稍后再试～' }, () => {
          this.onRefresh();
        });
        return;
      }
      Taro.adToast({ text: '抱歉，无法加入' }, () => {
        this.onRefresh();
      });
    }
  }

  onCapsuleInit = (capsuleBarHeight) => {
    this.setState({ capsuleBarHeight });
  }

  onNoticeInit = (noticeBarHeight) => {
    this.setState({ noticeBarHeight });
  }

  onShareAppMessage() {
    const { passWd } = this.state;
    return {
      title: '快来参加考勤吧！',
      path: `/pages/JoinIn/index?passWd=${encodeURIComponent(passWd)}`,
      imageUrl: imgLocation
    }
  }

  render() {
    const { windowHeight, listHeight, capsuleBarHeight, noticeBarHeight, data, groupInfo, groupBelonging, btnStatus } = this.state;
    const computeListHeight = listHeight - capsuleBarHeight - noticeBarHeight;
    const infoData = {
      title: groupInfo.groupName,
      desc1: `口令：${groupInfo.passWd || 'loading..'}`,
      desc2: `组长：${groupInfo.hostName || 'loading..'}`,
      desc3: `时间：${formatDate(groupInfo.createTime) || 'loading..'}`,
      tag: groupInfo.groupStatus === 1 ? { active: true, text: '邀请中' } : { active: false, text: '已完成' }
    }

    return (
      <View className="joinin" style={{ height: `${windowHeight}px`, paddingTop: `${capsuleBarHeight}px` }}>
        <View className="joinin__capsulebar">
          <CapsuleBar title="小组详情" onCapsuleInit={this.onCapsuleInit} />
        </View>
        <NoticeBar type="joinin" onNoticeInit={this.onNoticeInit} />
        <View className="joinin__body">
          <View className="joinin__header">
            <AttndInfo data={infoData} />
          </View>
          <View className="joinin__content">
            <JoininList
              data={data}
              height={computeListHeight}
              groupBelonging={groupBelonging}
              groupStatus={groupInfo.groupStatus}
              onGroupDelete={this.onGroupDelete}
              onGroupReopen={this.onGroupReopen}
              onGroupRefresh={this.onGroupRefresh}
              onJoinerDelete={this.onJoinerDelete}
            />
          </View>
          <View className="joinin__footer">
            <View className="joinin__footer--btn">
              {groupBelonging
                ? <AtButton type="primary" disabled={btnStatus.disabled} onClick={this.onGroupFinish}>{btnStatus.text}</AtButton>
                : <AtButton type="primary" disabled={btnStatus.disabled} onClick={this.onGroupJoinin}>{btnStatus.text}</AtButton>
              }
            </View>
          </View>
        </View>
        <AdToast />
      </View>
    );
  }
}