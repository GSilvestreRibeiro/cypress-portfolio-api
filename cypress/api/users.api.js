class UsersApi {

    create(body){
        return cy.api({
            url: '/usuarios',
            method: 'POST',
            body: body,
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

    deleteUser(id){
        return cy.api({
            url: `/usuarios/${id}`,
            method: 'DELETE',
            failOnStatusCode: false
        })

    }

    consultUserByEmail(email){
        return cy.api({
            url: `/usuarios?email=${email}`,
            failOnStatusCode: false
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

    editUser(usuarioId, user_edit){
        return cy.api ({
            url: `/usuarios/${usuarioId}`,
            method: 'PUT',
            body: user_edit,
            failOnStatusCode: false
        })
    }
}

export default UsersApi