var useContext = require('react').useContext;
var Box = require('@mui/material').Box;
var Divider = require('@mui/material').Divider;
var Drawer = require('@mui/material').Drawer;
var List = require('@mui/material').List;
var ListItem = require('@mui/material').ListItem;
var ListItemIcon = require('@mui/material').ListItemIcon;
var ListItemText = require('@mui/material').ListItemText;
var Typography = require('@mui/material').Typography;


var InboxOutlinedIcon = require('@mui/icons-material/InboxOutlined');
var MailOutlineOutlinedIcon = require('@mui/icons-material/MailOutlineOutlined');

var UIContext = require('../../context/ui').UIContext;

const menuItems: string[] = ['Inbox','Starred','Send Email','Drafts']


const Sidebar = function () {

    var sidemenuOpen = useContext.sidemenuOpen;
var closeSideMenu = useContext.closeSideMenu;( UIContext );


    return (
        <Drawer
            anchor="left"
            open={ sidemenuOpen }
            onClose={ closeSideMenu }
        >
            <Box sx={{ width: 250 }}>

                <Box sx={{ padding:'5px 10px' }}>
                    <Typography variant="h4">Menú</Typography>
                </Box>

                <List>
                    {
                        menuItems.map( (text, index) => (
                            <ListItem button key={ text }>
                                <ListItemIcon>
                                    { index % 2 ? <InboxOutlinedIcon />: <MailOutlineOutlinedIcon />  }
                                </ListItemIcon>
                                <ListItemText primary={ text } />
                            </ListItem>
                        ))
                    }
                </List>

                <Divider />

                <List>
                    {
                        menuItems.map( (text, index) => (
                            <ListItem button key={ text }>
                                <ListItemIcon>
                                    { index % 2 ? <InboxOutlinedIcon />: <MailOutlineOutlinedIcon />  }
                                </ListItemIcon>
                                <ListItemText primary={ text } />
                            </ListItem>
                        ))
                    }
                </List>

            </Box>
            
        </Drawer>
    )
};
