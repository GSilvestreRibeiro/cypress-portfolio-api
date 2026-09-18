import UsersApi from "../../service/usersRequest.api"


describe('Produtos', () => {

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
    beforeEach(() => {
        cy.fixture('product').then((massa) => {
            createProduct = massa.createProduct
            

            cy.consultarProduto({ nome: createProduct.nome }).then(responseConsulta => {
                if(responseConsulta.body.quantidade > 0 && responseConsulta.body.produtos[0].nome === (createProduct.nome)){
                const productId = responseConsulta.body.produtos[0]._id
                cy.deletarProduto(productId, token)
                }
            })
        })
    })

    context('cadastro de produto', () => {

        it('deve dar erro de 401 token ausente', () => {
            cy.cadastrarProduto(createProduct).then(response => {
                expect(response.status).to.eq(401)
                expect(response.body.message).to.eq('Token de acesso ausente, inválido, expirado ou usuário do token não existe mais')

            })
        })

        it('deve cadastrar produto', () => {
            cy.cadastrarProduto(createProduct, token).then(response => {
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

                cy.cadastrarProduto(createProduct, token).then(response => {
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
                    cy.cadastrarProduto(createProduct, token).then(response => {
                        expect(response.status).to.eq(403)
                        expect(response.body.message).to.eq('Rota exclusiva para administradores')
                    })
                } else {
                    cy.cadastrarProduto(createProduct, token).then(response => {
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

        it('Deve consultar produto pelo _id', () => {
            
            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id
                expect(response.status).to.eq(201)

                cy.consultarProduto({_id: productId}).then( responseConsulta => {
                    expect(responseConsulta.status).to.eq(200)
                    expect(responseConsulta.body).to.have.all.keys('quantidade', 'produtos')
                    expect(responseConsulta.body.quantidade).to.be.a('number')
                    expect(responseConsulta.body.produtos).to.be.an('array').that.is.not.empty

                    const product = responseConsulta.body.produtos[0]

                    expect(product).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
                    expect(product._id).to.eq(productId)

                    cy.deletarProduto(productId, token)
                })

            })
        })

        it('Deve consultar produto pelo nome', () => {

            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id
                expect(response.status).to.eq(201)

                cy.consultarProduto({nome: createProduct.nome}).then(responseConsulta => {
                    expect(responseConsulta.status).to.eq(200)
                    expect(responseConsulta.body).to.have.all.keys('quantidade', 'produtos')
                    expect(responseConsulta.body.quantidade).to.be.a('number')
                    expect(responseConsulta.body.produtos).to.be.an('array').that.is.not.empty

                    const products = responseConsulta.body.produtos

                    products.forEach(products => {
                        expect(products).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
                        expect(products.nome.toLowerCase()).to.eq(createProduct.nome.toLowerCase())
                    })
                    cy.deletarProduto(productId, token)
                })
            })

        })

        it('Deve consultar produto pelo preço', () => {

            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id

                cy.consultarProduto({preco: createProduct.preco}).then(responseConsulta => {
                    expect(responseConsulta.status).to.eq(200)
                    expect(responseConsulta.body).to.have.all.keys('quantidade', 'produtos')
                    expect(responseConsulta.body.quantidade).to.be.a('number')
                    expect(responseConsulta.body.produtos).to.be.an('array').that.is.not.empty

                    const products = responseConsulta.body.produtos

                    products.forEach(products => {
                        expect(products).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
                        expect(products).to.deep.include(createProduct.preco)
                    })
                    cy.deletarProduto(productId, token)
                })
            })

        })

        it('Deve consultar produto pela descrição', () => {

            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id

                cy.consultarProduto({descricao: createProduct.descricao}).then(responseConsulta => {
                    expect(responseConsulta.status).to.eq(200)
                    expect(responseConsulta.body).to.have.all.keys('quantidade', 'produtos')
                    expect(responseConsulta.body.quantidade).to.be.a('number')
                    expect(responseConsulta.body.produtos).to.be.an('array').that.is.not.empty

                    const products = responseConsulta.body.produtos


                    products.forEach(products => {
                        expect(products).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
                        expect(products.descricao.toLowerCase()).to.include(createProduct.descricao.toLowerCase())
                    })
                    cy.deletarProduto(productId, token)
                })
            })
        })

        it('Deve consultar produto pela quantidade', () => {

            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id

                cy.consultarProduto({quantidade: createProduct.quantidade}).then(responseConsulta => {
                    expect(responseConsulta.status).to.eq(200)
                    expect(responseConsulta.body).to.have.all.keys('quantidade', 'produtos')
                    expect(responseConsulta.body.quantidade).to.be.a('number')
                    expect(responseConsulta.body.produtos).to.be.an('array').that.is.not.empty

                    const products = responseConsulta.body.produtos

                    products.forEach(products => {
                        expect(products).to.have.all.keys('_id', 'nome', 'preco', 'descricao', 'quantidade')
                        expect(products).to.deep.include(createProduct.quantidade)

                    })

                    cy.deletarProduto(productId, token)
                })
            })

        })

        it.only('Deve consultar produto utilizando múltiplos filtros', () => {
            
            cy.cadastrarProduto(createProduct, token).then(response => {
                const productId = response.body._id

                cy.consultarProduto({
                    _id: productId,
                    nome: createProduct.nome,
                    preco: createProduct.preco,
                    descricao: createProduct.descricao,
                    quantidade: createProduct.quantidade
                }).then(responseConsulta => {
                    expect(responseConsulta.status).to.eq(200)
                    expect(responseConsulta.body).to.have.all.keys('quantidade', 'produtos')
                    expect(responseConsulta.body.quantidade).to.be.a('number')
                    expect(responseConsulta.body.produtos).to.be.an('array').that.is.not.empty

                    const products = responseConsulta.body.produtos

                    products.forEach(products => {
                        expect(products).to.deep.include(createProduct)
                    })
                })
                cy.deletarProduto(productId, token)
            })

        })

    })

    context('excluir produto', () => {

        it('deve excluir produto com sucesso', () => {
            cy.cadastrarProduto(createProduct, token).then(response => {
                expect(response.status).to.eq(201)
                const productId = response.body._id
                expect(response.body.message).to.eq('Cadastro realizado com sucesso')

                cy.deletarProduto(productId, token).then(response => {
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

                cy.deletarProduto(productId).then(response => {
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