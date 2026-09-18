Cypress.Commands.add('login', (email, password) => {
    return cy.api({
        url: '/login',
        method: 'POST',
        body: {
            email,
            password
        },
        failOnStatusCode: false
    })
})
Cypress.Commands.add('criarUsuario', (body) => {
    return cy.api({
        url: '/usuarios',
        method: 'POST',
        body: body,
        failOnStatusCode: false
    })
})
Cypress.Commands.add('deletarUsuario', (usuarioId) => {
    return cy.api({
        url: `/usuarios/${usuarioId}`,
        method: 'DELETE',
        failOnStatusCode: false
    })
})
Cypress.Commands.add('consultarUsuario', (queryParams = {}) => {
    return cy.api({
        url: '/usuarios',
        method: 'GET',
        qs: queryParams,
        failOnStatusCode: false
    })
})
Cypress.Commands.add('consultarUsuarioPorId', (id) => {
    return cy.api({
        url: `/usuarios/${id}`,
        metho: 'GET',
        failOnStatusCode: false
    })
})
Cypress.Commands.add('editarUsuario', (usuarioId, user_edit) => {
    return cy.api({
        url: `/usuarios/${usuarioId}`,
        method: 'PUT',
        body: user_edit,
        failOnStatusCode: false
    })
})