Cypress.Commands.add('cadastrarProduto', (createProduct, token) => {
    return cy.api({
        url: '/produtos',
        method: 'POST',
        body: createProduct,
        headers: {
                authorization: token
            },
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('deletarProduto', (productId, token) => {
    return cy.api({
        url: `/produtos/${productId}`,
        method: 'DELETE',
        headers: {
                authorization: token
            },
        failOnStatusCode: false
    }).then(response => { return response })
})

Cypress.Commands.add('consultarProduto', (queryParams = {}) => {
        return cy.api ({
           url: '/produtos',
           method: 'GET',
           qs: queryParams,
           failOnStatusCode: false
        })
})