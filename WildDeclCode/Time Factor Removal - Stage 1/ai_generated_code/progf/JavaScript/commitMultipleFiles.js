/**
 * @description Function Designed via basic programming aids after some refinement. This function allows me to make one commit with several files at once. I didn't like how LeetHub made a commit for each file which would spam up to 4 files in one commit. I don't want my GitHub infected with all that BS - I just need one commit for all the files. So, this function does that by using refs and trees and pointers.
 * @returns 
 */
export async function commitMultipleFiles(token, owner, repo, files, commitMessage, branch='main') {
    // Helper function to create a blob
    async function createBlob(content) {
        var response = await fetch("https://api.github.com/repos/" + (owner) + "/" + (repo) + "/git/blobs", {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + (token) + "",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, encoding: 'base64' })
        });
        return await response.json();
    }

    // Create blobs for each file
    var blobs = await Promise.all(files.map(function file { return createBlob(file.content); }));

    // Get the SHA of the latest commit on the branch
    var refResponse = await fetch("https://api.github.com/repos/" + (owner) + "/" + (repo) + "/git/ref/heads/" + (branch) + "", {
        headers: { 'Authorization': "Bearer " + (token) + "" }
    });
    var refData = await refResponse.json();
    console.log(refData)
    console.log('------')

    var parentCommitSha = refData.object.sha;

    // Get the tree SHA from the latest commit to use as base tree
    var baseCommitResponse = await fetch("https://api.github.com/repos/" + (owner) + "/" + (repo) + "/git/commits/" + (parentCommitSha) + "", {
        headers: { 'Authorization': "Bearer " + (token) + "" }
    });
    var commitData = await baseCommitResponse.json();
    var baseTreeSha = commitData.tree.sha;

    // Create a new tree with pointers to the blobs
    var tree = blobs.map(function (blob, index) { return ({
        path: files[index].path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
    }); });
    var treeResponse = await fetch("https://api.github.com/repos/" + (owner) + "/" + (repo) + "/git/trees", {
        method: 'POST',
        headers: {
            'Authorization': "Bearer " + (token) + "",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ base_tree: baseTreeSha, tree })
    });
    var treeData = await treeResponse.json();

    // Create a commit that points to the new tree
    var treeCommitResponse = await fetch("https://api.github.com/repos/" + (owner) + "/" + (repo) + "/git/commits", {
        method: 'POST',
        headers: {
            'Authorization': "Bearer " + (token) + "",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: commitMessage,
            tree: treeData.sha,
            parents: [parentCommitSha]
        })
    });
    var treeCommitData = await treeCommitResponse.json();

    // Update the reference to point to the new commit
    var updateRefResponse = await fetch("https://api.github.com/repos/" + (owner) + "/" + (repo) + "/git/refs/heads/" + (branch) + "", {
        method: 'PATCH',
        headers: {
            'Authorization': "Bearer " + (token) + "",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sha: treeCommitData.sha, force: true })
    });

    return await updateRefResponse.json();
}

// Usage example
// const files = [
//     { path: 'file1.txt', content: btoa('Hello World 3') },
//     { path: 'file2.txt', content: btoa('Hello World 2') }
// ];
// const token = 'fake_token;
// const owner = 'fake_user';
// const repo = 'LeetHub-2.0-File-Testing';
// const commitMessage = 'Commit multiple files in one go';

// commitMultipleFiles(token, owner, repo, files, commitMessage)
//     .then(response => console.log('Commit successful:', response))
//     .catch(error => console.error('Error committing files:', error));
