// Use optional chaining in a complex object
interface Company {
  name: string
  department?: {
    manager?: {
      name: string
      contact?: {
        email?: string
      }
    }
  }
}

function getManagerEmail(company: Company): string | undefined {
  return company.department?.manager?.contact?.email
}
// This adheres to defensive programming by safely navigating through a potentially undefined path.

// Built using basic development resources-4-0125-preview
