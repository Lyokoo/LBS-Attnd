import { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import SigninInfo from '../SigninInfo';
import { AtActionSheet, AtActionSheetItem  } from 'taro-ui';
import { SigninerStatus } from '../../../utils/consts';
import './index.less';

export default class AttndList extends Component {

  static defaultProps = {
    height: 0,
    data: {
      listData: [],
      hasMore: true
    },
    attndBelonging: false,
    onLoadMore: () => { },
    onAttndRefresh: () => { },
    onShowLocation: () => { },
    onAttndDelete: () => { },
    onStatusUpdate: () => { }
  }

  state = {
    isActionSheetOpened: false,
    signinerName: '',
    signinerOpenId: ''
  }

  onLoadMore = () => {
    console.log('loadmore');
  }

  onStatusClick = ({ signinerOpenId, signinerName }) => {
    this.setState({
      isActionSheetOpened: true,
      signinerName,
      signinerOpenId
    });
  }

  onActionClick = (signinerStatus) => {
    const { signinerOpenId } = this.state;
    this.setState({ isActionSheetOpened: false });
    this.props.onStatusUpdate({ signinerOpenId, signinerStatus });
  }

  render() {
    const { data, height, attndBelonging } = this.props;
    const count = data.listData.length > 999 ? '999+' : data.listData.length;
    const { signinerName, isActionSheetOpened } = this.state;
    return (
      <View className="signin-list">
        <ScrollView
          style={{ height: `${height}px` }}
          scrollY
          lowerThreshold={50}
          enableBackToTop
          onScrollToLower={this.onLoadMore}
        >
          <View className="signin-list__content">
            <View className="signin-list__content--bar">
              <View className="signin-list__content--count">人数: {count}</View>
              <View className="signin-list__content--opt">
                {attndBelonging && <View className="signin-list__content--link" onClick={this.props.onAttndDelete}>删除考勤</View>}
                <View className="signin-list__content--link" onClick={this.props.onShowLocation}>查看位置</View>
                <View className="signin-list__content--link" onClick={this.props.onAttndRefresh}>刷新</View>
              </View>
            </View>
            {data.listData.length === 0 ?
              <View className="signin-list__hint">暂时还没有人签到，可点击页面右上角菜单转发到群聊邀请签到...</View>
              : data.listData.map(item => (
                <View className="signin-list__content--item" key={item}>
                  <SigninInfo
                    item={item}
                    attndBelonging={attndBelonging}
                    onStatusClick={this.onStatusClick}
                  />
                </View>
              ))}
          </View>
          {/* <LoadMore hasMore={data.hasMore}/> */}
        </ScrollView>
        <AtActionSheet isOpened={isActionSheetOpened} cancelText='取消' title={`修改“${signinerName}”的签到状态`}>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.ARRIVED)}>已到</AtActionSheetItem>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.UN_SIGNIN)}>未到</AtActionSheetItem>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.LATE)}>迟到</AtActionSheetItem>
          <AtActionSheetItem onClick={()=>this.onActionClick(SigninerStatus.OUT_OF_DIST)}>超出距离</AtActionSheetItem>        
        </AtActionSheet>
      </View>
    )
  }
}
