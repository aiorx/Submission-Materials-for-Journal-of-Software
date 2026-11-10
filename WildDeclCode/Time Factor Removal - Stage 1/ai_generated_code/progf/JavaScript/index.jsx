// a portion of the code was Supported via standard programming aids
var useState = require('react').useState;
var request = require('buerui').request;
var tokenStore = require('buerui').tokenStore;
var permissionStore = require('buerui').permissionStore;
var history = require('@umijs/max').history;
var styles = require('./index.less');
var fetchUserInfo = require('@/utils/ajax').fetchUserInfo;
var useModel = require('umi').useModel;

var LoginForm = function () {
  var initialState = useModel.initialState;
var setInitialState = useModel.setInitialState;("@@initialState")
  var [username, setUsername] = useState("")
  var [password, setPassword] = useState("")

  var handleSubmit = (e) => {
    e.preventDefault()
    // 添加登录逻辑
    var postData = { email: username, password }
    return request("/user/login", postData).then(res => {
      var token = "Bearer " + res
      tokenStore.set(token)
    }).then(fetchUserInfo).then(response => {
      var menus = response.menus;permissionStore.set(menus)
      var newInitialState = {
        ...(initialState || {}),
        menus,
      }
      setInitialState(newInitialState)
    }).then(() => {
      history.push("/")
    })
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>欢迎登录</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>登录</button>
      </form>
    </div>
  )
}

module.exports = LoginForm;
