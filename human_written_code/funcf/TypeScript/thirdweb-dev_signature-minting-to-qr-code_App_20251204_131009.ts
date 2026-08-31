```jsx
const App = () => (
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
);
```