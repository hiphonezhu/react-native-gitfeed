const React = require('react-native');
const Routes = require('./Routes');
const MenuComponent = require('../AndroidComponents/RootMenuComponent');
const OnboardComponent = require('./OnboardComponent');
const ScrollableTabView = require('react-native-scrollable-tab-view'); // 标签导航, see[https://www.npmjs.com/package/react-native-scrollable-tab-view]
const TabBar = require('./TabBar.android');

const {
  AppRegistry,
  BackAndroid,
  Dimensions,
  DrawerLayoutAndroid,
  StyleSheet,
  ToolbarAndroid,
  View,
} = React;

/**
 * 首页
 */
const UIExplorerApp = React.createClass({
  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <ScrollableTabView
          renderTabBar={() => <TabBar />}
          tabBarPosition={'bottom'}
          >
          {Routes.navigator('feed', TabBar)}
          {Routes.navigator('explore')}
          {Routes.navigator('trend')}
          {Routes.navigator('me')}
        </ScrollableTabView>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#E9EAED',
    height: 56,
  },
});

module.exports = UIExplorerApp;
