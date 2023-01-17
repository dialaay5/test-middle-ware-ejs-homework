const assert = require('assert')
const expect = require('chai').expect
const check = require('./exam_check')
const checking_grade = check.grade_validator(100)
console.log(checking_grade);

describe('Testing of the grade_validator functions', () => {

    it('adding grade in the range 0 to 100 (80)', () => {
        const actual = check.grade_validator(80)
        const expected = true
        assert.strictEqual(expected, actual)
    }),

        it('adding grade out of the range (-200)', () => {
            const actual = check.grade_validator(-200)
            const expected = false
            assert.strictEqual(expected, actual)
        }),


        it('adding grade that produces an error (hello)', () => {
            assert.throws(() => {
                const actual = check.grade_validator('hello')
            })
        })
})

