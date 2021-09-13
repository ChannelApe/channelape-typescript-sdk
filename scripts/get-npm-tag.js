run();

function run() {
    const DEVELOP = 'develop';
    const MASTER = 'master';
    const LATEST = 'latest';
    const currentBranch = process.argv[2];

    if (
        isPullRequestWithTargetBranchOf(MASTER) ||
        isPushToBranch(MASTER, currentBranch)
    ) {
        writeValue(LATEST);
        return;
    }

    if (
        isPullRequestWithTargetBranchOf(DEVELOP) ||
        isPushToBranch(DEVELOP, currentBranch)
    ) {
        writeValue(DEVELOP);
        return;
    }

    writeValue('');
    return;
}

function isPullRequestWithTargetBranchOf(branchName) {
    return process.env.GITHUB_BASE_REF && process.env.GITHUB_BASE_REF === branchName;
}

function isPushToBranch(expectedBranch, currentBranch) {
    return !process.env.GITHUB_BASE_REF && currentBranch === expectedBranch;
}

function writeValue(value) {
    process.stdout.write(value);
}
