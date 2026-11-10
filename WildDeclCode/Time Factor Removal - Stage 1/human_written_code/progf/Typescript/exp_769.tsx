var useRouter = require('next/router').useRouter;
var useUser = require('./user').useUser;
var Button = require('antd').Button;
var Drawer = require('antd').Drawer;
var Dropdown = require('antd').Dropdown;
var Menu = require('antd').Menu;
var Link = require('next/link');
var _import = require('react');
var styles = require('../styles/Navbar.module.css');
var DesktopOutlined = require('@ant-design/icons').DesktopOutlined;
var DownOutlined = require('@ant-design/icons').DownOutlined;
var HomeOutlined = require('@ant-design/icons').HomeOutlined;
var LinkOutlined = require('@ant-design/icons').LinkOutlined;
var LogoutOutlined = require('@ant-design/icons').LogoutOutlined;
var SettingOutlined = require('@ant-design/icons').SettingOutlined;
var ToolOutlined = require('@ant-design/icons').ToolOutlined;
var UploadOutlined = require('@ant-design/icons').UploadOutlined;
var UserOutlined = require('@ant-design/icons').UserOutlined;

var SubMenu = Menu.SubMenu;

module.exports = function Navbar({ enabled }: { enabled: 'home' | 'settings' | 'upload' | 'shorten' | 'account' }) {;
    var user = useUser.user;
var setUser = useUser.setUser;();
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const logout = async function () {
        try {
            await user.api.logout();

            setUser(null);

            router.push('/');
        } catch (err) {
            router.push('/');
        }
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <Link href="/account">
                    <Button
                        icon={<UserOutlined style={{ fontSize: '14px' }} />}
                        style={{ border: 'none' }}
                    >
                        Account
                    </Button>
                </Link>
            </Menu.Item>

            <Menu.Item>
                <Button
                    icon={<LogoutOutlined style={{ fontSize: '14px' }} />}
                    style={{ border: 'none' }}
                    onClick={logout}
                >
                    Logout
                </Button>
            </Menu.Item>
        </Menu>
    );

    const tools = (
        <Menu>
            <Menu.Item>
                <Link href="/tools/upload">
                    <Button
                        icon={<UploadOutlined style={{ fontSize: '14px' }} />}
                        style={{ border: 'none' }}
                    >
                        Upload
                    </Button>
                </Link>
            </Menu.Item>

            <Menu.Item>
                <Link href="/tools/shorten">
                    <Button
                        icon={<LinkOutlined style={{ fontSize: '14px' }} />}
                        style={{ border: 'none' }}
                    >
                        Shorten
                    </Button>
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className={styles.navbar}>
            <div className={styles.logo}>
                <img
                    src="/fulllogowhite.png"
                    onClick={function () { return router.push('/dashboard'); }}
                />
            </div>

            <div className={styles.navbarCon}>
                <div className={styles.left}>
                    <Link href="/dashboard">
                        <Button
                            className={"" + (styles.navButton) + " " + (
                                enabled === 'home' && styles.navButtonActive
                            ) + ""}
                            icon={<HomeOutlined style={{ fontSize: '14px' }} />}
                        >
                            Home
                        </Button>
                    </Link>

                    <Link href="/settings">
                        <Button
                            className={"" + (styles.navButton) + " " + (
                                enabled === 'settings' && styles.navButtonActive
                            ) + ""}
                            icon={<SettingOutlined style={{ fontSize: '14px' }} />}
                        >
                            Settings
                        </Button>
                    </Link>

                    <Dropdown overlay={tools} placement="bottomCenter">
                        <Button
                            className={"" + (styles.navButton) + " " + (
                                (enabled === 'upload' || enabled === 'shorten') && styles.navButtonActive
                            ) + ""}
                            icon={<ToolOutlined style={{ fontSize: '14px' }} />}
                        >
                            Tools <DownOutlined />
                        </Button>
                    </Dropdown>

                    {user.admin && <Button
                        className={styles.navButton}
                        icon={<DesktopOutlined style={{ fontSize: '14px' }} />}
                    >
                            Admin Panel
                    </Button>}
                </div>

                <div className={styles.right}>
                    <Dropdown overlay={menu} placement="bottomCenter">
                        <Button className={styles.logoutButton} type="primary">
                            <img
                                src={user.discord.avatar}
                                height="25px"
                                className={styles.avatarImg}
                            />
                            <span className={styles.avatarUsername}>
                                {user.username}
                            </span>
                        </Button>
                    </Dropdown>
                </div>

                <Button className={styles.barsCon} type="primary" onClick={function () { return setVisible(true); }}>
                    <span className={styles.barsBtn} />
                </Button>

                <Drawer
                    title={"Welcome, " + (user.username) + "."}
                    placement="right"
                    closable={false}
                    onClose={function () { return setVisible(false); }}
                    visible={visible}
                >
                    <Menu style={{ backgroundColor: '#1f1f1f', border: 'none' }}>
                        <Menu.Item
                            onClick={function () { return router.push('/dashboard'); }}
                            style={
                                enabled === 'home' && {
                                    backgroundColor: '#444444',
                                    borderRadius: '10px',
                                }
                            }
                        >
                            <span>
                                <HomeOutlined style={{ fontSize: '14px' }} />
                                Home
                            </span>
                        </Menu.Item>

                        <SubMenu
                            style={
                                enabled === 'settings' ? {
                                    backgroundColor: '#444444',
                                    borderRadius: '10px',
                                } : null
                            }
                            key="sub1"
                            icon={<SettingOutlined />}
                            title="Settings"
                        >
                            <Menu.Item
                                key="1"
                                onClick={function () { return router.push('/settings'); }}
                            >
                              General
                            </Menu.Item>
                            <Menu.Item
                                key="2"
                                onClick={function () { return router.push('/settings/domains'); }}
                            >
                              Domains
                            </Menu.Item>
                        </SubMenu>

                        <SubMenu
                            style={
                                enabled === 'upload' || enabled === 'shorten' ? {
                                    backgroundColor: '#444444',
                                    borderRadius: '10px',
                                } : null
                            }
                            key="sub2"
                            icon={<ToolOutlined />}
                            title="Tools"
                        >
                            <Menu.Item
                                key="1"
                                onClick={function () { return router.push('/tools/upload'); }}
                            >
                              Upload
                            </Menu.Item>
                            <Menu.Item
                                key="2"
                                onClick={function () { return router.push('/tools/shorten'); }}
                            >
                                Shorten
                            </Menu.Item>
                        </SubMenu>

                        {user.admin && <Menu.Item onClick={function () { return window.location.href = 'https://panel.astral.cool'; }}>
                            <span>
                                <DesktopOutlined style={{ fontSize: '14px' }} />
                                Admin Panel
                            </span>
                        </Menu.Item>}

                        <Menu.Item
                            onClick={function () { return router.push('/account'); }}
                            style={
                                enabled === 'account' && {
                                    backgroundColor: '#444444',
                                    borderRadius: '10px',
                                }
                            }
                        >
                            <span>
                                <UserOutlined style={{ fontSize: '14px' }} />
                                Account
                            </span>
                        </Menu.Item>
                    </Menu>

                    <Menu style={{ backgroundColor: '#1f1f1f', border: 'none' }}>
                        <Menu.Item onClick={logout}>
                            <span>
                                <LogoutOutlined style={{ fontSize: '14px' }} />
                                Logout
                            </span>
                        </Menu.Item>
                    </Menu>
                </Drawer>
            </div>
        </div>
    );
}
