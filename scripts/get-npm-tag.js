run();

function run() {
    const DEVELOP = 'develop';
    const MASTER = 'master';
    const LATEST = 'latest';
    const currentBranch = process.argv[2];

    if (isPushToBranch(MASTER, currentBranch)) {
        writeValue(LATEST);
        return;
    }

    writeValue(DEVELOP);
    return;
}

function isPushToBranch(expectedBranch, currentBranch) {
    return !process.env.GITHUB_BASE_REF && currentBranch === expectedBranch;
}

function writeValue(value) {
    process.stdout.write(value);
}
