var Image = require('@chakra-ui/react').Image;
var HStack = require('@chakra-ui/react').HStack;
var Heading = require('@chakra-ui/react').Heading;
var Box = require('@chakra-ui/react').Box;
var Button = require('@chakra-ui/react').Button;

var useTranslation = require('next-i18next').useTranslation;
var NextLink = require('next/link');

module.exports = function Landing() {;
  var t = useTranslation.t;('common');

  return (
    <Box width="100vw">
      <Box w="auto" h="auto" m="auto">
        <Image
          borderRadius="180px"
          w="200"
          h="200"
          src="/DevDAO.png"
          alt="icon"
          m="auto"
        />
      </Box>

      <Box w="fit-content" m="auto" textAlign="center">
        <Heading m="10px" fontSize="28px">
          {t('landing.looking_for_talent')}
        </Heading>

        <HStack justifyContent="center" gap={2} m="auto" textAlign="center">
          <NextLink href="/developers">
            <Button
              cursor="pointer"
              color="white"
              bg="neutral.700"
              _hover={{ bg: 'neutral.500' }}
              as="a"
            >
              {t('landing.search_devs')}
            </Button>
          </NextLink>
          <NextLink href="/post-job">
            <Button
              cursor="pointer"
              color="white"
              bg="neutral.700"
              _hover={{ bg: 'neutral.500' }}
              as="a"
            >
              {t('landing.post_job')}
            </Button>
          </NextLink>
        </HStack>

        <Heading m="10px" fontSize="28px">
          {t('landing.looking_for_work')}
        </Heading>
        <NextLink href="/jobs">
          <Button
            cursor="pointer"
            color="white"
            bg="neutral.700"
            _hover={{ bg: 'neutral.500' }}
            as="a"
          >
            {t('landing.search_jobs')}
          </Button>
        </NextLink>
      </Box>
    </Box>
  );
}
