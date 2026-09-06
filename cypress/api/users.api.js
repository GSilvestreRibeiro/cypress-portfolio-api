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

    consultUserByEmail(email){
        return cy.api({
            url: `/usuarios?email=${email}`,
        })
    }

    consultUser(query = {}) {
        const params = new URLSearchParams(query).toString()
        const url = params ? `/usuarios?${params}` : '/usuarios'

        return cy.api({
            url,
            failOnStatusCode: false
        })
    }

    consultUserById(usuarioId){
        return cy.api ({
            url: `/usuarios/${usuarioId}`,
            failOnStatusCode: false
        })
    }

    editUser(usuarioId, userEdit){
        return cy.api ({
            url: `/usuarios/${usuarioId}`,
            method: 'PUT',
            body: userEdit,
            failOnStatusCode: false
        })
    }
}

export default UsersApi