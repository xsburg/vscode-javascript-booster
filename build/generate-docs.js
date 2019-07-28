'use strict';

const fs = require('fs-extra');
const pathResolver = require('./pathResolver');

// Copy the root README file into the repo
fs.copyFileSync(pathResolver.repo('README.md'), pathResolver.client('README.md'));

function getReleaseNotes() {
    const endMarker = '## Credits';
    const startMarker = '## Release Notes';
    const readmeContent = fs.readFileSync(pathResolver.repo('README.md'), 'utf8');
    const startIndex = readmeContent.indexOf(startMarker);
    const endIndex = readmeContent.indexOf(endMarker);
    return readmeContent.substring(startIndex + startMarker.length, endIndex).trim();
}
function getChangelogHeader() {
    const changelogContent = fs.readFileSync(pathResolver.client('CHANGELOG.md'), 'utf8');
    const changelogMarker = '<!-- CHANGELOG STARTS HERE -->';
    const changelogIndex = changelogContent.indexOf(changelogMarker);
    return changelogContent.substring(0, changelogIndex + changelogMarker.length).trim();
}
fs.writeFileSync(
    pathResolver.client('CHANGELOG.md'),
    getChangelogHeader() + '\n\n' + getReleaseNotes() + '\n',
    {
        encoding: 'utf8'
    }
);
