import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import AdToast from '../../components/AdToast';
import { getAttndByPassWd } from '../../services/attnd';
import { getGroupByPassWd } from '../../services/group';
import * as adLog from '../../utils/adLog';
import './index.less';

export default class FindAttnd extends Component {

  config = {
    navigationBarTitleText: '查找考勤或小组'
  }

  state = {
    passWd: '',
    isPassWdErr: false
  }

  confirmLoading = false;

  onInputChange = (value) => {
    this.setState({
      passWd: value,
      isPassWdErr: false
    });
  }

  checkFormData = (passWd) => {
    if (!passWd.trim()) {
      Taro.adToast({ text: '口令不能为空' });
      this.setState({ isPassWdErr: true });
      return false;
    }
    return true;
  }

  onConfirm = () => {
    const { passWd } = this.state;
    if (this.confirmLoading) return;
    if (!this.checkFormData(passWd)) {
      return;
    }
    if (passWd[0] === '#') {
      this.findGroup(passWd);
    } else {
      this.findAttnd(passWd);
    }
  }

  findAttnd = async (passWd) => {
    this.confirmLoading = true;
    // 查询考勤是否存在
    try {
      wx.showLoading({ title: '请稍后', mask: true });
      const res = await getAttndByPassWd({ passWd });
      this.confirmLoading = false;

      // 考勤不存在
      if (res.code === 3001) {
        wx.hideLoading();
        Taro.adToast({ text: '抱歉，考勤不存在，请输入正确的口令', duration: 2500 });
        return;
      }

      wx.hideLoading();
      wx.redirectTo({ url: `/pages/SignIn/index?passWd=${encodeURIComponent(passWd)}` });
    } catch (e) {
      this.confirmLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '抱歉，查找考勤出现了问题' });
      adLog.warn('findAttnd-error', e);
    }
  }

  findGroup = async (passWd) => {
    this.confirmLoading = true;
    // 查询小组是否存在
    try {
      wx.showLoading({ title: '请稍后', mask: true });
      const res = await getGroupByPassWd({ passWd });
      this.confirmLoading = false;

      // 小组不存在
      if (res.code === 3001) {
        wx.hideLoading();
        Taro.adToast({ text: '抱歉，小组不存在，请输入正确的口令', duration: 2500 });
        return;
      }

      wx.hideLoading();
      wx.redirectTo({ url: `/pages/JoinIn/index?passWd=${encodeURIComponent(passWd)}` });
    } catch (e) {
      this.confirmLoading = false;
      wx.hideLoading();
      Taro.adToast({ text: '抱歉，查找小组出现了问题' });
      adLog.warn('findGroup-error', e);
    }
  }

  render() {
    const { isPassWdErr } = this.state;
    return (
      <View className="find-attnd">
        <View className="find-attnd__title">输入口令</View>
        <View className="find-attnd__desc">* 向考勤者索要口令</View>
        <View className="find-attnd__input">
          <AtInput
            type='text'
            placeholder='输入口令'
            placeholderStyle="color: #cccccc"
            maxLength={150}
            error={isPassWdErr}
            value={this.state.passWd}
            onChange={this.onInputChange}
          />
        </View>
        <View className="find-attnd__btn">
          <AtButton type="primary" onClick={this.onConfirm}>确定</AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
