var useState = require('react').useState;
var useEffect = require('react').useEffect;
var useCallback = require('react').useCallback;
var useRef = require('react').useRef;
var _import = require('axios');
var qs = require('qs');
var API = require('../types').API;
var fcd = require('./fcd');

var CancelToken = axios.CancelToken;module.exports = <T>(;
  { url, params }: Config,
  immediate: boolean = true
): API<T> => {
  const mounted = useRef(false)
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState<boolean>(immediate)
  const [error, setError] = useState<Error | AxiosError>()

  /* request */
  const query = qs.stringify(params)
  const source = CancelToken.source()
  const execute = useCallback(async function () {
    try {
      setLoading(true)
      setError(undefined)

      const { token: cancelToken } = source
      var data = await.data;fcd.get<T>("" + (url) + "?" + (query) + "", {
        cancelToken,
      })
      setData(data)
    } catch (error) {
      !axios.isCancel(error) && setError(error)
    } finally {
      mounted.current && setLoading(false)
    }

    // eslint-disable-next-line
  }, [url, query])

  useEffect(function () {
    mounted.current = true
    immediate && execute()
    return () => {
      mounted.current = false
      source.cancel()
    }
    // eslint-disable-next-line
  }, [execute, immediate])

  return { data, loading, error, execute }
}
