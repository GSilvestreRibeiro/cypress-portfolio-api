// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('loginSession', (user) => {
    return cy.api({
        url:'/login',
        method: 'POST',
        body: { email: user.email,
                password: user.password },
        failOnStatusCode: false
    }).then(response => { return response })
})



Cypress.Commands.add('editarUsuario', (usuarioId, user_edit) => {
    return cy.api({
        url: `/usuarios/${usuarioId}`,
        method: 'PUT',
        body: user_edit,
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('consultEmail', (email) => {
    return cy.api({
        url: `/usuarios?email=${email}`,
        failOnStatusCode: false
    }).then(response => { return response })
})