class UsersApi {

    create(userRegister){
        return cy.api({
            url: '/usuarios',
            method: 'POST',
            body: userRegister,
            failOnStatusCode: false
        })
    }

    login(email, password) {
        return cy.api({
            url: '/login',
            method: 'POST',
            body: {
                email,
                password
            },
            failOnStatusCode: false
        })
    }

    deleteUser(usuarioId){
        return cy.api({
            url: `/usuarios/${usuarioId}`,
            method: 'DELETE',
            failOnStatusCode: false
        })

    }
}

export default UsersApi