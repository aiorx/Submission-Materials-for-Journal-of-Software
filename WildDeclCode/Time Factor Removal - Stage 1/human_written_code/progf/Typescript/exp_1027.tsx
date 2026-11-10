var _import = require('react');
import {
  Table,
  IconArrowUp,
  IconArrowDown,
  IconShoppingCart,
  Input,
} from 'vtex.styleguide'
var faker = require('faker');
var withRuntimeContext = require('vtex.render-runtime').withRuntimeContext;

const EXAMPLE_LENGTH = 100
const MOCKED_DATA = [...Array(EXAMPLE_LENGTH)].map(function () { return ({
  name: faker.name.findName(),
  streetAddress: faker.address.streetAddress(),
  cityStateZipAddress: "" + (faker.address.city()) + ", " + (faker.address.stateAbbr()) + " " + (faker.address.zipCode()) + "",
  email: faker.internet.email().toLowerCase(),
}); })

interface Props {
  runtime: any
}

class UsersTable extends Component<Props> {
  constructor(props: any) {
    super(props)
    this.state = {
      items: MOCKED_DATA,
      tableDensity: 'low',
      searchValue: null,
      filterStatements: [],
    }
  }

  private getSchema() {
    const { tableDensity }: any = this.state

    let fontSize = 'f5'

    switch (tableDensity) {
      case 'low': {
        fontSize = 'f5'
        break
      }
      case 'medium': {
        fontSize = 'f6'
        break
      }
      case 'high': {
        fontSize = 'f7'
        break
      }
      default: {
        fontSize = 'f5'
        break
      }
    }
    return {
      properties: {
        name: {
          title: 'Name',
        },
        streetAddress: {
          title: 'Street Address',
          cellRenderer: function ({ cellData }: any) {
            return <span className="ws-normal">{cellData}</span>
          },
        },
        cityStateZipAddress: {
          title: 'City, State Zip',
          cellRenderer: function ({ cellData }: any) {
            return <span className={"ws-normal " + (fontSize) + ""}>{cellData}</span>
          },
        },
        email: {
          title: 'Email',
          cellRenderer: function ({ cellData }: any) {
            return <span className={"ws-normal " + (fontSize) + ""}>{cellData}</span>
          },
        },
      },
    }
  }

  private simpleInputObject({ values, onChangeObjectCallback }: any) {
    return (
      <Input
        value={values || ''}
        onChange={function (e: any) { return onChangeObjectCallback(e.target.value); }}
      />
    )
  }

  private simpleInputVerbsAndLabel() {
    return {
      renderFilterLabel: function (st: any) {
        if (!st || !st.object) {
          // you should treat empty object cases only for alwaysVisibleFilters
          return 'Any'
        }
        return "" + (
          st.verb === '=' ? 'is' : st.verb === '!=' ? 'is not' : 'contains'
        ) + " " + (st.object) + ""
      },
      verbs: [
        {
          label: 'is',
          value: '=',
          object: {
            renderFn: this.simpleInputObject,
            extraParams: {},
          },
        },
        {
          label: 'is not',
          value: '!=',
          object: {
            renderFn: this.simpleInputObject,
            extraParams: {},
          },
        },
        {
          label: 'contains',
          value: 'contains',
          object: {
            renderFn: this.simpleInputObject,
            extraParams: {},
          },
        },
      ],
    }
  }

  public render() {
    const {
      items,
      searchValue,
      filterStatements,
      tableDensity,
    }: any = this.state
    const {
      runtime: { navigate },
    } = this.props

    return (
      <div>
        <Table
          fullWidth
          updateTableKey={tableDensity}
          items={items}
          schema={this.getSchema()}
          density="low"
          onRowClick={function ({ rowData }: any) { return navigate({
              page: 'admin.app.example-detail',
              params: { id: rowData.id },
            }); }}
          toolbar={{
            density: {
              buttonLabel: 'Line density',
              lowOptionLabel: 'Low',
              mediumOptionLabel: 'Medium',
              highOptionLabel: 'High',
              handleCallback: function (density: string) { return this.setState({ tableDensity: density }); },
            },
            inputSearch: {
              value: searchValue,
              placeholder: 'Search stuff...',
              onChange: function (value: string) { return this.setState({ searchValue: value }); },
              onClear: function () { return this.setState({ searchValue: null }); },
              onSubmit: function () {},
            },
            download: {
              label: 'Export',
              handleCallback: function () { return alert('Callback()'); },
            },
            upload: {
              label: 'Import',
              handleCallback: function () { return alert('Callback()'); },
            },
            fields: {
              label: 'Toggle visible fields',
              showAllLabel: 'Show All',
              hideAllLabel: 'Hide All',
            },
            extraActions: {
              label: 'More options',
              actions: [
                {
                  label: 'An action',
                  handleCallback: function () { return alert('An action'); },
                },
                {
                  label: 'Another action',
                  handleCallback: function () { return alert('Another action'); },
                },
                {
                  label: 'A third action',
                  handleCallback: function () { return alert('A third action'); },
                },
              ],
            },
            newLine: {
              label: 'New',
              handleCallback: function () { return alert('handle new line callback'); },
            },
          }}
          filters={{
            alwaysVisibleFilters: ['name', 'email'],
            statements: filterStatements,
            onChangeStatements: function (newStatements: string) { return this.setState({ filterStatements: newStatements }); },
            clearAllFiltersButtonLabel: 'Clear Filters',
            collapseLeft: true,
            options: {
              name: {
                label: 'Name',
                ...this.simpleInputVerbsAndLabel(),
              },
              email: {
                label: 'Email',
                ...this.simpleInputVerbsAndLabel(),
              },
              streetAddress: {
                label: 'Street Address',
                ...this.simpleInputVerbsAndLabel(),
              },
              cityStateZipAddress: {
                label: 'City State Zip',
                ...this.simpleInputVerbsAndLabel(),
              },
            },
          }}
          totalizers={[
            {
              label: 'Sales',
              value: '420.763',
              icon: <IconShoppingCart size={14} />,
            },
            {
              label: 'Cash in',
              value: 'R$ 890.239,05',
              iconBackgroundColor: '#eafce3',
              icon: <IconArrowUp color="#79B03A" size={14} />,
            },

            {
              label: 'Cash out',
              value: '- R$ 13.485,26',
              icon: <IconArrowDown size={14} />,
            },
          ]}
          bulkActions={{
            texts: {
              secondaryActionsLabel: 'Actions',
              rowsSelected: function (qty: any) { return (
                <Fragment>Selected rows: {qty}</Fragment>
              ); },
              selectAll: 'Select all',
              allRowsSelected: function (qty: any) { return (
                <Fragment>All rows selected: {qty}</Fragment>
              ); },
            },
            totalItems: 100,
            main: {
              label: 'Send email',
              handleCallback: function (_params: any) { return alert('TODO: SHOW EMAIL FORM'); },
            },
            others: [
              {
                label: 'Delete',
                handleCallback: function (params: any) { return console.warn(params); },
              },
            ],
          }}
        />
      </div>
    )
  }
}

module.exports = withRuntimeContext(UsersTable);
