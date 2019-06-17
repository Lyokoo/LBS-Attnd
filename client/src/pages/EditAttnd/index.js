import Taro, { Component } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtInput, AtButton, AtSwitch } from 'taro-ui';
import AdToast from '../../components/AdToast';
import { getLocation, getAddress } from '../../services/location';
import { createAttnd } from '../../services/attnd';
import { getAllGroups } from '../../services/group';
import * as adLog from '../../utils/adLog';
import './index.less';

export default class EditAttnd extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    attndName: '',
    isAttndNameErr: false,
    getGroupLoading: false,
    useGroup: false,
    groupPassWd: '',
    groupList: [],
    selectedIndex: -1,
  }

  submiting = false;

  onInputChange = (value) => {
    this.setState({
      attndName: value,
      isAttndNameErr: false
    });
  }

  onSwitchChange = (value) => {
    const useGroup = value;
    this.setState({ useGroup });
    if (value) {
      this.setState({
        groupPassWd: '',
        selectedIndex: -1
      });
      this.getGroupList();
    }
  }

  onPickerChange = (event) => {
    const selectedIndex = event.target.value;
    const groupPassWd = this.state.groupList[selectedIndex].passWd;
    this.setState({
      selectedIndex,
      groupPassWd
    });
  }

  checkFormData = (attndName, useGroup, groupPassWd) => {
    if (!attndName.trim()) {
      Taro.adToast({ text: '名称不能为空' });
      this.setState({ isAttndNameErr: true });
      return false;
    }
    if (useGroup && !groupPassWd) {
      Taro.adToast({ text: '请选择小组' });
      return false;
    }
    return true;
  }

  getGroupList = async () => {
    const { getGroupLoading } = this.state;
    if (getGroupLoading) {
      return;
    }
    this.setState({ getGroupLoading: true });
    wx.showLoading({ title: '获取小组', mask: true });
    try {
      const { data = [] } = await getAllGroups();
      this.setState({
        groupList: data,
        getGroupLoading: false
      });
    } catch (e) {
      Taro.adToast({ text: '获取小组出了点问题～' });
      adLog.warn('getAllGroups-error', e);
      this.setState({ getGroupLoading: false });
    }
    wx.hideLoading();
  }

  onCreateGroup = () => wx.redirectTo({ url: '/pages/EditGroup/index' });

  onSubmit = async () => {
    const { attndName, useGroup, groupPassWd } = this.state;
    if (!this.checkFormData(attndName, useGroup, groupPassWd)) {
      return;
    }
    if (this.submiting) return;
    this.submiting = true;

    wx.showLoading({ title: '请稍后', mask: true });

    try {
      // 获取地理位置
      const location = await getLocation();

      // 未授权获取位置
      if (!location) {
        this.submiting = false;
        wx.hideLoading();
        wx.navigateTo({ url: '/pages/EditAuth/index' });
        return;
      }

      // 用于地图显示的 gcj02 坐标
      const gcj02Location = await getLocation('gcj02');

      // 获取逆地址解析（地理位置描述）
      const address = await getAddress();

      const res = await createAttnd({
        attndName,
        location,
        address,
        gcj02Location,
        useGroup,
        groupPassWd
      });

      this.submiting = false;
      wx.hideLoading();

      // 未填写个人信息
      if (res.code === 3003) {
        wx.showModal({
          title: '个人信息',
          content: '请完善个人信息',
          confirmText: '前往',
          confirmColor: '#78a4fa',
          success: res => res.confirm && wx.navigateTo({ url: '/pages/EditUserInfo/index' })
        });
        return;
      }

      const passWd = res.data.passWd;
      Taro.adToast({ text: '发起成功', status: 'success' });
      setTimeout(() => wx.redirectTo({ url: `/pages/ShowPassWd/index?passWd=${encodeURIComponent(passWd)}` }), 1500);
    } catch (e) {
      adLog.warn('EditAttnd-error', e);
      wx.hideLoading();
      if (typeof e === 'object' && e.errCode === 5001) {
        Taro.adToast({ text: '操作频繁，请稍后再试～' });
        return;
      }
      Taro.adToast({ text: '发起失败' });
    }
    this.submiting = false;
  }

  render() {
    const { attndName, isAttndNameErr, useGroup, groupList, selectedIndex, getGroupLoading } = this.state;
    const desc1 = '* 小程序通过 GPS 定位，确定考勤有效范围是以你当前位置为中心的方圆 200 米，在有效范围内完成签到者视为已到';
    const desc2 = '* 小组是为考勤预设的名单，只有在名单内的签到者才能参加考勤，如果你还没有创建过小组，可前往“我的”页面在线创建';

    const computeGroupList = groupList.map(el => el.groupName);

    return (
      <View className="edit-attnd">
        <View className="edit-attnd__title">发起考勤</View>
        <View>
          <View className="edit-attnd__desc">{desc1}</View>
          <View className="edit-attnd__desc">{desc2}</View>
        </View>
        <View className="edit-attnd__form">
          <View className="edit-attnd__input">
            <AtInput
              type='text'
              placeholder='输入考勤名称'
              placeholderStyle="color: #cccccc"
              error={isAttndNameErr}
              maxLength={150}
              value={attndName}
              onChange={this.onInputChange}
            />
          </View>
          <View className="edit-attnd__switch">
            <AtSwitch title='使用小组' checked={useGroup} onChange={this.onSwitchChange} />
          </View>
          {
            useGroup && (
              groupList.length > 0
              ? (
                  <View className="edit-attnd__picker">
                    <Picker mode="selector" range={computeGroupList} onChange={this.onPickerChange}>
                      {
                        selectedIndex === -1
                          ? <View style={{ color: '#cccccc' }}>选择小组</View>
                          : <View>{groupList[selectedIndex].groupName}</View>
                      }
                    </Picker>
                  </View>
                )
              : (!getGroupLoading && <View className="edit-attnd__hint">还没有小组？<Text className="edit-attnd__hint--link" onClick={this.onCreateGroup}>点击创建</Text></View>)
            )
          }
        </View>
        <View className="edit-attnd__btn">
          <AtButton type="primary" onClick={this.onSubmit}>立即发起</AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
