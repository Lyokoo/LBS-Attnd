import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton } from 'taro-ui';
import AdToast from '../../components/AdToast';
import { getAttndByPassWd } from '../../services/attnd';
import './index.less';

export default class FindAttnd extends Component {

  config = {
    navigationBarTitleText: '查找考勤'
  }

  state = {
    passWd: '',
    confirmLoading: false,
    isPassWdErr: false
  }

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

  onConfirm = async () => {
    const { passWd, confirmLoading } = this.state;
    if (confirmLoading) return;
    if (!this.checkFormData(passWd)) {
      return;
    }
    this.setState({ confirmLoading: true });
    // 查询考勤是否存在
    try {
      wx.showLoading({ title: '请稍后', mask: true });
      const res = await getAttndByPassWd({ passWd });

      // 考勤不存在
      if (res.code === 3001) {
        this.setState({ confirmLoading: false });
        wx.hideLoading();
        Taro.adToast({ text: '抱歉，考勤不存在，请输入正确的口令', duration: 2500 });
        return;
      }

      this.setState({ confirmLoading: false });
      wx.hideLoading();
      wx.redirectTo({ url: `/pages/SignIn/index?passWd=${passWd}` });
    } catch (e) {
      this.setState({ confirmLoading: false });
      wx.hideLoading();
      Taro.adToast({ text: '抱歉，查找考勤出现了问题' });
    }
  }

  render() {
    const { isPassWdErr } = this.state;
    return (
      <View className="find-attnd">
        <View className="find-attnd__title">输入签到口令</View>
        <View className="find-attnd__desc">* 向发起考勤者索要签到口令</View>
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
