import UsersApi from '../api/users.api'


describe('POST/ users', () => {


  const usersApi = new UsersApi()
  let userRegister
  let usuarioId

  beforeEach(() => {
    cy.fixture('login').then(massa => {
      userRegister = massa
    })
  })

  before(() => {
    usersApi.deleteUser(usuarioId)
  })

  it('deve cadastrar usuário', () => {

    usersApi.create(userRegister).then(response => {
      expect(response.status).to.eq(201)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.all.keys('message', '_id');

      expect(response.body.message)
        .to.be.a('string')
        .and.not.be.empty

      expect(response.body._id)
        .to.be.a('string')
        .and.not.be.empty

      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      cy.log(JSON.stringify(response.body));


      usuarioId = response.body._id
    })
  })

  it('deve exibir mensagem para e-mail já utilizado', () => {

    usersApi.create(userRegister).then(response => {
      expect(response.status).to.eq(400)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('message')
        .that.is.a('string')
        .and.not.empty

      expect(response.body.message).to.be.eq('Este email já está sendo usado')
    })
  })

  it('deve realizar login', () => {

    usersApi.login(userRegister.email, userRegister.password).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.all.keys('message', 'authorization')

      expect(response.body)
        .to.have.property('message')
        .that.is.a('string')
        .and.not.empty

      expect(response.body)
        .to.have.property('authorization')
        .that.is.a('string')
        .and.not.empty

      expect(response.body.message).to.eq('Login realizado com sucesso')
      cy.log(JSON.stringify(response.body));
    })
  })

  it('deve retornar mensagem de email ou senha inválidos para senha errada', () => {
    usersApi.login(userRegister.email, 'SenhaErrada').then(response => {
      expect(response.status).to.eq(401)
    })
  })

  it('deve retornar mensagem de email ou senha inválidos para email errado', () => {
    usersApi.login('emailerrado@qa.com.br', userRegister.password).then(response => {
      expect(response.status).to.eq(401)

    })
  })

  it('deve deletar usuário', () => {

    cy.api({
      method: 'DELETE',
      url: `/usuarios/${usuarioId}`,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      expect(Object.keys(response.body)).to.have.length(1);

      expect(response.body)
        .to.have.property('message')
        .that.is.a('string')
        .and.not.empty

      expect(response.body.message).to.eq('Registro excluído com sucesso')
      cy.log(JSON.stringify(response.body));
    })
  })
})