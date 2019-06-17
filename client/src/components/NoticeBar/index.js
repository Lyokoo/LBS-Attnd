import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtNoticebar } from 'taro-ui';
import * as adLog from '../../utils/adLog';

export default class NoticeBar extends Component {

  static defaultProps = {
    type: 'signin',
    onNoticeInit: () => { }
  }

  constructor() {
    try {
      const { windowWidth } = wx.getSystemInfoSync();
      const rpx = windowWidth / 750;
      this.height = 60 * rpx;
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    this.getNotice();
  }

  getNotice = async () => {
    const { type } = this.props;
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'getNotice',
        data: { type }
      });
      const content = result.data.content || '';
      adLog.log('getNotice-result', content);
      this.setState({ notice: content });
      const noticeBarHeight = content ? this.height : 0;
      this.props.onNoticeInit(noticeBarHeight);
    } catch (e) {
      adLog.log('getNotice-error', e);
      this.setState({ notice: '' });
      this.props.onNoticeInit(0);
    }
  }

  render() {
    const { notice } = this.state;
    return notice && (
      <AtNoticebar icon="volume-plus" single marquee speed={50}>{notice}</AtNoticebar>
    );
  }
}