
describe('POST/ users', () => {

  let userRegister
  let usuarioId

  beforeEach(() => {
    cy.fixture('login').then(massa => {
      userRegister = massa
    })
  })

  it('deve cadastrar usuário', () => {

    cy.request({
      url: '/usuarios',
      method: 'POST',
      body: userRegister,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(201)
      expect(response.body._id).to.be.a('string').and.not.be.empty
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')

      usuarioId = response.body._id
    })
  })

  it('deve realizar login', () => {

    cy.request({
      url: '/login',
      method: 'POST',
      body: {
        email: userRegister.email,
        password: userRegister.password
      },
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Login realizado com sucesso')
      expect(response.body.authorization).to.be.a('string').and.not.be.empty
    })
  })

  it('deve deletar usuário', () => {

    cy.request({
      method: 'DELETE',
      url: `/usuarios/${usuarioId}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq('Registro excluído com sucesso')
    })
  })
})