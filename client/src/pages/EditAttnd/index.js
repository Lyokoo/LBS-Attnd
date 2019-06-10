import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import AdToast from '../../components/AdToast';
import { getLocation, getAddress } from '../../services/location';
import { createAttnd } from '../../services/attnd';
import * as adLog from '../../utils/adLog';
import './index.less';

export default class EditAttnd extends Component {

  config = {
    navigationBarTitleText: '发起考勤'
  }

  state = {
    attndName: '',
    isAttndNameErr: false,
    submiting: false
  }

  onInputChange = (value) => {
    this.setState({
      attndName: value,
      isAttndNameErr: false
    });
  }

  checkFormData = (attndName) => {
    if (!attndName.trim()) {
      Taro.adToast({ text: '名称不能为空' });
      this.setState({ isAttndNameErr: true });
      return false;
    }
    return true;
  }

  onSubmit = async () => {
    const { attndName, submiting } = this.state;
    if (!this.checkFormData(attndName)) {
      return;
    }
    if (submiting) return;
    this.setState({ submiting: true });

    try {
      // 获取地理位置
      const [location1, location2] = await Promise.all([getLocation(), getLocation()]);
      const location = await getLocation();

      // 未授权获取位置
      if (!location) {
        wx.navigateTo({ url: '/pages/EditAuth/index' });
        this.setState({ submiting: false });
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
        tmpLocation: [location1, location2]
      });

      // 未填写个人信息
      if (res.code === 3003) {
        wx.showModal({
          title: '个人信息',
          content: '请完善个人信息',
          confirmText: '前往',
          confirmColor: '#78a4fa',
          success: res => res.confirm && wx.navigateTo({ url: '/pages/EditUserInfo/index' })
        });
        this.setState({ submiting: false });
        return;
      }

      const passWd = res.data.passWd;
      Taro.adToast({ text: '发起成功', status: 'success' });
      setTimeout(() => wx.redirectTo({ url: `/pages/ShowPassWd/index?passWd=${passWd}` }), 1500);
    } catch (e) {
      adLog.warn('EditAttnd-error', e);
      if (typeof e === 'object' && e.errCode === 5001) {
        Taro.adToast({ text: '操作频繁，请稍后再试～' });
        return;
      }
      Taro.adToast({ text: '发起失败' });
    }
    this.setState({ submiting: false });
  }

  render() {
    const { attndName, isAttndNameErr, submiting } = this.state;
    return (
      <View className="edit-attnd">
        <View className="edit-attnd__title">发起考勤</View>
        <View>
          <View className="edit-attnd__desc">* 小程序通过 GPS 定位，确定考勤有效范围是以你当前位置为中心的方圆 200 米，在有效范围内完成签到者视为已到</View>
          {/* <View className="edit-attnd__desc">* 签到人数上限为 100 人</View> */}
        </View>
        <View className="edit-attnd__input">
          <AtInput
            type='text'
            placeholder='输入考勤名称 例如: 计网-计科151'
            placeholderStyle="color: #cccccc"
            error={isAttndNameErr}
            maxLength={150}
            value={attndName}
            onChange={this.onInputChange}
          />
        </View>
        <View className="edit-attnd__btn">
          <AtButton
            type="primary"
            loading={submiting}
            onClick={this.onSubmit}
          >立即发起
          </AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
