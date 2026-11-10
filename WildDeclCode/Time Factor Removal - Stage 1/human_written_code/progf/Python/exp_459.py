import argparse
import typing

import yaml
import git

if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    parser.add_argument('file')

    args = parser.parse_args()

    with open(args.file) as f:
        ids = yaml.safe_load(f)

    # find origin
    repo = git.Repo(".")

    origin = repo.remote(name='origin')
    fetch_infos = origin.fetch()
    source_branch = origin.refs["0856085-example"]
    origin_head = repo.head.ref
    source_branch.checkout()

    def exist_branch(name) :
        for info in fetch_infos:
            if name in info.name:
                return True
        return False

    push_count = 0
    try:
        for idx in ids:
            if exist_branch(idx):
                print("{} already exists!".format(idx))
                continue
            print("create {} & push ...".format(idx))
            # create branch
            h = repo.create_head(idx)
            # push
            origin.push(idx)
            # remove local
            repo.delete_head(h)
            push_count += 1

        print("total: {}, push {} branch".format(len(ids), push_count))
    finally:
        origin_head.checkout()
