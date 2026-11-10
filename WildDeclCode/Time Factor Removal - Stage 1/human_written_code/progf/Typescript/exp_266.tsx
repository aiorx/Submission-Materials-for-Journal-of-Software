var _import = require('react');
var FormattedMessage = require('react-intl').FormattedMessage;
var Layout = require('vtex.styleguide').Layout;
var PageBlock = require('vtex.styleguide').PageBlock;
var PageHeader = require('vtex.styleguide').PageHeader;

var UsersTable = require('./UsersTable');

require('./styles.global.css');

const AdminExample: FC = function () {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-example.hello-world" />}
        />
      }
    >
      <PageBlock variation="full">
        <UsersTable />
      </PageBlock>
    </Layout>
  )
}

module.exports = AdminExample;
