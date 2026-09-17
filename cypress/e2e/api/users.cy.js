import UsersApi from '../../service/usersRequest.api'


describe('Users', () => {


  const usersApi = new UsersApi()

  let user
  let user_edit
  let dup_email
  let userdelete
  let usuarioId
  let usuarioIdRemovido

  beforeEach(() => { //acessa a massa em todos os testes
    cy.fixture('login').then((massa) => {
      user = massa.user
      user_edit = massa.user_edit
      dup_email = massa.dup_email
      userdelete = massa.user_delete
    })
  })

  before(() => { //exclui o usuário se já houver cadastro na base
    cy.fixture('login').then((massa) => {

      usersApi.consultUserByEmail(massa.user.email).then((responseConsult) => {

        if (responseConsult.body.quantidade > 0) {
          usuarioId = responseConsult.body.usuarios[0]._id
          usersApi.deleteUser(usuarioId)
        }
      })
      usersApi.consultUserByEmail(massa.user_delete.email).then(responseConsult => {

        if (responseConsult.body.quantidade > 0) {
          usuarioId = responseConsult.body.usuarios[0]._id
          usersApi.deleteUser(usuarioId)
        }

        usersApi.consultUserByEmail(massa.user_edit.email).then(responseConsult => {

          if (responseConsult.body.quantidade > 0) {
            usuarioId = responseConsult.body.usuarios[0]._id
            usersApi.deleteUser(usuarioId)
          }

        })
      })
    })
  })

  context('cadastro de usuários', () => {

    it('deve recusar cadastro sem nome', () => {

      delete user.nome

      usersApi.create(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.nome).to.eq('nome é obrigatório')
      })
    })

    it('deve recusar cadastro sem e-mail', () => {

      delete user.email

      usersApi.create(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.email).to.eq('email é obrigatório')
      })
    })

    it('deve recusar cadastro sem senha', () => {

      delete user.password

      usersApi.create(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.password).to.eq('password é obrigatório')
      })
    })

    it('deve recusar cadastro sem administrador', () => {

      delete user.administrador

      usersApi.create(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.administrador).to.eq('administrador é obrigatório')
      })
    })

    it('deve cadastrar usuário', () => {

      usersApi.create(user).then(response => {
        expect(response.status).to.eq(201)
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
        cy.log(JSON.stringify(response.body));
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.all.keys('message', '_id');
        expect(response.body._id)
          .to.be.a('string')
          .and.not.be.empty

        usuarioId = response.body._id
      })
    })

    it('deve exibir mensagem para e-mail já utilizado', () => {

      usersApi.create(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body).to.be.an('object')
        expect(response.body.message).to.be.eq('Este email já está sendo usado')
      })
    })
  })

  context('listar usuários cadastrados', () => {

    it('deve listar usuário por _id', () => {

      usersApi.consultUser({ _id: usuarioId }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(1)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
        expect(response.body.usuarios[0]).to.have.property('nome').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('email').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('password').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('administrador').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('_id').that.is.a('string')
      })
    })
    it('deve listar usuário por nome', () => {

      usersApi.consultUser({ nome: user.nome }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
        expect(response.body.usuarios[0]).to.have.property('nome').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('email').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('password').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('administrador').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('_id').that.is.a('string')
      })

    })
    it('deve listar usuário por email', () => {

      usersApi.consultUser({ email: user.email }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(1)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
        expect(response.body.usuarios[0]).to.have.property('nome').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('email').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('password').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('administrador').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('_id').that.is.a('string')
      })
    })
    it('deve listar usuário por password', () => {

      usersApi.consultUser({ password: user.password }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
        expect(response.body.usuarios[0]).to.have.property('nome').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('email').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('password').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('administrador').that.is.a('string')
        expect(response.body.usuarios[0]).to.have.property('_id').that.is.a('string')
      })
    })
    it('deve listar usuário por administrador false', () => {

      usersApi.consultUser({ administrador: 'false' }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })

    })
    it('deve listar usuário por administrador true', () => {

      usersApi.consultUser({ administrador: 'true' }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })
    })
    it('deve listar todos usuários sem campo de filtro', () => {

      usersApi.consultUser('').then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })
    })
    it('deve retornar lista vazia', () => {

      usersApi.consultUser({ _id: '454' }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(0)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })
    })

    it('deve retornar usuário por path id', () => {

      usersApi.consultUserById(usuarioId).then(response => {
        expect(response.status).to.eq(200)

      })
    })
    it('deve retornar erro na busca por path id sem enviar o id', () => {

      usersApi.consultUserById().then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos')
      })
    })

    it('deve retornar usuário nao encontrao', () => {
      usersApi.consultUserById('jogfODIlXsqxNFS2').then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq('Usuário não encontrado')
      })
    })
  })

  context('login', () => {

    it('deve realizar login', () => {

      usersApi.login(user.email, user.password).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Login realizado com sucesso')
        cy.log(JSON.stringify(response.body));
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.all.keys('message', 'authorization')

        expect(response.body)
          .to.have.property('authorization')
          .that.is.a('string')
          .and.not.empty
      })
    })

    it('deve recusar login para senha errada', () => {
      usersApi.login(user.email, 'SenhaErrada').then(response => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('deve recusar login email errado', () => {
      usersApi.login('emailerrado@qa.com.br', user.password).then(response => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')

      })
    })
  })

  context('editar usuário', () => {
    it('deve editar o usuário', () => {
      usersApi.editUser(usuarioId, user_edit).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro alterado com sucesso')
      })
    })

    it('deve dar erro email duplicado', () => {
      usersApi.editUser(usuarioId, dup_email).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq('Este email já está sendo usado')
      })
    })
  })


  context('deletar usuário', () => {

    it('deve deletar usuário', () => {

      usersApi.create(userdelete).then(response => {
        expect(response.status).to.eq(201)

        usuarioIdRemovido = response.body._id

        usersApi.deleteUser(usuarioIdRemovido).then(response => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('object')
          expect(Object.keys(response.body)).to.have.length(1);
          expect(response.body.message).to.eq('Registro excluído com sucesso')
          cy.log(JSON.stringify(response.body));
        })
      })
    })

    it('deve retornar nenhum usuário deletado com ID já deletado', () => {
      usersApi.deleteUser(usuarioIdRemovido).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Nenhum registro excluído')
      })
    })

    it('deve retornar nenhum usuário deletado sem passar o ID', () => {
      usersApi.deleteUser().then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Nenhum registro excluído')
      })
    })
  })
})