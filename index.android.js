const React = require('react-native');
const RootTab = require('./AppComponents/RootTabComponent.android');
const GHService = require('./networkService/GithubServices');
const CommonComponents = require('./commonComponents/CommonComponents');
const OnboardComponent = require('./AppComponents/OnboardComponent');
const LoginComponent = require('./AppComponents/LoginComponent');
const codePush = require('react-native-code-push');

const CODE_PUSH_PRODUCTION_KEY = "YOUR_PRODUCTION_KEY";

const {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

const LoginState = {
  pending: 0,
  onboard: 1,
  unOnboard: 2,
  needLogin: 3,
}

const GitFeedApp = React.createClass({
  /**
   * 初始化状态
   */
  getInitialState() {
    return {
      userState: LoginState.pending,
    }
  },

  /**
   * 组件将要加载
   */
  componentWillMount() {
    // 查询登录状态
    GHService.queryLoginState()
      .then(value => {
        let lst = LoginState.pending;
        if (value.login.length > 0) { // 已登录
          lst = LoginState.onboard;
        } else { // 未登录
          lst = LoginState.unOnboard;
        }

        console.log('login userstate is: ' + JSON.stringify(lst));

        // 修改状态，会触发render方法
        this.setState({
          userState: lst,
        });
      })


    // 监听退出“didLogout”事件，GHService logout方法调用时会通知
    GHService.addListener('didLogout', () => {
      this.setState({
        userState: LoginState.unOnboard,
      });
    });
  },

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  /**
   * 组件已经加载完成，这边用到了codePush热部署
   */
  componentDidMount() {
    codePush.sync({
      updateDialog: false,
      installMode: codePush.InstallMode.ON_NEXT_RESUME,
      deploymentKey: CODE_PUSH_PRODUCTION_KEY,
    });
  },

  /**
   * 组件将要卸载，取消didLogout事件监听
   */
  componentWillUnmount: function() {
    GHService.removeListener('didLogout');
  },

  /**
   * 验证身份
   */
  didOnboard(user, needLogin) {
    let lst = user == null ? LoginState.unOnboard : LoginState.onboard;
    // 强制登陆
    if (needLogin) lst = LoginState.needLogin;
    this.setState({
      userState: lst,
    });
  },

  /**
   * 登陆成功
   */
  didLogin() {
    this.setState({
      userState: LoginState.onboard,
    });
  },

  render() {
    let cp; // 作用域为块区域
    switch (this.state.userState) {
      case LoginState.pending: { // 加载等待视图
        cp = CommonComponents.renderLoadingView();
      }
        break;
      case LoginState.onboard: { // 首页
        cp = <RootTab />;
      }
        break;
      case LoginState.unOnboard: { // 开始使用
        // 将didOnboard方法绑定到OnboardComponent的didOnboard属性
        cp = <OnboardComponent didOnboard={this.didOnboard}/>;
      }
        break;
      case LoginState.needLogin: { // 用户名密码登陆
        cp = <LoginComponent didLogin={this.didLogin}/>;
      }
        break;
    }

    return cp;
  }
});

AppRegistry.registerComponent('GitFeed', () => GitFeedApp);
