
describe('Users', () => {



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

      cy.consultarUsuario({ email: massa.user.email }).then((responseConsult) => {

        if (responseConsult.body.quantidade > 0) {
          cy.log('entrou no if')
          usuarioId = responseConsult.body.usuarios[0]._id
          cy.deletarUsuario(usuarioId)
        }
      })
      cy.consultarUsuario({ email: massa.user_delete.email }).then(responseConsult => {

        if (responseConsult.body.quantidade > 0) {
          usuarioId = responseConsult.body.usuarios[0]._id
          cy.deletarUsuario(usuarioId)
        }

        cy.consultarUsuario({ email: massa.user_edit.email }).then(responseConsult => {

          if (responseConsult.body.quantidade > 0) {
            usuarioId = responseConsult.body.usuarios[0]._id
            cy.deletarUsuario(usuarioId)
          }

        })
      })
    })
  })

  context('cadastro de usuários', () => {

    it('deve recusar cadastro sem nome', () => {

      delete user.nome

      cy.criarUsuario(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.nome).to.eq('nome é obrigatório')
      })
    })

    it('deve recusar cadastro sem e-mail', () => {

      delete user.email

      cy.criarUsuario(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.email).to.eq('email é obrigatório')
      })
    })

    it('deve recusar cadastro sem senha', () => {

      delete user.password

      cy.criarUsuario(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.password).to.eq('password é obrigatório')
      })
    })

    it('deve recusar cadastro sem administrador', () => {

      delete user.administrador

      cy.criarUsuario(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.administrador).to.eq('administrador é obrigatório')
      })
    })

    it('deve cadastrar usuário', () => {

      cy.criarUsuario(user).then(response => {
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

      cy.criarUsuario(user).then(response => {
        expect(response.status).to.eq(400)
        expect(response.body).to.be.an('object')
        expect(response.body.message).to.be.eq('Este email já está sendo usado')
      })
    })

  })

  context('listar usuários cadastrados', () => {

    it('deve listar usuário por _id', () => {

      cy.consultarUsuario({ _id: usuarioId }).then(response => {
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

      cy.consultarUsuario({ nome: user.nome }).then(response => {
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

      cy.consultarUsuario({ email: user.email }).then(response => {
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

      cy.consultarUsuario({ password: user.password }).then(response => {
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

      cy.consultarUsuario({ administrador: 'false' }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })

    })
    it('deve listar usuário por administrador true', () => {

      cy.consultarUsuario({ administrador: 'true' }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })
    })
    it('deve listar todos usuários sem campo de filtro', () => {

      cy.consultarUsuario('').then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })
    })
    it('deve retornar lista vazia', () => {

      cy.consultarUsuario({ _id: '454' }).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.quantidade).to.eq(0)
        expect(response.body.quantidade).to.eq(response.body.usuarios.length)
      })
    })

    it('deve retornar usuário por path id', () => {

      cy.consultarUsuarioPorId(usuarioId).then(response => {
        expect(response.status).to.eq(200)

      })
    })
    it('deve retornar erro na busca por path id sem enviar o id', () => {

      cy.consultarUsuarioPorId().then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.id).to.eq('id deve ter exatamente 16 caracteres alfanuméricos')
      })
    })

    it('deve retornar usuário nao encontrao', () => {
      cy.consultarUsuarioPorId('jogfODIlXsqxNFS2').then(response => {
        expect(response.status).to.eq(400)
        expect(response.body.message).to.eq('Usuário não encontrado')
      })
    })
  })

  context('login', () => {

    it('deve realizar login', () => {

      cy.login(user.email, user.password).then(response => {
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
      cy.login(user.email, 'SenhaErrada').then(response => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')
      })
    })

    it('deve recusar login email errado', () => {
      cy.login('emailerrado@qa.com.br', user.password).then(response => {
        expect(response.status).to.eq(401)
        expect(response.body.message).to.eq('Email e/ou senha inválidos')

      })
    })
  })

  context('editar usuário', () => {
    it('deve editar o usuário', () => {
      cy.editarUsuario(usuarioId, user_edit).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro alterado com sucesso')
      })
    })

    it('deve dar erro email duplicado', () => {
      cy.criarUsuario(dup_email).then(responseConsulta => {
        const usuarioId = responseConsulta.body._id
        cy.editarUsuario(usuarioId, dup_email).then(response => {
          expect(response.status).to.eq(400)
          expect(response.body.message).to.eq('Este email já está sendo usado')
        })
      })
    })
  })


  context('deletar usuário', () => {

    it('deve deletar usuário', () => {

      cy.criarUsuario(userdelete).then(response => {
        expect(response.status).to.eq(201)

        usuarioIdRemovido = response.body._id

        cy.deletarUsuario(usuarioIdRemovido).then(response => {
          expect(response.status).to.eq(200)
          expect(response.body).to.be.an('object')
          expect(Object.keys(response.body)).to.have.length(1);
          expect(response.body.message).to.eq('Registro excluído com sucesso')
          cy.log(JSON.stringify(response.body));
        })
      })
    })

    it('deve retornar nenhum usuário deletado com ID já deletado', () => {
      cy.deletarUsuario(usuarioIdRemovido).then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Nenhum registro excluído')
      })
    })

    it('deve retornar nenhum usuário deletado sem passar o ID', () => {
      cy.deletarUsuario().then(response => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Nenhum registro excluído')
      })
    })
  })
})