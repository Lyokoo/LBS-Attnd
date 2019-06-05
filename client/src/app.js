import Taro, { Component } from '@tarojs/taro';
import '@tarojs/async-await';
import "taro-ui/dist/style/index.scss";
import './app.less';

class App extends Component {

  config = {
    pages: [
      'pages/Home/index',
      'pages/List/index',
      'pages/Profile/index',
      'pages/EditAttnd/index',
      'pages/FindAttnd/index',
      'pages/EditAuth/index',
      'pages/EditUserInfo/index',
      'pages/SignIn/index',
      'pages/ShowPassWd/index',
      'pages/About/index',
      'pages/ShowLocation/index',
      'pages/UpdateLog/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    permission: {
      'scope.userLocation': {
        desc: "你的位置信息将用于小程序位置接口的效果展示"
      }
    },
    navigateToMiniProgramAppIdList: [
      'wx18a2ac992306a5a4'
    ],
    tabBar: {
      color: '#6d6d6d',
      selectedColor: '#78a4fa',
      // borderStyle: 'white',
      // backgroundColor:'#f7f7f7',
      list: [
        {
          pagePath: 'pages/Home/index',
          text: '考勤',
          iconPath: 'assets/images/home.png',
          selectedIconPath: 'assets/images/home-active.png'
        },
        {
          pagePath: 'pages/List/index',
          text: '记录',
          iconPath: 'assets/images/list.png',
          selectedIconPath: 'assets/images/list-active.png'
        },
        {
          pagePath: 'pages/Profile/index',
          text: '我的',
          iconPath: 'assets/images/profile.png',
          selectedIconPath: 'assets/images/profile-active.png'
        }
      ]
    }
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      wx.cloud.init({
        env: 'envlzp-110d2c',
        traceUser: true
      });
    }

    this.checkUpdate();

    // 弹窗询问用户是否同意授权小程序使用地理位置
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({ scope: 'scope.userLocation' });
        }
      }
    });
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  checkUpdate = () => {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      console.log('hasUpdate', res.hasUpdate)
    })

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: res => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
      console.log('new version download fail');
    });
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Home />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
