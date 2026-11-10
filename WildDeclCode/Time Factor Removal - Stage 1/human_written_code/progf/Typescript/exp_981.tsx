var Router = require('react-router-dom').BrowserRouter;
var Route = require('react-router-dom').Route;
var Routes = require('react-router-dom').Routes;
require('./App.css');
var AddNewContract = require('./components/contracts/AddNewContract');
var ContractList = require('./components/contracts/ContractList');
var AddNewForm = require('./components/forms/AddNewForm');
var FormList = require('./components/forms/FormList');
var Layout = require('./components/Layout');
var AddNewQrCode = require('./components/qrCodes/AddNewQrCode');
var QrCodeList = require('./components/qrCodes/QrCodeList');
var ViewCode = require('./routes/qr-codes/[:id]');
var ContractsPage = require('./routes/contracts');
var FormsPage = require('./routes/forms');
var HomePage = require('./routes/home');
var QrCodesPages = require('./routes/qrCodes');
var ClaimCode = require('./routes/claim');

const App = function () { return (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contracts" element={<ContractsPage />}>
          <Route path="" element={<ContractList />} />
          <Route path="new" element={<AddNewContract />} />
        </Route>

        <Route path="/forms" element={<FormsPage />}>
          <Route path="" element={<FormList />} />
          <Route path="new" element={<AddNewForm />} />
          <Route path="edit" element={<AddNewForm />} />
        </Route>

        <Route path="/qr-codes" element={<QrCodesPages />}>
          <Route path="" element={<QrCodeList />} />
          <Route path="new" element={<AddNewQrCode />} />
          <Route path=":id" element={<ViewCode />} />
        </Route>

        <Route path="claim" element={<ClaimCode />} />

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </Layout>
  </Router>
); };

module.exports = App;
