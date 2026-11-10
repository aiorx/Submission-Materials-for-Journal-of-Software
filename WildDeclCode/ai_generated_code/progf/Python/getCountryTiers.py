# This code was Assisted with basic coding tools.
# The purpose (I believe right now) was to create a tsv file that mainly assigned contry codes to tiers.
#
# An important thing to note is that currently sanctioned countries are not excluded from the list although the should be
# For example, Cuba appears as "Tier 5" although in reality it should be in this list at all because Cubans 
# aren't allowed to join GIN because of laws forbidding to do business with certain sanctioned countries.
#
# TODO: In an ideal world, if I continue this project, I should add another tier: "Sanctioned"
import pandas as pd
import pycountry

# Extract original data from the chat (manually formatted into a list of tuples)
raw_data = """
Åland Islands	Tier 1	100
Andorra	Tier 1	100
Antarctica	Tier 1	100
Australia	Tier 1	100
Austria	Tier 1	100
Bahamas	Tier 1	100
Bahrain	Tier 1	100
Belgium	Tier 1	100
Canada	Tier 1	100
Cayman Islands	Tier 1	100
China	Tier 1	100
Curaçao	Tier 3	50
Denmark	Tier 1	100
Faroe Islands	Tier 1	100
Finland	Tier 1	100
France	Tier 1	100
French Guiana	Tier 1	100
French Southern Territories	Tier 1	100
Germany	Tier 1	100
Gibraltar	Tier 1	100
Greenland	Tier 1	100
Guadeloupe	Tier 1	100
Guernsey	Tier 1	100
Hong Kong	Tier 1	100
Iceland	Tier 1	100
Ireland	Tier 1	100
Isle of Man	Tier 1	100
Israel	Tier 1	100
Italy	Tier 1	100
Japan	Tier 1	100
Jersey	Tier 1	100
Kuwait	Tier 1	100
Liechtenstein	Tier 1	100
Luxembourg	Tier 1	100
Malta	Tier 1	100
Monaco	Tier 1	100
Netherlands	Tier 1	100
New Zealand	Tier 1	100
Norway	Tier 1	100
Oman	Tier 1	100
Qatar	Tier 1	100
Saint Barth	Tier 1	100
Saint Martin (Dutch part)	Tier 1	100
Saint Martin (French part)	Tier 1	100
Saint Vincent and the Grenadines	Tier 1	100
San Marino	Tier 1	100
Saudi Arabia	Tier 1	100
Singapore	Tier 1	100
Spain	Tier 1	100
Svalbard and Jan Mayen	Tier 1	100
Sweden	Tier 1	100
Switzerland	Tier 1	100
Taiwan	Tier 1	100
United Arab Emirates	Tier 1	100
United Kingdom (UK)	Tier 1	100
United States (US)	Tier 1	100
United States (US) Minor Outlying Islands	Tier 1	100
Vatican	Tier 1	100
British Indian Ocean Territory	Tier 2	75
Cook Islands	Tier 2	75
Costa Rica	Tier 2	75
Czechia (Czech Republic)	Tier 2	75
Estonia	Tier 2	75
Greece	Tier 2	75
Kiribati	Tier 2	75
Martinique	Tier 2	75
Mayotte	Tier 2	75
Montenegro	Tier 2	75
Portugal	Tier 2	75
Saint Pierre and Miquelon	Tier 2	75
South Korea	Tier 2	75
Virgin Islands (US)	Tier 2	75
Azerbaijan	Tier 3	50
Belize	Tier 3	50
Brunei	Tier 3	50
Cape Verde	Tier 3	50
Chile	Tier 3	50
Croatia	Tier 3	50
Cyprus	Tier 3	50
Falkland Islands	Tier 3	50
Fiji	Tier 3	50
Georgia	Tier 3	50
Grenada	Tier 3	50
Jordan	Tier 3	50
Latvia	Tier 3	50
Marshall Islands	Tier 3	50
Morocco	Tier 3	50
Norfolk Island	Tier 3	50
Northern Mariana Islands	Tier 3	50
Panama	Tier 3	50
Reunion	Tier 3	50
Slovakia	Tier 3	50
Slovenia	Tier 3	50
South Africa	Tier 3	50
Thailand	Tier 3	50
Timor-Leste	Tier 3	50
American Samoa	Tier 4	25
Antigua and Barbuda	Tier 4	25
Armenia	Tier 4	25
Barbados	Tier 4	25
Bermuda	Tier 4	25
Brazil	Tier 4	25
Bulgaria	Tier 4	25
Djibouti	Tier 4	25
Ecuador	Tier 4	25
El Salvador	Tier 4	25
Guam	Tier 4	25
Iraq	Tier 4	25
Lebanon	Tier 4	25
Malaysia	Tier 4	25
Mexico	Tier 4	25
Micronesia	Tier 4	25
Moldova	Tier 4	25
Peru	Tier 4	25
Poland	Tier 4	25
Puerto Rico	Tier 4	25
Romania	Tier 4	25
Russia	Tier 4	25
Seychelles	Tier 4	25
Trinidad and Tobago	Tier 4	25
Tunisia	Tier 4	25
Turkmenistan	Tier 4	25
Turks and Caicos Islands	Tier 4	25
Virgin Islands (British)	Tier 4	25
Wallis and Futuna	Tier 4	25
Afghanistan	Tier 5	10
Albania	Tier 5	10
Algeria	Tier 5	10
Angola	Tier 5	10
Anguilla	Tier 5	10
Argentina	Tier 5	10
Aruba	Tier 3	50
Bangladesh	Tier 5	10
Belarus	Tier 5	10
Belau	Tier 5	10
Benin	Tier 5	10
Bhutan	Tier 5	10
Bolivia	Tier 5	10
Bonaire, Saint Eustatius and Saba	Tier 3	50
Bosnia and Herzegovina	Tier 5	10
Botswana	Tier 5	10
Bouvet Island	Tier 5	10
Burkina Faso	Tier 5	10
Burundi	Tier 5	10
Cambodia	Tier 5	10
Cameroon	Tier 5	10
Central African Republic	Tier 5	10
Chad	Tier 5	10
Christmas Island	Tier 5	10
Cocos (Keeling) Islands	Tier 5	10
Colombia	Tier 5	10
Comoros	Tier 5	10
Congo (Brazzaville)	Tier 5	10
Congo (Kinshasa)	Tier 5	10
Cuba	Tier 5	10
Dominica	Tier 5	10
Dominican Republic	Tier 5	10
Egypt	Tier 5	10
Equatorial Guinea	Tier 5	10
Eritrea	Tier 5	10
Ethiopia	Tier 5	10
French Polynesia	Tier 5	10
Gabon	Tier 5	10
Gambia	Tier 5	10
Ghana	Tier 5	10
Guatemala	Tier 5	10
Guinea	Tier 5	10
Guinea-Bissau	Tier 5	10
Guyana	Tier 5	10
Haiti	Tier 5	10
Heard Island and McDonald Islands	Tier 5	10
Honduras	Tier 5	10
Hungary	Tier 5	10
India	Tier 5	10
Indonesia	Tier 5	10
Iran	Tier 5	10
Ivory Coast	Tier 5	10
Jamaica	Tier 5	10
Kazakhstan	Tier 5	10
Kenya	Tier 5	10
Kyrgyzstan	Tier 5	10
Laos	Tier 5	10
Lesotho	Tier 5	10
Liberia	Tier 5	10
Libya	Tier 5	10
Lithuania	Tier 5	10
Macao	Tier 5	10
Madagascar	Tier 5	10
Malawi	Tier 5	10
Maldives	Tier 5	10
Mali	Tier 5	10
Mauritania	Tier 5	10
Mauritius	Tier 5	10
Mongolia	Tier 5	10
Montserrat	Tier 5	10
Mozambique	Tier 5	10
Myanmar	Tier 5	10
Namibia	Tier 5	10
Nauru	Tier 5	10
Nepal	Tier 5	10
New Caledonia	Tier 5	10
Nicaragua	Tier 5	10
Niger	Tier 5	10
Nigeria	Tier 5	10
Niue	Tier 5	10
North Korea	Tier 5	10
North Macedonia	Tier 5	10
Pakistan	Tier 5	10
Palestinian Territory	Tier 5	10
Papua New Guinea	Tier 5	10
Paraguay	Tier 5	10
Philippines	Tier 5	10
Pitcairn	Tier 5	10
Rwanda	Tier 5	10
Saint Helena	Tier 5	10
Saint Kitts and Nevis	Tier 5	10
Saint Lucia	Tier 5	10
Samoa	Tier 5	10
São Tomé and Príncipe	Tier 5	10
Senegal	Tier 5	10
Serbia	Tier 5	10
Sierra Leone	Tier 5	10
Solomon Islands	Tier 5	10
Somalia	Tier 5	10
South Georgia/Sandwich Islands	Tier 5	10
South Sudan	Tier 5	10
Sri Lanka	Tier 5	10
Sudan	Tier 5	10
Suriname	Tier 5	10
Swaziland	Tier 5	10
Syria	Tier 5	10
Tajikistan	Tier 5	10
Tanzania	Tier 5	10
Togo	Tier 5	10
Tokelau	Tier 5	10
Tonga	Tier 5	10
Turkey	Tier 5	10
Tuvalu	Tier 5	10
Uganda	Tier 5	10
Ukraine	Tier 5	10
Uruguay	Tier 5	10
Uzbekistan	Tier 5	10
Vanuatu	Tier 5	10
Venezuela	Tier 5	10
Vietnam	Tier 5	10
Western Sahara	Tier 5	10
Yemen	Tier 5	10
Zambia	Tier 5	10
Zimbabwe	Tier 5	10
""".strip().split("\n")

# Convert into structured DataFrame
structured_data = [line.split("\t") for line in raw_data]
df = pd.DataFrame(structured_data, columns=["Country", "Tier", "Score"])

# Function to get country code using pycountry
def get_country_code(name):
    try:
        return pycountry.countries.lookup(name).alpha_2
    except LookupError:
        return None

# Apply and collect unmatched for review
df["Country Code"] = df["Country"].apply(get_country_code)
unmatched = df[df["Country Code"].isna()]["Country"].unique().tolist()

df.head(), unmatched


# Manual corrections for unmatched country names
manual_corrections = {
    "Saint Barth": "BL",
    "Saint Martin (Dutch part)": "SX",
    "United Kingdom (UK)": "GB",
    "United States (US)": "US",
    "United States (US) Minor Outlying Islands": "UM",
    "Vatican": "VA",
    "Czechia (Czech Republic)": "CZ",
    "South Korea": "KR",
    "Virgin Islands (US)": "VI",
    "Brunei": "BN",
    "Cape Verde": "CV",
    "Falkland Islands": "FK",
    "Reunion": "RE",
    "Micronesia": "FM",
    "Russia": "RU",
    "Virgin Islands (British)": "VG",

    "Ivory Coast": "CI",
    "Congo (Brazzaville)": "CG",
    "Congo (Kinshasa)": "CD",
    "Palestinian Territory": "PS",
    "Saint Helena": "SH",
    "São Tomé and Príncipe": "ST",
    "South Georgia/Sandwich Islands": "GS",
    "Swaziland": "SZ",
    "Turkey": "TR",
    "Belau": "PW",
    "Bonaire, Saint Eustatius and Saba": "BQ",
}

# Apply corrections
df["Country Code"] = df.apply(
    lambda row: manual_corrections.get(row["Country"], row["Country Code"]),
    axis=1
)

# Ensure all countries now have a code
all_matched = df["Country Code"].isna().sum() == 0

df.head(), all_matched
# Save the final DataFrame to a TSV file
df.to_csv("countryTiers.tsv", sep="\t", index=False)
# Print the unmatched countries for review
print("Unmatched countries after manual corrections:")
for country in df[df["Country Code"].isna()]["Country"].unique():
    print(country)
# Print the final DataFrame
print("\nFinal DataFrame:")
print(df)