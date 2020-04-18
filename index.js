const core = require('@actions/core');
const os = require('os');
const child_process = require('child_process');

async function docker_buildx() {
    try {
        checkPlatform();
        cloneMyself();
        const imageName = extractInput('imageName', true);
        await executeShellScript('install_buildx');
		const buildContext = extractInput('context', false, '.')
        const imageTag = extractInput('tag', false, 'latest');
        const dockerFile = extractInput('dockerFile', false, 'Dockerfile');
        const publish = extractInput('publish', false, 'false').toLowerCase() === 'true';
        const platform = extractInput('platform', false, 'linux/amd64,linux/arm64,linux/arm/v7');
        const buildArg = extractInput('buildArg', false, '');
        const buildFunction = publish ? buildAndPublish : buildOnly;
        await buildFunction(platform, imageName, imageTag, dockerFile, buildArg);
        cleanMyself();
    } catch (error) {
        core.setFailed(error.message);
    }
}

function checkPlatform() {
    if (os.platform() !== 'linux') {
        throw new Error('Only supported on linux platform')
    }
}

function extractInput(inputName, required, defaultValue) {
    const inputValue = core.getInput(inputName);
    if(required) checkRequiredInput(inputName, inputValue);
    return inputValue ? inputValue : defaultValue;
}

function checkRequiredInput(inputName, inputValue) {
    if (!inputValue) {
        throw new Error(`The parameter ${inputName} is missing`);
    }
}

async function executeShellScript(scriptName, ...parameters) {
    parameters = (parameters || []).join(' ');
    const command = `docker_buildx/scripts/${scriptName}.sh ${parameters}`;
    child_process.execSync(command, {stdio: 'inherit'});
}

async function buildAndPublish(platform, imageName, imageTag, dockerFile, buildArg) {
    const dockerHubUser = extractInput('dockerHubUser', true);
    const dockerHubPassword = extractInput('dockerHubPassword', true);
    await executeShellScript('dockerhub_login', dockerHubUser, dockerHubPassword);
    await executeShellScript('docker_build', platform, imageName, imageTag, dockerFile, true, buildArg);
}

async function buildOnly(platform, imageName, imageTag, dockerFile, buildArg) {
	await executeShellScript('cd', buildContext)
    await executeShellScript('docker_build', platform, imageName, imageTag, dockerFile, false, buildArg, buildContext);
}

function cloneMyself() {
    child_process.execSync(`git clone https://github.com/ilteoood/docker_buildx`);
}

function cleanMyself() {
    child_process.execSync(`rm -rf docker_buildx`);
}

docker_buildx();
