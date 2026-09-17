class ProductApi {

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