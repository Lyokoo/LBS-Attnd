import Taro, { Component } from '@tarojs/taro';
import { View, Map } from '@tarojs/components';

export default class ShowLocation extends Component {

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
        fontSize: '14px',
        borderWidth: '1px',
        borderRadius: '6px',
        padding: '10px',
        color: '#000',
        bgColor: '#fff'
      }
    }
    const circle = {
      ...hostLoc,
      color: '#6190e8',
      fillColor: '#78a4fa55',
      radius: 200,
      strokeWidth: 1
    }
    return (
      <View className="show-location">
        {/* includePoints={[hostLoc, signinerLoc]} */}
        <Map
          style={{ width: '100%', height: '100vh' }}
          longitude={hostLoc.longitude}
          latitude={hostLoc.latitude}
          scale={16}
          markers={[hostMarker]}
          circles={[circle]}
          showLocation={true}
          showCompass={true}
          enableOverlooking={true}
          enableRotate={true}
          enable3D={true}
          skew={1}
        />
      </View>
    )
  }
}
