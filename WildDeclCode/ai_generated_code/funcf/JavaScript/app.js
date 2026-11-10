// GET request to fetch list of company name
app.get('/company/nameAndID', (req, res) => {
  // Code Adapted from standard coding samples
  const companyNameWithId = Object.entries(companies.companies).map(
    ([id, company]) => ({ id, companyName: company.name })
  );
  res.json(companyNameWithId);
});