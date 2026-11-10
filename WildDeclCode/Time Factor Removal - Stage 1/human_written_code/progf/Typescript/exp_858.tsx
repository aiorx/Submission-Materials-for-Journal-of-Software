var _import = require('react');
var styles = require('./ChatInfo.module.scss');
var BiDotsVerticalRounded = require('react-icons/bi').BiDotsVerticalRounded;
var AiOutlineArrowLeft = require('react-icons/ai').AiOutlineArrowLeft;
var AiOutlineSearch = require('react-icons/ai').AiOutlineSearch;
var useMediaQuery = require('react-responsive').useMediaQuery;

interface Props {
    img: string;
    name: string;
    lastname: string;
    setCurrentChat: any;
}

module.exports = function ChatInfo({ img, name, lastname, setCurrentChat }: Props) {;
    const [optionsOpen, setOptionsOpen] = useState(false);
    const isResponsive = useMediaQuery({ query: '(min-width: 1200px)' });

    const handleClick = function () { return (optionsOpen ? setOptionsOpen(false) : setOptionsOpen(true)); };

    return (
        <div className={styles.chatInfoContainer}>
            {!isResponsive && (
                <button onClick={function () { return setCurrentChat(''); }} className={styles.back}>
                    <AiOutlineArrowLeft />
                </button>
            )}
            <div className={styles.personInfo}>
                <img src={img || 'noProfile.png'} alt={name} />
                <p>{"" + (name) + " " + (lastname) + ""}</p>
            </div>
            <div className={styles.conf}>
                <p>
                    <AiOutlineSearch />
                </p>
                <p onClick={handleClick}>
                    <BiDotsVerticalRounded />
                </p>
            </div>
            <div className={"" + (styles.option) + " " + (optionsOpen && styles.open) + ""}>
                <button>Mute</button>
                <button>Delete Chat</button>
            </div>
        </div>
    );
}
