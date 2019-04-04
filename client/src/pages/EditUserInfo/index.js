import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtForm, AtInput, AtButton } from 'taro-ui';
import { updateUserInfo, getUserInfo } from '../../services/userInfo';
import { AdToast } from '../../components/AdToast';
import { isStuIdValid } from '../../utils/func';
import './index.less';

const checkData = (name, stuId) => {
  if (!name) {
    Taro.adToast({ text: '姓名不能为空' });
    return false;
  }
  if (!isStuIdValid(stuId)) {
    Taro.adToast({ text: '学号/工号只能为字母、数字和横杠' });
    return false;
  }
  return true;
}

export default class EditUserInfo extends Component {

  config = {
    navigationBarTitleText: '个人信息'
  }

  state = {
    name: '',
    stuId: '',
    pulling: false,
    submiting: false
  }

  componentDidMount() {
    this.getUserInfo();
  }

  onNameChange = (value) => {
    this.setState({ name: value });
  }

  onStuIdChange = (value) => {
    this.setState({ stuId: value });
  }

  getUserInfo = async () => {
    const { pulling } = this.state;
    if (pulling) return;
    this.setState({ pulling: true });
    Taro.showNavigationBarLoading();
    try {
      const result = await getUserInfo();
      if (result.code === 2000) {
        const { name, stuId } = result.data;
        this.setState({ name, stuId });
      }
    } catch (e) {}
    // 此处为了交互体验稍加延时
    setTimeout(() => {
      this.setState({ pulling: false });
      Taro.hideNavigationBarLoading();
    }, 500);
  }

  onSubmit = async () => {
    const { name, stuId, submiting, pulling } = this.state;
    if (!checkData(name, stuId)) {
      return;
    }
    if (submiting || pulling) return;
    this.setState({ submiting: true });
    try {
      await updateUserInfo({ name, stuId });
      Taro.adToast({ text: '保存成功', status: 'success' });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (e) {
      Taro.adToast({ text: '保存失败', status: 'error' });
    }
    this.setState({ submiting: false });
  }

  render() {
    const { submiting, name, stuId } = this.state;
    return (
      <View className="edit-userinfo">
        <View className="edit-userinfo__form">
          <AtForm>
            <AtInput
              title='姓名'
              type='text'
              placeholder="填写真实姓名（必填）"
              placeholderStyle="color: #cccccc"
              maxLength={150}
              value={name}
              onChange={this.onNameChange}
            />
            <AtInput
              title='学号/工号'
              type='text'
              placeholder="填写学号或工号"
              placeholderStyle="color: #cccccc"
              maxLength={150}
              border={false}
              value={stuId}
              onChange={this.onStuIdChange}
            />
          </AtForm>
        </View>
        <View className="edit-userinfo__btn">
          <AtButton
            type="primary"
            loading={submiting}
            onClick={this.onSubmit}
          >保存
          </AtButton>
        </View>
        <AdToast />
      </View>
    )
  }
}
