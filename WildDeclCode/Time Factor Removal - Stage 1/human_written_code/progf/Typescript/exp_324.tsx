var _import = require('react');
var ThemeProvider = require('styled-components').ThemeProvider;
var Box = require('../components/Box');
var Control = require('../components/Control/Control');
var GameBoard = require('../components/GameBoard');
var ScoreBoard = require('../components/ScoreBoard');
var Switch = require('../components/Switch');
var Text = require('../components/Text');
var useGameBoard = require('../hooks/useGameBoard');
var useGameScore = require('../hooks/useGameScore');
var _import = require('../hooks/useGameState');
var useScaleControl = require('../hooks/useScaleControl');
var GRID_SIZE = require('../utils/constants').GRID_SIZE;
var MIN_SCALE = require('../utils/constants').MIN_SCALE;
var SPACING = require('../utils/constants').SPACING;
var useLocalStorage = require('../hooks/useLocalStorage');
var ThemeName = require('../themes/types').ThemeName;
var useTheme = require('../hooks/useTheme');

export type Configuration = {
  theme: ThemeName;
  bestScore: number;
  rows: number;
  cols: number;
};

const APP_NAME = 'react-2048';

const App: FC = function () {
  const [{ status: gameStatus, pause }, setGameStatus] = useGameState({
    status: 'running',
    pause: false,
  });

  const [config, setConfig] = useLocalStorage<Configuration>(APP_NAME, {
    theme: 'default',
    bestScore: 0,
    rows: MIN_SCALE,
    cols: MIN_SCALE,
  });

  const [{ name: themeName, value: themeValue }, setTheme] = useTheme(
    config.theme,
  );

  const [rows, setRows] = useScaleControl(config.rows);
  const [cols, setCols] = useScaleControl(config.cols);

  var total = useGameScore.total;
var best = useGameScore.best;
var addScore = useGameScore.addScore;
var setTotal = useGameScore.setTotal;(config.bestScore);

  var tiles = useGameBoard.tiles;
var onMove = useGameBoard.onMove;
var onMovePending = useGameBoard.onMovePending;({
    rows,
    cols,
    pause,
    gameStatus,
    setGameStatus,
    addScore,
  });

  const onResetGame = useCallback(() => {
    setGameStatus('restart');
  }, [setGameStatus]);

  const onCloseNotification = useCallback(
    (currentStatus: GameStatus) => {
      setGameStatus(currentStatus === 'win' ? 'continue' : 'restart');
    },
    [setGameStatus],
  );

  useEffect(() => {
    if (gameStatus === 'restart') setTotal(0);
  }, [gameStatus, setTotal]);

  useEffect(() => {
    setConfig({ rows, cols, bestScore: best, theme: themeName });
  }, [rows, cols, best, themeName, setConfig]);

  return (
    <ThemeProvider theme={themeValue}>
      <Box
        justifyContent="center"
        inlineSize="100%"
        blockSize="100%"
        alignItems="start"
        borderRadius={0}
      >
        <Box
          justifyContent="center"
          flexDirection="column"
          inlineSize={"" + (GRID_SIZE) + "px"}
        >
          <Box marginBlockStart="s6" inlineSize="100%" justifyContent="end">
            <Switch
              title="dark mode"
              checked={themeName === 'dark'}
              activeValue="dark"
              inactiveValue="default"
              onChange={setTheme}
            />
          </Box>
          <Box
            inlineSize="100%"
            justifyContent="space-between"
            marginBlockStart="s2"
          >
            <Box>
              <Text fontSize={64} fontWeight="bold" color="primary">
                2048
              </Text>
            </Box>
            <Box justifyContent="center">
              <ScoreBoard total={total} title="score" />
              <ScoreBoard total={best} title="best" />
            </Box>
          </Box>
          <Box marginBlockStart="s2" marginBlockEnd="s6" inlineSize="100%">
            <Control
              rows={rows}
              cols={cols}
              onReset={onResetGame}
              onChangeRow={setRows}
              onChangeCol={setCols}
            />
          </Box>
          <GameBoard
            tiles={tiles}
            boardSize={GRID_SIZE}
            rows={rows}
            cols={cols}
            spacing={SPACING}
            gameStatus={gameStatus}
            onMove={onMove}
            onMovePending={onMovePending}
            onCloseNotification={onCloseNotification}
          />
          <Box marginBlock="s4" justifyContent="center" flexDirection="column">
            <Text fontSize={16} as="p" color="primary">
              ✨ Join tiles with the same value to get 2048
            </Text>
            <Text fontSize={16} as="p" color="primary">
              🕹️ Play with arrow keys or swipe
            </Text>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

module.exports = App;
