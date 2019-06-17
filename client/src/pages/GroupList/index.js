import { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import AttndList from '../../components/AttndList';
import * as adLog from '../../utils/adLog';
import { getGroupListByOpenId } from '../../services/group';
import { formatDate } from '../../utils/func';
import './index.less';

export default class GroupList extends Component {

  config = {
    navigationBarTitleText: '我的小组'
  }

  constructor() {
    try {
      var { windowHeight } = wx.getSystemInfoSync();
    } catch (e) {
      console.log(e);
    }
    this.state = {
      listHeight: windowHeight || 0,
      groupData: [],
      groupHasMore: true,
      groupOffsetId: null,
    };
  }

  groupLoading = false;

  componentDidMount() {
    this.getGroupList();
  }

  getGroupList = async (offset = 0) => {
    try {
      const { groupOffsetId, groupData } = this.state;
      // 请求第 1 页时激活 loadMore 节点
      if (offset === 0) {
        this.setState({ groupHasMore: true });
      }
      if (this.groupLoading) return;
      this.groupLoading = true;

      const {
        data: { hasMore, offsetId, list }
      } = await getGroupListByOpenId({
        offset,
        offsetId: groupOffsetId
      });

      // offset === 0 时更新偏移基准 offsetId
      if (offset === 0 && offsetId) {
        this.setState({ groupOffsetId: offsetId });
      }

      this.setState({
        groupData: offset === 0 ? list : groupData.concat(list),
        groupHasMore: hasMore
      });
    } catch (e) {
      adLog.log('getGroupList-error', e);
    }
    this.groupLoading = false;
  }

  onGroupLoadMore = async () => {
    const offset = this.state.groupData.length;
    this.getGroupList(offset);
  }

  onOptClick = () => wx.navigateTo({ url: '/pages/EditGroup/index' });

  getComputeGroupData = (data = []) => {
    return data.map(item => ({
      key: item._id,
      title: item.groupName,
      desc1: `口令：${item.passWd || 'loading..'}`,
      desc2: `发起者：${item.hostName || 'loading..'}`,
      desc3: `时间：${formatDate(item.createTime) || 'loading..'}`,
      tag: item.groupStatus===1 ? { active: true, text: '邀请中' } : { active: false, text: '已完成' }
    }));
  }

  onGroupItemClick = (index) => {
    const { groupData } = this.state;
    const passWd = groupData[index] ? groupData[index].passWd : '';
    if (!passWd) {
      return;
    }
    wx.navigateTo({ url: `/pages/JoinIn/index?passWd=${encodeURIComponent(passWd)}` });
  }

  render() {
    const { listHeight, groupData, groupHasMore } = this.state;
    const computeGroupData = this.getComputeGroupData(groupData);

    return (
      <View className="group-list">
        <AttndList
          height={listHeight}
          data={computeGroupData}
          hasMore={groupHasMore}
          onLoadMore={this.onGroupLoadMore}
          onItemClick={this.onGroupItemClick}
        />
        <View className="group-list__opt" onClick={this.onOptClick} />
      </View>
    );
  }
}