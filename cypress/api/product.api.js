class ProductApi {

    login(user){
        return cy.api({
            url: '/login',
            method: 'POST',
            body: user,
            failOnStatusCode: false
        })
    }

    create(createProduct, token){
        return cy.api({
            url: '/produtos',
            method: 'POST',
            body: createProduct,
            headers: {
                authorization: token
            },
            failOnStatusCode: false
        })

    }

    delete(productId, token){
        return cy.api({
            url: `/produtos/${productId}`,
            method: 'DELETE',
            headers: {
                authorization: token
            },
            failOnStatusCode: false
        })
    }

}

export default ProductApi