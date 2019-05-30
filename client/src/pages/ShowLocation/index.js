import Taro, { Component } from '@tarojs/taro';
import { View, Map } from '@tarojs/components';

export default class ShowPassWd extends Component {

  config = {
    navigationBarTitleText: '位置'
  }

  state = {
    hostLoc: {},
    signinerLoc: {},
    address: ''
  }

  componentWillMount() {
    const { hostLoc, signinerLoc } = this.$router.params;
    this.setState({
      hostLoc: JSON.parse(hostLoc),
      signinerLoc: JSON.parse(signinerLoc)
    });
  }

  render() {
    const { hostLoc, signinerLoc } = this.state;
    const hostMarker = {
      id: 0,
      ...hostLoc,
      callout: {
        content: '考勤地点',
        display: 'ALWAYS',
        fontSize: '16px',
        borderWidth: '1px',
        borderColor: '#ebebeb',
        borderRadius: '6px',
        padding: '10px',
        color: '#000',
        bgColor: '#fff'
      }
    }
    return (
      <View className="show-location">
        {/* includePoints={[hostLoc, signinerLoc]} */}
        <Map
          style={{ width: '100%', height: '100vh' }}
          longitude={hostLoc.longitude}
          latitude={hostLoc.latitude}
          scale={17}
          markers={[hostMarker]}
          showLocation={true}
        />
      </View>
    )
  }
}
