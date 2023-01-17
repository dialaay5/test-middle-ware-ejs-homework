const grade_validator = (grade) => {
    if (isNaN(grade)) {
        throw new Error('receives a grade that is not llegal')
    }

    if (grade >= 0 && grade <= 100)
        return true;
    else return false;
}

module.exports = { grade_validator }