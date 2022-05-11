/**

Usage:

const data = {
    firstName: 'Mike',
    lastName: 'Tyson'
}

const template = 'Hello my name is {{firstName}} {{lastName}}'

render(template, data)

*/

function render (template, data) {
    return template.replace(/{{(.+?)}}/g, (m, p1) => data[p1])
}