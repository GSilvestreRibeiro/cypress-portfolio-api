import ProductApi from "../../service/productRequest.api"
import UsersApi from "../../service/usersRequest.api"


describe('Produtos', () => {

    const productApi = new ProductApi()
    const usersApi = new UsersApi()

    let createProduct
    let user
    let token
    let user_edit
    let usuarioId

    before(() => {
        cy.fixture('product').then((massa) => {
            user = massa.user
            createProduct = massa.createProduct
            user_edit = massa.user_edit

            usersApi.consultUserByEmail(user.email).then((responseConsult) => {
                if (responseConsult.body.quantidade === 0) {
                    usersApi.create(user)
                }
            })
            cy.loginSession(user).then(response => {
                token = response.body.authorization
            })
            cy.consultEmail(user.email).then((response) => {
                if(response.body.usuarios[0].administrador === 'false') {
                    usuarioId = response.body.usuarios[0]._id
                    cy.editarUsuario(usuarioId, user)
                }
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

        it('deve dar erro de 401 token ausente', () => {
            productApi.create(createProduct).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')

            })
        })

        it('deve cadastrar produto', () => {
            productApi.create(createProduct, token).then(response => {
                expect(response.status).to.eq(201)
                expect(response.body.message).to.eq('Cadastro realizado com sucesso')
                expect(response.body._id).to.not.be.empty
                expect(response.body._id).to.be.a('string')

                const productId = response.body._id

                cy.deletarProduto(productId, token).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body.message).to.eq('Registro excluído com sucesso')
                })
            })
        })

        it('deve dar erro 400 de nome já existente', () => {
            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id
                expect(response.status).to.eq(201)
                expect(response.body.message).to.eq('Cadastro realizado com sucesso')

                productApi.create(createProduct, token).then(response => {
                    expect(response.status).to.eq(400)
                    expect(response.body.message).to.eq('Já existe produto com esse nome')

                    cy.deletarProduto(productId, token).then(response => {
                        expect(response.status).to.eq(200)
                        expect(response.body.message).to.eq('Registro excluído com sucesso')
                    })
                })
            })
        })

        it('deve dar erro 403 rota exclusiva para administradores', () => {
            cy.consultEmail(user.email).then(response => {
                expect(response.status).to.eq(200)
                cy.log('antes do if')
                if (response.body.usuarios[0].administrador === 'true') {
                    cy.log('entrou no if')
                    usuarioId = response.body.usuarios[0]._id
                    cy.editarUsuario(usuarioId, user_edit).then(response => {
                        expect(response.status).to.eq(200)
                    })
                    productApi.create(createProduct, token).then(response => {
                        expect(response.status).to.eq(403)
                        expect(response.body.message).to.eq('Rota exclusiva para administradores')
                    })
                } else {
                    productApi.create(createProduct, token).then(response => {
                        expect(response.status).to.eq(403)
                        expect(response.body.message).to.eq('Rota exclusiva para administradores')
                    })
                }
                cy.editarUsuario(usuarioId, user).then(response => {
                    expect(response.status).to.eq(200)
                })
            })
        })
    })

    context('listar produtos', () => {
        
    })

    context('excluir produto', () => {

        it('deve excluir produto com sucesso', () => {
            cy.cadastrarProduto(createProduct, token).then(response => {
                expect(response.status).to.eq(201)
                const productId = response.body._id
                expect(response.body.message).to.eq('Cadastro realizado com sucesso')

                productApi.delete(productId, token).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body.message).to.eq('Registro excluído com sucesso')
                })
            })
        })
        it('deve retornar 200 para nenhum produto excluido', () => {
            cy.cadastrarProduto(createProduct, token).then((createResponse) => {
                expect(createResponse.status).to.eq(201)
                const productId = createResponse.body._id

                cy.deletarProduto(productId, token).then((firstDelete) => {
                    expect(firstDelete.status).to.eq(200)

                    cy.deletarProduto(productId, token).then(secondDelete => {
                        expect(secondDelete.status).to.eq(200)
                        expect(secondDelete.body.message).to.eq('Nenhum registro excluído')
                    })
                })
            })
        })
        //it('deve retornar 400 para produto faz parte de carrinho') implementar quando criar os metodos do carrinho
        it('deve retornar 401 para token ausente', () => {
            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id
                expect(response.status).to.eq(201)
                expect(response.body.message).to.eq('Cadastro realizado com sucesso')

                productApi.delete(productId).then(response => {
                    expect(response.status).to.eq(401)
                    expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')
                })
                cy.deletarProduto(productId, token).then(response => {
                    expect(response.status).to.eq(200)
                    expect(response.body.message).to.eq('Registro excluído com sucesso')
                })
            })
        })
        it('deve retornar 403 rota exclusiva para administradores', () => {
            cy.cadastrarProduto(createProduct, token).then(response => {
                expect(response.status).to.eq(201)
                const productId = response.body._id

                cy.consultEmail(user.email).then(response => {
                    if (response.body.usuarios[0].administrador === 'true') {
                        cy.log('entrou no if')
                        const usuarioId = response.body.usuarios[0]._id
                        cy.editarUsuario(usuarioId, user_edit).then(response => {
                            expect(response.status).to.eq(200)
                        })
                        cy.deletarProduto(productId, token).then(response => {
                            expect(response.status).to.eq(403)
                            expect(response.body.message).to.eq('Rota exclusiva para administradores')
                        })
                    } else {
                        cy.deletarProduto(createProduct, token).then(response => {
                            expect(response.status).to.eq(403)
                            expect(response.body.message).to.eq('Rota exclusiva para administradores')
                        })
                    }
                    cy.editarUsuario(usuarioId, user).then(response => {
                        expect(response.status).to.eq(200)
                    })
                })
            })
        })
    })
})