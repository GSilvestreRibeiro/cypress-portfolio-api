

describe ('POST/ users', () => {

  it('realizar login', () => {

    const user = {
      email: 'guilherme@test.com',
      password: 'SenhaForte@123'
    }

    cy.request({
      url: '/api/v1/auth/register',
      method: 'POST',
      body: user,
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(200)
    })
  })
})