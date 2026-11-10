class Config:
    """
    Configuration for the application. These can be overridden by setting the appropriate environment variables.

    Refactored with the help of GitHub Copilot.
    """

    BEANSTALKD_HOST: str = env("BEANSTALKD_HOST", default="localhost")
    BEANSTALKD_PORT: str = env("BEANSTALKD_PORT", cast=int, default=11300)
    BIND_INTERFACE: str = env("BIND_INTERFACE", default="127.0.0.1")
    COMPETITION_TEAMS: List[int] = env("TEAMS", cast=list, subcast=int, default=[])
    COMPETITION_TITLE: str = env("COMPETITION_TITLE", default="Freezing Saddles")
    DEBUG: bool = env("DEBUG", cast=bool, default=False)
    END_DATE: datetime = env(
        "END_DATE", postprocessor=lambda val: arrow.get(val).datetime
    )
    # Environment (localdev, production, etc.)
    ENVIRONMENT: str = env("ENVIRONMENT", default="localdev")
    FORUM_SITE: str = env(
        "FORUM_SITE",
        "https://www.bikearlingtonforum.com/forums/forum/freezing-saddles-winter-riding-competition/",
    )
    INSTANCE_PATH: str = env(
        "INSTANCE_PATH", default=os.path.join(_basedir, "data/instance")
    )
    # Directory to store leaderboard data
    LEADERBOARDS_DIR: str = env(
        "LEADERBOARDS_DIR", default=os.path.join(_basedir, "leaderboards")
    )
    MAIN_TEAM: int = env("MAIN_TEAM", cast=int)
    OBSERVER_TEAMS: List[int] = env(
        "OBSERVER_TEAMS", cast=list, subcast=int, default=[]
    )
    REGISTRATION_SITE: str = env("REGISTRATION_SITE", "https://freezingsaddles.info/")
    SECRET_KEY = env("SECRET_KEY")
    SQLALCHEMY_URL: str = env("SQLALCHEMY_URL")
    SQLALCHEMY_ROOT_URL: str = env("SQLALCHEMY_ROOT_URL", None)
    START_DATE: datetime = env(
        "START_DATE", postprocessor=lambda val: arrow.get(val).datetime
    )
    STRAVA_CLIENT_ID = env("STRAVA_CLIENT_ID")
    STRAVA_CLIENT_SECRET = env("STRAVA_CLIENT_SECRET")
    JSON_CACHE_DIR = env("JSON_CACHE_DIR", default="/cache/json")
    JSON_CACHE_MINUTES = env("JSON_CACHE_MINUTES", cast=int, default=30)
    TRACK_LIMIT_DEFAULT = env("TRACK_LIMIT_DEFAULT", cast=int, default=1024)
    TRACK_LIMIT_MAX = env("TRACK_LIMIT_MAX", cast=int, default=2048)
    TIMEZONE: tzinfo = env(
        "TIMEZONE",
        default="America/New_York",
        postprocessor=lambda val: pytz.timezone(val),
    )
    VERSION_NUM: str = version("freezing-web")
    VERSION_STRING: str = f"{VERSION_NUM}+{branch}.{commit}.{build_date}"
    SEND_FILE_MAX_AGE_DEFAULT: int = (
        None
        if ENVIRONMENT == "localdev"
        else 84600  # let the browser cache static files for 24 hours
    )
    # From registration start (Thanksgiving) until shortly after the competition ends.
    PERMANENT_SESSION_LIFETIME: timedelta = timedelta(days=128)