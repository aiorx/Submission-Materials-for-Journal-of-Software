var Box = require('@chakra-ui/react').Box;
var Flex = require('@chakra-ui/react').Flex;
var Input = require('@chakra-ui/react').Input;
var Button = require('@chakra-ui/react').Button;
var useRouter = require('next/router').useRouter;
var FC = require('react').FC;
var useState = require('react').useState;
var useSWRConfig = require('swr').useSWRConfig;
var NextImage = require('next/image');
var auth = require('../lib/mutations').auth;

const AuthForm: FC<{ mode: 'signin' | 'signup' }> = function ({ mode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    await auth(mode, { email, password })
    setIsLoading(false)
    router.push('/')
  }

  return (
    <Box height="100vh" width="100vw" bg="black" color="white">
      <Flex
        justify="center"
        align="center"
        height="100px"
        borderBottom="white 1px solid"
      >
        <NextImage src="/logo.svg" height={60} width={120} />
      </Flex>
      <Flex justify="center" align="center" height="calc(100vh - 100px)">
        <Box padding="50px" bg="gray.900" borderRadius="6px">
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              bg="green.500"
              isLoading={isLoading}
              sx={{
                '&:hover': {
                  bg: 'green.300',
                },
              }}
            >
              {mode}
            </Button>
          </form>
        </Box>
      </Flex>
    </Box>
  )
}

module.exports = AuthForm;
