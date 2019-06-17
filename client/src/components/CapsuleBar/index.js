import { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import imgBack from '../../assets/images/back.png';
import imgGoHome from '../../assets/images/go-home.png';
import './index.less';

export default class CapsuleBar extends Component {

  static defaultProps = {
    title: 'Attnd',
    onCapsuleInit: () => { }
  }

  constructor() {
    try {
      var {
        width: capsuleWidth,
        height: capsuleHeight,
        top: capsuleTop
      } = wx.getMenuButtonBoundingClientRect();
      var { statusBarHeight } = wx.getSystemInfoSync();
      var capsulePadding = capsuleTop - statusBarHeight;
      var navBarHeight = capsuleHeight + 2 * capsulePadding;
    } catch (e) {
      console.log(e);
    }
    this.state = {
      capsuleWidth: capsuleWidth || 0,
      capsuleHeight: capsuleHeight || 0,
      navBarHeight: navBarHeight || 0,
      capsulePadding: capsulePadding || 0,
      statusBarHeight: statusBarHeight || 0
    };
  }

  componentDidMount() {
    const { navBarHeight, statusBarHeight } = this.state;
    const capsuleBarHeight = navBarHeight + statusBarHeight;
    this.props.onCapsuleInit(capsuleBarHeight);
  }

  goBack = () => wx.navigateBack();

  goHome = () => wx.switchTab({ url: '/pages/Home/index' });

  render() {
    const { capsuleWidth, capsuleHeight, navBarHeight, capsulePadding, statusBarHeight } = this.state;
    const { title } = this.props;
    return (
      <View className="capsule-bar">
        <View className="capsule-bar__statusbar" style={{ height: `${statusBarHeight}px` }}></View>
        <View className="capsule-bar__nav" style={{ height: `${navBarHeight}px` }}>
          <View className="capsule-bar__capsule" style={{ top: `${capsulePadding}px` }}>
            <View
              className="capsule-bar__capsule--left"
              style={{
                height: `${capsuleHeight}px`,
                width: `${capsuleWidth / 2}px`,
                borderTopLeftRadius: `${capsuleHeight / 2}px`,
                borderBottomLeftRadius: `${capsuleHeight / 2}px`
              }}
              onClick={this.goBack}
            >
              <View className="capsule-bar__capsule--iconleft">
                <Image src={imgBack} style={{ width: '20px', height: '20px' }} />
              </View>
            </View>
            <View
              className="capsule-bar__capsule--right"
              style={{
                height: `${capsuleHeight}px`,
                width: `${capsuleWidth / 2}px`,
                borderTopRightRadius: `${capsuleHeight / 2}px`,
                borderBottomRightRadius: `${capsuleHeight / 2}px`
              }}
              onClick={this.goHome}
            >
              <View className="capsule-bar__capsule--iconright">
                <Image src={imgGoHome} style={{ width: '20px', height: '20px' }} />
              </View>
            </View>
          </View>
          <View className="capsule-bar__nav--title">{title}</View>
        </View>
      </View>
    );
  }
}
