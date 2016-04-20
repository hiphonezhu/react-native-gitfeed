const React = require('react-native');
const Colors = require('./Colors');
const CommonStyles = require('./CommonStyles');
const Platform = require('Platform');

const {
  StyleSheet,
  View,
  ActivityIndicatorIOS,
  Text,
  ProgressBarAndroid,
} = React;

/**
 * 通用组件
 */
class CommonComponents {
  /**
   * 加载视图
   */
  static renderLoadingView() {
    if (Platform.OS === 'android') {
      return (
        <View style={CommonStyles.container}>
          <ProgressBarAndroid styleAttr="Inverse"/>
        </View>
      )
    } else if (Platform.OS === 'ios') {
      return (
        <View style={CommonStyles.container}>
          <ActivityIndicatorIOS size="large" />
        </View>
      );
    }
  }

  static renderPlaceholder(text, image, onPress) {
    return (
      <View>
      </View>
    )
  }

  static renderSepLine() {
    return (
      <View style={CommonStyles.sepLine}>
      </View>
    )
  }
}

module.exports = CommonComponents;
