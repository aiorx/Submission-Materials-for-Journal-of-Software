import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

# Function to parse the revision history into revision number, date, and description, this is Aided using common development resources
def parse_revision_history(revision_history):
    # Join if it's a list and clean the text
    revision_text = ' '.join(revision_history) if isinstance(revision_history, list) else revision_history
    revision_text_cleaned = re.sub(r'\\n|\\', '', revision_text)

    # Regular expression to capture revision number, date, and description
    revision_pattern = r'(\d+\.\d+)\s*(\w+ \d+, \d+)\s*(.*?)(?=\d+\.\d+|\Z)'

    # Find all matches
    revisions = re.findall(revision_pattern, revision_text_cleaned, re.DOTALL)

    # Convert to a list of dictionaries with revision number, date, and description
    parsed_revisions = [{'revision_number': rev[0], 'date': rev[1], 'description': rev[2].strip()} for rev in revisions]

    return parsed_revisions

# Function to classify the likelihood of a patch bypass from parsed revision history, this is Aided using common development resources
def classify_bypass_from_parsed(parsed_revisions):
    # Filter out revisions that are "informational change only"
    filtered_revisions = [rev for rev in parsed_revisions if
                          "informational change only" not in rev['description'].lower()]

    # If there are no revisions left after filtering, return 'unlikely'
    if not filtered_revisions:
        return 'unlikely'

    # Now apply the logic to the remaining revisions
    for rev in filtered_revisions:
        # If the revision involves just table or minor content updates, continue to the next revision
        if re.search(r'security updates table|administrative|content update', rev['description'].lower()):
            continue

        # Clear indication: mentions of "bypass", "patch bypass", "fix re-issued" etc.
        if re.search(r'bypass|patch bypass|re-issued|re-applied|rollback', rev['description'].lower()):
            return 'clear indication'

        # Likely: mentions of multiple revisions with different versions and patches
        if re.search(r'known issue|revised|update \d+\.\d+', rev['description'].lower()):
            return 'likely'

    # Default to unlikely if no significant indicators are found
    return 'unlikely'

#Funtion to drop a cluster if it only has 1 row and the reviosion indication is 'unlikely'
def drop_clusters(group):
    if len(group) == 1 and group['revision_indication'].iloc[0] == 'unlikely':
        return None
    else:
        return group

#Function to compare build numbers, designed to ignore revision number bc it is always different
def compare_build_numbers(bn1, bn2):
    return bn1.split('.')[:3] == bn2.split('.')[:3]

#Function to compare security update tuples of (product, platform, build number)
def overlap_security_updates(su1, su2):
    for (pr1, pl1, bn1) in su1:
        for (pr2, pl2, bn2) in su2:
            if pr1 == pr2 and pl1 == pl2 and compare_build_numbers(bn1, bn2):
                return True
    return False

#Function to keep only records release on same products from different date
#SU stands for security updates, RD stands for release date
def eliminate_by_SU_and_RD(group):
    rows_to_keep = []
    for i, this_row in group.iterrows():
        flag = any(
            overlap_security_updates(this_row['security_updates'], that_row['security_updates'])
            and this_row['Release date'] != that_row['Release date']
            for j, that_row in group.iterrows() if i != j
        )
        if flag:
            rows_to_keep.append(this_row)

    return pd.DataFrame(rows_to_keep)