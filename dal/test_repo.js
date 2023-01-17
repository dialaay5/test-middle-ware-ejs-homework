const knex = require('knex')
const config = require('config')

const connectedKnex = knex({
    client: 'pg',
    version: config.db.version,
    connection: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    }
})

const get_all_test = () => {
    return connectedKnex('test').select('*');
}

const get_test_by_id = id => {
    return connectedKnex('test').select('*').where('id', id).first()
}

const insert_test = employee => {
    return connectedKnex('test').returning('id').insert(employee)
}

const update_test = (id, employee) => {
    return connectedKnex('test').where('id', id).update(employee)
}

const delet_test_by_id = (id) => {
    return connectedKnex('test').where('id', id).del()
}
const patch_test = (id, employee) => {
    return connectedKnex('test').where('id', id).update(employee)
}

module.exports = {
    get_all_test,
    get_test_by_id,
    insert_test,
    update_test, 
    delet_test_by_id,
    patch_test
}

