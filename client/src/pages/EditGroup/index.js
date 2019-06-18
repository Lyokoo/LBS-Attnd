import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import AdToast from '../../components/AdToast';
import { createGroup } from '../../services/group';
import * as adLog from '../../utils/adLog';
import './index.less';

export default class EditGroup extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    groupName: '',
    isGroupNameErr: false
  }

  submiting = false;

  onInputChange = (value) => {
    this.setState({
      groupName: value,
      isGroupNameErr: false
    });
  }

  checkFormData = (groupName) => {
    if (!groupName.trim()) {
      Taro.adToast({ text: '名称不能为空' });
      this.setState({ isGroupNameErr: true });
      return false;
    }
    return true;
  }

  onSubmit = async () => {
    const { groupName } = this.state;
    if (!this.checkFormData(groupName)) {
      return;
    }
    if (this.submiting) return;
    this.submiting = true;
    wx.showLoading({ title: '请稍后', mask: true });
    try {
      const res = await createGroup({ groupName });
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
      setTimeout(() => wx.redirectTo({ url: `/pages/ShowPassWd/index?passWd=${encodeURIComponent(passWd)}&type=group` }), 1500);
    } catch (e) {
      this.submiting = false;
      wx.hideLoading();
      adLog.warn('EditAttnd-error', e);
      if (typeof e === 'object' && e.errCode === 5001) {
        Taro.adToast({ text: '操作频繁，请稍后再试～' });
        return;
      }
      Taro.adToast({ text: '发起失败' });
    }
  }

  render() {
    const { groupName, isGroupNameErr, submiting } = this.state;
    const desc1 = '* 在线创建小组';
    const desc2 = '* 小组可作为考勤的预设名单';
    return (
      <View className="edit-group">
        <View className="edit-group__title">创建小组</View>
        <View>
          <View className="edit-group__desc">{desc1}</View>
          <View className="edit-group__desc">{desc2}</View>
        </View>
        <View className="edit-group__input">
          <AtInput
            type='text'
            placeholder='输入小组名称'
            placeholderStyle="color: #cccccc"
            error={isGroupNameErr}
            maxLength={150}
            value={groupName}
            onChange={this.onInputChange}
          />
        </View>
        <View className="edit-group__btn">
          <AtButton
            type="primary"
            loading={submiting}
            onClick={this.onSubmit}
          >立即创建
          </AtButton>
        </View>
        <AdToast />
      </View>
    )
  }

}