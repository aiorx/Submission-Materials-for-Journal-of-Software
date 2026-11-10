var React = require('react');
var NextLink = require('next/link');
var useColorMode = require('@chakra-ui/react').useColorMode;
var Heading = require('@chakra-ui/react').Heading;
var Text = require('@chakra-ui/react').Text;
var Flex = require('@chakra-ui/react').Flex;
var Box = require('@chakra-ui/react').Box;
var Link = require('@chakra-ui/react').Link;
var parseISO = require('date-fns').parseISO;
var format = require('date-fns').format;

const BlogPost = function ({ title, publishedAt, summary, slug }) {
    var colorMode = useColorMode.colorMode;()
    const secondaryTextColor = {
        light: 'gray.700',
        dark: 'gray.400'
    }

    return (
        <NextLink href={"blog/" + (slug) + ""} passHref>
            <Link w="100%" _hover={{ textDecoration: 'none' }}>
                <Box mb={10} display="block" width="100%">
                    <Flex
                        width="100%"
                        align="flex-start"
                        justifyContent="space-between"
                        flexDirection={['column', 'row']}
                    >
                        <Flex flexDirection="column" align="flex-start" justifyContent="start" width="100%">
                            <Heading size="md" as="h3" mb={1} fontWeight="medium">
                                {title}
                            </Heading>
                        </Flex>

                        <Text
                            color="gray.500"
                            minWidth="140px"
                            textAlign={['left', 'right']}
                            mb={[4, 0]}
                        >
                            {format(parseISO(publishedAt), 'MMMM dd, yyyy')}
                        </Text>

                    </Flex>
                    <Text color={secondaryTextColor[colorMode]}>{summary}</Text>
                </Box>
            </Link>
        </NextLink>
    )
}

module.exports = BlogPost;
