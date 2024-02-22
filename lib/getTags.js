const inquirer = require('inquirer');

async function getTags(tags) {
    const question = {
        type: 'list', 
        message: 'please select a tag to create api',
        choices: tags,
        name: 'tags'
    }
    const answers = await inquirer.prompt(question);
    return answers.tags
}

module.exports = getTags