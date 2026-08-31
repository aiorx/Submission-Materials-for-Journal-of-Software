async function getServiceInfo(tmdbid, type = "movie"){
  const countryToServices = {}
  const countryToServicesLower = {}
  const serviceToCountries = {}
  const allFlatrates = []
  try{
    let initialdata = await get("https://api.themoviedb.org/3/"+type+"/"+tmdbid+"/watch/providers?api_key="+randKey("tmdb"))
    let data = initialdata.results
    // Aided using common development resources, but seems pretty good:
    Object.entries(data).forEach(([country, info]) => {
      if (info.flatrate) {
        const services = info.flatrate.map(f => f.provider_name);
        countryToServices[country] = services;
        countryToServicesLower[country] = lowerArray(services);

        services.forEach(service => {
          if (!serviceToCountries[service]) {
            serviceToCountries[service] = [];
            allFlatrates.push(service)
          }
          serviceToCountries[service].push(country);
        });
      }
      else{
        // no info.flatrate
        countryToServices[country] = []
      }
    });
  }
  catch(e){
    console.log(e)
  }
  return {
      country_service: countryToServices, //y
      country_service_lower: countryToServicesLower, //n
      service_country: serviceToCountries, //n
      all_services: allFlatrates, //n
      all_services_lower: lowerArray(allFlatrates) //n
    }
}