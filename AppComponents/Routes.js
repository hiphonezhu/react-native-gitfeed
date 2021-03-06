const React = require('react-native');
const Icon = require('react-native-vector-icons/Ionicons');
const cssVar = require('cssVar');
const Colors = require('../commonComponents/Colors');
const GHService = require('../networkService/GithubServices');
const Dimensions = require('Dimensions');
const ScreenWidth = Dimensions.get('window').width;
const DXRNUtils = require('../commonComponents/DXRNUtils');
const NavigatorNavigationBarStyle = require('./GHNavigatorBarStyle.android');
const Platform = require('Platform');

const {UserComponent} = require('./UserComponent');
const GHWebComponent = require('./GithubWebComponent');
const UserListComponent = require('./UserListComponent');
const FeedComponent = require('./FeedComponent');
const LoginComponent = require('./LoginComponent');
const OrgComponent = require('./OrgComponent');
const PersonalComponent = require('./PersonalComponent');
const SettingsComponent = require('./SettingsComponent');
const RepoListComponent = require('./RepoListComponent');
const ExploreComponent = require('./ExploreComponent');
const SearchComponent = require('./SearchComponent');
const ShowCaseComponent = require('./ShowcaseComponent');
const TrendsComponent = require('./TrendsComponent');
const EditProfileComponent = require('./EditProfileComponent')
const PubSub = require('pubsub-js');

const {
  Navigator,
	TouchableOpacity,
	StyleSheet,
	PixelRatio,
	Text,
  TextInput,
  View,
  BackAndroid,
} = React;

const NavigationBarRouteMapper = {
  /**
   * 左边按钮
   */
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0 || route.id === 'login') {
      return null;
    } else if(route.id == 'editprofile') {
      return (
        <TouchableOpacity onPress={route.pressCancel}>
          <Text style={[styles.navBarText, {marginRight: 10,marginLeft:10}]}>
            Cancel
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Icon
          name='ios-arrow-back'
          size={30}
          style={{marginTop: 8}}
          color={Colors.blue}
        />
      </TouchableOpacity>
    );
  },

  /**
   * 右边按钮
   */
  RightButton: function(route, navigator, index, navState) {
    let rightButton;
    switch (route.id) {
      case 'login': {
        rightButton = (
          <TouchableOpacity onPress={() => navigator.pop()}>
            <Text style={[styles.navBarText, {marginRight: 10}]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )
      }
        break;
      case 'editprofile':
        rightButton = (
            <TouchableOpacity onPress={route.pressSave}>
              <Text style={[styles.navBarText, {marginRight: 10}]}>
                Save
              </Text>
            </TouchableOpacity>
        )
        break;
      case 'web':
        if (Platform.OS === 'ios') {
          rightButton = (
              <TouchableOpacity
                onPress={route.onShare}
                style={{width: 40, height: 40}}>
                <Icon
                  name='share'
                  size={30}
                  style={{paddingLeft: 10, marginTop: 8}}
                  color={Colors.blue}
                />
              </TouchableOpacity>
          )
        }
        break;
      default:
    }

    return rightButton;
  },

  /**
   * 标题
   */
  Title: function(route, navigator, index, navState) {
    let title;
    switch (route.id) {
      case 'feed':
        title = 'Feed';
        break;
      case 'repo':
        title = route.obj.name;
        break;
      case 'user':
        title = route.obj.login;
        break;
      case 'web':
        title = route.obj.title;
        break;
      case 'userList':
        title = route.obj.title;
        break;
      case 'login':
        title = route.title;
        break;
      case 'org':
        title = 'org';
        break;
      case 'me':
        title = 'Me';
        break;
      case 'watching':
        title = 'Watching';
        break;
      case 'settings':
        title = "Settings";
        break;
      case 'repos':
        title = route.obj.title;
        break;
      case 'explore':
        title = 'Popular Repos';
        break;
      case 'search':
        title = 'search';
        break;
      case 'showcase':
        title = route.obj.name;
        break;
      case 'trend':
        title = 'Popular Users';
        break;
      case 'editprofile':
        title = 'Edit Profile';
        break;
    }

    const searchPlaceholder = 'Search users, repos';
    if (title == 'Feed') {
      return (
        <TouchableOpacity
          style={[styles.searchBar, {justifyContent: 'center'}]}
          onPress={() => {
            if (route.id == 'feed') {
              DXRNUtils.trackClick('clickSearch', {name: '点击搜索'});
              navigator.push({id: 'search'});
            }
          }}
          >
          <Icon
            name={'ios-search'}
            size={20}
            style={styles.searchIcon}
            color={Colors.black}
          />
          <Text style={[styles.textInput, {alignSelf: 'center', flex: 0}]}>
            {searchPlaceholder}
          </Text>
        </TouchableOpacity>
      )
    } else if (title == 'search') {
      let fontSize = 14;
      if (Platform.OS == 'android') {
        fontSize = 12;
      }
      return (
        <View style={[styles.searchBar, {width: ScreenWidth - 40, marginLeft: 40}]}>
          <Icon
            name={'ios-search'}
            size={20}
            style={styles.searchIcon}
            color={Colors.black}
          />
          <TextInput
            style={[styles.textInput, {fontSize: fontSize}]}
            placeholder={searchPlaceholder}
            autoFocus={true}
            onChangeText={route.sp.onChangeText}
            onSubmitEditing={route.sp.onSubmitEditing}
            clearButtonMode={'while-editing'}
            />
        </View>
      )
    } else {
      return (
        <Text style={[styles.navBarText,
                      styles.navBarTitleText,
                      {width: 250, height: 40, textAlign: 'center'}]}
              numberOfLines={1}>
          {title}
        </Text>
      );
    }
  },
};

const routes = {
  
  // 为每个tab生成一个导航控制器
	navigator(initialRoute) {
		return (
      /**
       * initialRoute 默认显示的路由
       * renderScene 根据路由和导航来渲染场景
       * configureScene 配置场景的动画和手势
       * navigationBar 提供一个在场景切换的时候保持的导航栏
       */
			<Navigator
				initialRoute={{id: initialRoute}}
				renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
				navigationBar={
					<Navigator.NavigationBar
						routeMapper={NavigationBarRouteMapper}
						style={styles.navBar}
            navigationStyles={NavigatorNavigationBarStyle}
					/>
				}
        tabLabel={this._tabObjForRoute(initialRoute)}
			/>
		);
	},

  /**
   * tab的文字和图片
   */
  _tabObjForRoute(routeName) {
    let tab = {tabName: 'Feed', iconName: 'ios-home'};
    switch (routeName) {
      case 'feed':
        tab = {tabName: 'Feed', iconName: 'ios-home'};
        break;
      case 'explore':
        tab = {tabName: 'Explore', iconName: 'ios-flame'};
        break;
      case 'trend':
        tab = {tabName: 'Famous', iconName: 'ios-people'};
        break;
      case 'me':
        tab = {tabName: 'Me', iconName: 'ios-person'};
        break;
    }

    return tab;
  },

  /**
   * 根据路由和导航来渲染场景
   */
	renderScene(route, navigator) {
    DXRNUtils.trackClick('渲染现实的页面' + route.id);
    /**
     * 返回事件
     */
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
      }
      return false;
    });

		switch (route.id) {
      case 'feed':
        PubSub.publish('onHiddenChanged', false);
        // 将导航器通过FeedComponent的props.navigator进行传递
        return <FeedComponent navigator={navigator} tabLabel="Daily"/>;
      case 'user':
        PubSub.publish('onHiddenChanged', true);
        return <UserComponent user={route.obj} navigator={navigator}/>;
      case 'web':
        PubSub.publish('onHiddenChanged', true);
        return (
          <GHWebComponent
            webURL={route.obj.html}
            param={route.obj}
            navigator={navigator}
            route={route}/>
        );
      case 'userList':
        PubSub.publish('onHiddenChanged', true);
        return <UserListComponent userListURL={route.obj.url} navigator={navigator}/>;
      case 'login':
        PubSub.publish('onHiddenChanged', true);
        return (
          <LoginComponent
            navigator={navigator}
            nextPromise={route.nextPromiseFunc}
            />
        )
      case 'org':
        PubSub.publish('onHiddenChanged', true);
        return <OrgComponent navigator={navigator} org={route.obj}/>;
      case 'me':
        PubSub.publish('onHiddenChanged', false);
        return <PersonalComponent navigator={navigator} tabLabel="Me"/>;
      case 'settings':
        PubSub.publish('onHiddenChanged', true);
        return <SettingsComponent navigator={navigator}/>;
      case 'repos':
        PubSub.publish('onHiddenChanged', true);
        return <RepoListComponent navigator={navigator} repoListURL={route.obj.url}/>;
      case 'explore':
        PubSub.publish('onHiddenChanged', false);
        return <ExploreComponent navigator={navigator} tabLabel="Explore"/>;
      case 'search':
        /**
         * Here's a little tricky for pass the textInput's onChangeText callback
         *
         * I do it by several steps:
         * 1. pass the route to SearchComponent's props
         * 2. in SearchComponent's componentWillMount pass it to route
         * 3. in Navigator's renderTitle, use SearchComponent's onChangeText for
         * 		callback
         *
         * Maybe some RN version will change Navigator's renderScene and renderTitle
         * So need some better approach.
         */
        PubSub.publish('onHiddenChanged', true);
        return <SearchComponent navigator={navigator} route={route}/>;
      case 'showcase':
        PubSub.publish('onHiddenChanged', true);
        return <ShowCaseComponent navigator={navigator} showcase={route.obj}/>;
      case 'trend':
        PubSub.publish('onHiddenChanged', false);
        return <TrendsComponent navigator={navigator} tabLabel="Trend"/>;
      case 'editprofile':
        PubSub.publish('onHiddenChanged', true);
        return <EditProfileComponent navigator={navigator} route={route}/>;
    }

    return null;
	}
}

const styles = StyleSheet.create({
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1 / PixelRatio.get(),
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
    borderBottomColor: Colors.borderColor,
    borderBottomWidth: 0.5,
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: cssVar('fbui-bluegray-60'),
    fontWeight: '500',
    marginVertical: 11,
  },
  navBarLeftButton: {
    paddingLeft: 10,
    width: 40,
    height: 40,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: cssVar('fbui-accent-blue'),
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  searchBar: {
    padding: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: ScreenWidth - 10,
    height: 35,
    // borderWidth: 1,
    // borderColor: Colors.borderColor,
    borderRadius: 4,
    margin: 5,
    backgroundColor: Colors.backGray,
  },
  searchIcon: {
    marginLeft: 3,
    marginRight: 3,
    width: 20,
    height: 20
  },
  textInput: {
    fontSize: 14,
    alignSelf: 'stretch',
    flex: 1,
    color: Colors.black,
  },
});

module.exports = routes;
