
# Base Aided using common development resources
# You are a Python expert with experience in AWS. Can you write a script that gets the AMI name as an input, and it finds all AMIs of that name in all regions and add to these AMI a tag. The same for snapshots linked to these AMIs.

# Reviewed and edited

import argparse
import boto3
import sys

def get_regions():
    """Get a list of all regions."""
    ec2 = boto3.client('ec2', region_name='us-east-1')  # 'us-east-1' can list all regions
    regions = [region['RegionName'] for region in ec2.describe_regions()['Regions']]
    return regions

def tag_exists(tags, tag_key, tag_value):
    """
    Check if the tag already exists in the list of tags.
    """
    for tag in tags:
        if tag['Key'] == tag_key and tag['Value'] == tag_value:
            return True
    return False

def find_and_tag_amis(ami_name, tag_key, tag_value):
    """
    Find all AMIs with the given name across all regions and tag them and their snapshots.
    """
    for region in get_regions():
        print("Checking region: {}".format(region))
        ec2 = boto3.client('ec2', region_name=region)
        
        # Find AMIs by name containing the searched string
        ami_search_pattern = "{}*".format(ami_name)
        amis = ec2.describe_images(Filters=[{'Name': 'name', 'Values': [ami_search_pattern]}])['Images']
        for ami in amis:
            ami_id = ami['ImageId']
            if not tag_exists(ami.get('Tags', []), tag_key, tag_value):
                print("  Tagging AMI: {}".format(ami_id))
            else:
                print("  AMI: {} already has the tag.".format(ami_id))

            # Tag the AMI
            ec2.create_tags(Resources=[ami_id], Tags=[{'Key': tag_key, 'Value': tag_value}])
            
            # Find and tag snapshots associated with the AMI
            for device in ami['BlockDeviceMappings']:
                if 'Ebs' in device:
                    snapshot_id = device['Ebs']['SnapshotId']
                    try:
                      snapshot = ec2.describe_snapshots(SnapshotIds=[snapshot_id])['Snapshots'][0]
                      if not tag_exists(snapshot.get('Tags', []), tag_key, tag_value):
                          print("    Tagging Snapshot: {}".format(snapshot_id))
                          ec2.create_tags(Resources=[snapshot_id], Tags=[{'Key': tag_key, 'Value': tag_value}])
                      else:
                          print("    Snapshot: {} already has the tag.".format(snapshot_id))
                    except:
                        sys.stderr.write("ERROR: Snapshot: {} in {} does not exist.
".format(snapshot_id, region))
            #sys.exit(1)

parser = argparse.ArgumentParser(description='Tag AMIs and their snapshots based on AMI name substring.')
parser.add_argument('ami_name', type=str, help='AMI name substring to search for')

args = parser.parse_args()

ami_name = args.ami_name
tag_key = "FedoraGroup"
tag_value = "ga-archives"
find_and_tag_amis(ami_name, tag_key, tag_value)

