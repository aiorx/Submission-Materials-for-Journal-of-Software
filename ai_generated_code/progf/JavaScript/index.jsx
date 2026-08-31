// a portion of the code was Supported via standard programming aids
import { useState } from "react"
import { request, tokenStore, permissionStore } from "buerui"
import { history } from "@umijs/max"
import styles from "./index.less"
import { fetchUserInfo } from "@/utils/ajax"
import { useModel } from "umi"

const LoginForm = () => {
  const { initialState, setInitialState } = useModel("@@initialState")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // 添加登录逻辑
    const postData = { email: username, password }
    return request("/user/login", postData).then(res => {
      const token = "Bearer " + res
      tokenStore.set(token)
    }).then(fetchUserInfo).then(response => {
      const { menus } = response
      permissionStore.set(menus)
      const newInitialState = {
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

export default LoginForm
