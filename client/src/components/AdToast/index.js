import Taro, { Component } from '@tarojs/taro';
import { AtToast } from 'taro-ui';

export default class AdToast extends Component {

  state = {
    isOpened: false,
    text: '',
    status: '',
    duration: 2000,
    hasMark: true
  }

  timer = null;

  componentDidShow() {
    this.bindToastListener();
  }

  componentDidMount() {
    this.bindToastListener();
  }

  componentDidHide() {
    Taro.eventCenter.off('adToast');
  }

  componentWillUnmount() {
    Taro.eventCenter.off('adToast');
  }

  bindToastListener = () => {
    Taro.eventCenter.on('adToast', (options = {}, callback = () => { }) => {
      const { text, status = '', duration = 1500, hasMark = true } = options;
      // success 换成微信的原生 toast
      if (status === 'success') {
        this.setState({ isOpened: false });
        Taro.showToast({
          title: text,
          icon: 'success',
          duration,
          mask: hasMark
        });
        setTimeout(callback, duration);
        return;
      }
      this.setState({ isOpened: true, text, status, duration, hasMark }, () => {
        Taro.hideToast();
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setState({ isOpened: false });
          callback();
        }, duration);
      });
    });
    Taro.adToast = Taro.eventCenter.trigger.bind(Taro.eventCenter, 'adToast');
  }

  render() {
    const { isOpened, text, status, duration, hasMark } = this.state;
    return (
      <AtToast
        isOpened={isOpened}
        text={text}
        status={status}
        duration={duration}
        hasMask={hasMark}
      />
    );
  }
}

