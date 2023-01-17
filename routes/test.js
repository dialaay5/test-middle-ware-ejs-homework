const express = require('express')
const router = express.Router()
const test_repo = require('../dal/test_repo')
const logger = require('../logger/my_logger')

/**
*  @swagger
*  components:
*     schemas:
*       test:
*         type: object
*         required:
*           - id
*           - updatedat
*           - name
*           - date
*           - courseid
*         properties:
*           id:
*             type: integer
*             description: The auto-generated id of the test.
*           updatedat:
*             type: string
*             format: date
*             description: The updatedat of the test.
*           name:
*             type: string
*             description: name of the test
*           date:
*             type: string
*             format: date
*             description: The date of the test.
*           courseid:
*             type: int
*             description: courseid of the test
*         example:
*           updatedat: 2023-01-08T15:06:42.441Z
*           name: yosi
*           date: 2023-01-08T15:06:42.441Z-Hall
*           courseid: 3
*/

/**
*  @swagger
*  tags:
*    name: Tests
*    description: API to manage your tests.
*/


/**
*  @swagger
*   /test/:
*     get:
*       summary: List all of the tests
*       tags: [Test]
*       responses:
*         "200":
*           description: The list of tests.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/test'
*/

router.get('/', async (req, resp) => {
    try {
        const employees = await test_repo.get_all_test();
        console.log(employees);
        resp.status(200).json({ employees })
    }
    catch (err) {
        console.log(err);
        logger.error(`error during get all the tests. ${err.message}`)
        resp.status(500).json({ "error": err.message })

    }
})

/**
*  @swagger
*   /test/{id}:
*     get:
*       summary: Gets a test by id
*       tags: [Test]
*       parameters:
*         - in: path
*           name: id
*           schema:
*             type: integer
*           required: true
*           description: The test id
*       responses:
*         "200":
*           description: The list of tests.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/test'
*         "404":
*           description: test not found.
*/

// get end point by id
router.get('/:id', async (req, resp) => {
    try {
        logger.debug(`[tests router][router.get] parameter :id = ${req.params.id}`)
        const employees = await test_repo.get_test_by_id(req.params.id)
        resp.status(200).json(employees)
    }
    catch (err) {
        console.log(err);
        logger.error(`error during get test by id. ${err.message}`)
        resp.status(500).json({ "error": err.message })
    }
})

function is_valid_employee(obj) {
    const result = obj.hasOwnProperty('updatedat') && obj.hasOwnProperty('name') &&
        obj.hasOwnProperty('date') && obj.hasOwnProperty('courseid');

    if (!result) {
        logger.error(`bad object was recieved. ${JSON.stringify(obj)}`)
    }
    return result;
}
//update html הורדתי מתוף הפונקצייה הזו את התאריך שנוצר בו המבחן מכיוון שלא אמור לעדכן אותו בפונקצייה 
function is_valid_employee_without_date(obj) {
    const result = obj.hasOwnProperty('updatedat') && obj.hasOwnProperty('name') && obj.hasOwnProperty('courseid');

    if (!result) {
        logger.error(`bad object was recieved. ${JSON.stringify(obj)}`)
    }
    return result;
}

/**
* 
* @swagger
* /test/:
*     post:
*       summary: Creates a new test
*       tags: [Test]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/test'
*       responses:
*         "200":
*           description: The created test.
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/test'
*/

// ADD
router.post('/', async (req, resp) => {
    console.log(req.body);
    const employee = req.body
    try {
        if (!is_valid_employee(employee)) {
            resp.status(400).json({ error: 'values of employee are not llegal' })
            return
        }
        const result = await test_repo.insert_test(employee)
        resp.status(201).json({
            new_employee: { ...employee, ID: result.rows },
            url: `http://localhost:8080/test/${result.rows}`
        })
    }
    catch (err) {
        console.log(err);
        logger.error(`error during POST in test router. test = ${JSON.stringify(employee)} ${err.message}`)
        resp.status(500).json({ "error": err.message })
    }
})

/**
*  @swagger
*	/test/{id}:
*     put:
*       summary: Updates a test
*       tags: [Test]
*       parameters:
*         - in: path
*           name: id
*           schema:
*             type: integer
*           required: true
*           description: The test id
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/test'
*       responses:
*         "204":
*           description: Update was successful.
*         "404":
*           description: test not found.
*/


// PUT -- UPDATE/replace (or insert)
router.put('/:id', async (req, resp) => {
    console.log(req.body);
    const employee = req.body
    try {
        if (!is_valid_employee_without_date(employee)) {
            resp.status(400).json({ error: 'values of employee are not llegal' })
            return
        }
        const result = await test_repo.update_test(req.params.id, employee)
        resp.status(200).json({
            status: 'updated',
            'how many rows updated': result
        })
    }
    catch (err) {
        console.log(err);
        logger.error(`[tests router][router.put] ERROR: error during PUT.` +
            `employee = ${JSON.stringify(employee)} message = ${err.message}`);
        resp.status(500).json({ "error": err.message })
    }
})


/**
*  @swagger
*	/test/{id}:
*     delete:
*       summary: Deletes a test by id
*       tags: [Test]
*       parameters:
*         - in: path
*           name: id
*           schema:
*             type: integer
*           required: true
*           description: The test id
*       responses:
*         "204":
*           description: Delete was successful.
*         "404":
*           description: test not found.
*/

// DELETE 
router.delete('/:id', async (req, resp) => {
    try {
        logger.debug(`[tests router][router.delete] parameter :id = ${req.params.id}`)
        const result = await test_repo.delet_test_by_id(req.params.id)
        resp.status(200).json({
            status: 'success',
            "how many deleted": result
        })
    }
    catch (err) {
        console.log(err);
        logger.error(`error during DELETE in test router.${err.message}`)
        resp.status(500).json({ "error": err.message })
    }

})
// PATCH -- UPDATE 
router.patch('/:id', async (req, resp) => {
    console.log(req.body);
    const employee = req.body
    try {
        if (!is_valid_employee_without_date(employee)) {
            resp.status(400).json({ error: 'values of employee are not llegal' })
            return
        }
        const result = await test_repo.patch_test(req.params.id, employee)
        resp.status(200).json({
            status: 'patched',
            'how many rows updated': result
        })
    }
    catch (err) {
        console.log(err);
        logger.error(`[tests router][router.patch] ERROR: error during PUT.` +
                      `employee = ${JSON.stringify(employee)} message = ${err.message}`);
        resp.status(500).json({ "error": err.message })
    }
})


module.exports = { router }