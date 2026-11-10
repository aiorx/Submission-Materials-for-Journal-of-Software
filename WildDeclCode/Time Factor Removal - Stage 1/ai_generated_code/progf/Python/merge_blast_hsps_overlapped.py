#
#
# merge HSPs into subject-specific summary statistics
#
# INPUT: output from blastn -fmt 5 (XML)
#
# Composed with basic coding tools v4 
#
# Prompt1: 
#
# please write a short python program using biopython that can read
# the output from command-line blastn and merge all the HSP results
# into a set of per-hit (query, subject pairs), just as the website does. 
# Use existing packages to keep the code concise. 
# 
# Prompt2 
#
# Very good. Instead of just summing the hsp.align_length and
# hsp.identities, do correct overlap calculations to compute what
# percentage of the query sequence is covered by the any hsp. When
# processing and HSP, compute how much of that HSP covers query
# sequence that has not yet been overlapped by an HSP, and only add in
# the percentage of the hsp's identity score that matches the
# percentage of the hsp's length that is not already covered by
# previous hsps.
#
from Bio.Blast import NCBIXML

verbose=False

def parse_blast_output(xml_file):
    print("align_summary	blast_record.id	alignment.hit_id	effective_length	effective_identities	identity_percentage	coverage_percentage")
    with open(xml_file, 'r') as result_handle:
        blast_records = NCBIXML.parse(result_handle)

        for blast_record in blast_records:
            query_length = blast_record.query_length
            covered_segments = []  # List to keep track of covered segments of the query

            for alignment in blast_record.alignments:
                print("# alignment: {} len: {}".format(alignment.hit_id, alignment.length) )
                effective_length = 0
                effective_identities = 0

                for hsp in alignment.hsps:
                    # Calculate non-overlapping part of the current HSP
                    hsp_start, hsp_end = hsp.query_start, hsp.query_end
                    hsp_length = hsp.align_length
                    hsp_identities = hsp.identities

                    # Adjust for overlaps
                    non_overlapping_length = hsp_length
                    for covered_start, covered_end in covered_segments:
                        if hsp_end <= covered_start or hsp_start >= covered_end:
                            continue  # No overlap
                        # Calculate overlap and adjust non_overlapping_length
                        overlap = min(hsp_end, covered_end) - max(hsp_start, covered_start)
                        non_overlapping_length -= overlap

                    # Update effective_length and identities based on non-overlapping portion
                    if non_overlapping_length > 0:
                        percentage_of_hsp_non_overlapped = non_overlapping_length / hsp_length
                        effective_length += non_overlapping_length
                        effective_identities += hsp_identities * percentage_of_hsp_non_overlapped
                        # Add this HSP's range to covered_segments
                        covered_segments.append((hsp_start, hsp_end))

                # Sort covered_segments for future overlap checks
                covered_segments.sort()

                identity_percentage = (effective_identities / effective_length) * 100 if effective_length > 0 else 0
                coverage_percentage = (effective_length / query_length) * 100 if query_length > 0 else 0

                if verbose: 
                    print("Query: {}".format(blast_record.query))
                    print("Subject: {}".format(alignment.hit_def))
                    print("Effective Length (non-overlapping): {}".format(effective_length))
                    print("Identity: {:.0f}/{} ({:.2f}%)".format(effective_identities, effective_length, identity_percentage))")
                    print("Coverage of Query Sequence: {:.2f}%".format(coverage_percentage)")
                    print('-' * 20)

                print("align_summary	{}	{}	{}	{}	{}	{}".format(blast_record.query_id, alignment.hit_id, effective_length, effective_identities, identity_percentage, coverage_percentage))

if __name__ == "__main__":
    xml_file = 'blast_output.xml'  # Path to your BLAST XML output
    xml_file = 'results/blastn10_test/a/Keyvirus/JX080302.5.txt'
    parse_blast_output(xml_file)
