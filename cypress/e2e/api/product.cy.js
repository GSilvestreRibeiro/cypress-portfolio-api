import ProductApi from "../../api/product.api"


describe('Produtos', () => {

    const productApi = new ProductApi()

    let createProduct
    let user
    let token
    let productId

    before(() => {
        cy.fixture('product').then((massa) => {
            user = massa.user
            createProduct = massa.createProduct

            cy.loginSession(user).then(response => {
                token = response.body.authorization
                cy.log(response)
            })
        })
    })
    /*beforeEach(() => {
        cy.fixture('product').then((massa) => {
            createProduct = massa.createProduct
            user = massa.user
        })
    })*/

    context('cadastro de produto', () => {

        it('deve dar erro de token ausente', () => {
            productApi.create(createProduct).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')

            })
        })

        it('deve cadastrar produto', () => {

            productApi.create(createProduct, token).then(response => {
                expect(response.status).to.eq(201)

                const productId = response.body._id

                productApi.delete(productId, token)
            })
        })
    })


    context('excluir produto', () => {

        it('deve excluir produto', () => {

            productApi.create(createProduct, token).then(response => {
                expect(response.status).to.eq(201)

                const productId = response.body._id

                productApi.delete(productId, token).then(response => {
                expect(response.status).to.eq(200)

                })
            })
        })
    })
})