var _import = require('react');
var Routes = require('./Routes').Routes;
var setAccessToken = require('./utils/accessToken').setAccessToken;
var Loading = require('./components/Loading/Loading').Loading;
var Helmet = require('react-helmet');
var ColorScheme = require('./utils/theme').ColorScheme;

const App: React.FC = function () {
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch refresh token
    useEffect(() => {
        fetch((process.env.REACT_APP_SERVER_URL as string) + '/refresh_token', {
            method: 'POST',
            credentials: 'include',
        }).then(async res => {
            var accessToken = await.accessToken;res.json();
            setAccessToken(accessToken);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <>
                <Helmet>
                    <style>{"body { background-color: " + (ColorScheme.WHITE) + "; }"}</style>
                </Helmet>
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Loading />
                </div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <style>{"body { background-color: " + (ColorScheme.WHITE) + "; }"}</style>
            </Helmet>
            <Routes />
        </>
    );
};
