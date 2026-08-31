setAge(ageId, fullDomain) {
  const domainIndex = this.domains.findIndex((domain) => `${domain.root}${domain.tld}` === fullDomain);
  if (domainIndex !== -1) {
    const domain = JSON.parse(JSON.stringify(this.domains[domainIndex]));
    const ageIndex = domain.ages.findIndex((age) => age.id === ageId);
    if (ageIndex !== -1) {
      domain.ages.forEach((age, index) => {
        age.isActive = index === ageIndex;
      });
      this.domains.splice(domainIndex, 1, domain);
    }
  }
}