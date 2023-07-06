const mysql = require("mysql");

// select user table
const selectTable = mysql.escapeId("user-management.user");

//connecct poll
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

// get all list of user
async function getAllUser(req, res) {
    // connect to DB
    pool.getConnection(selectAll);

    // get list of all user
    function selectAll(err, connection) {
        //error handler
        if (err) {
            console.log(err);
            throw err;
        }

        // select user
        const select = `SELECT * FROM ${selectTable}`;

        connection.query(select, function (err, rows) {
            connection.release();
            if (err) {
                console.log(err);
            }
            // render it for template engine
            return res.render("home", { rows });
        });
    }
}

//find user by search
function findUser(req, res) {
    //get body of request
    let searchItem = req.body.Search;

    // connect to DB
    pool.getConnection(selectBy);

    // select by spesific item
    function selectBy(err, connection) {
        // error handler
        if (err) {
            console.log(err);
            throw err;
        }

        // select by id
        if (Number(searchItem) == searchItem) {
            connection.query(
                `SELECT * FROM ${selectTable} WHERE id = ?`,
                [Number(searchItem)],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        console.log(err);
                    }
                    // render it for template engine
                    return res.render("home", { rows });
                }
            );
            // select by first_name and last_name
        } else {
            connection.query(
                `SELECT * FROM ${selectTable} WHERE first_name LIKE ? OR last_name LIKE ?`,
                ["%" + searchItem + "%", "%" + searchItem + "%"],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        console.log(err);
                    }
                    // render it for template engine
                    return res.render("home", { rows });
                }
            );
        }
    }
}

// add User
function addUserForm(req, res) {
    //get body of request
    const { first_name, last_name, email, phone, comment } = req.body;

    //error handling
    if (!first_name || Boolean(Number(first_name)) || /\s/.test(first_name)) {
        return res.redirect(`/?alert=warning&massage=invalidFirstName`);
    }
    if (!last_name || Boolean(Number(last_name)) || /\s/.test(last_name)) {
        return res.redirect(`/?alert=warning&massage=invalidLastName`);
    }
    if (
        !email ||
        !(typeof email === "string") ||
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
        return res.redirect(`/?alert=warning&massage=invalidEmail`);
    }
    if (
        !phone ||
        !Boolean(Number(phone)) ||
        /\s/.test(phone) ||
        !(phone.length === 10)
    ) {
        return res.redirect(`/?alert=warning&massage=invalidPhone`);
    }
    if (!comment || Boolean(Number(comment))) {
        return res.redirect(`/?alert=warning&massage=invalidComment`);
    }
    // connect to DB
    pool.getConnection(addUser);

    // insert to DB
    function addUser(err, connection) {
        // error handler
        if (err) {
            console.log(err);
            throw err;
        }
        //set all value for new user
        connection.query(
            `INSERT INTO ${selectTable} SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?`,
            [first_name, last_name, email, phone, comment],
            function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                    return res.redirect(`/?alert=warning&massage=faild`);
                }

                return res.redirect(
                    "/?alert=success&massage=userSuccessfullyAdd"
                );
            }
        );
    }
}

//edit userby id
function editUserPage(req, res) {
    // connect to DB
    pool.getConnection(edituser);

    function edituser(err, connection) {
        // error handler
        if (err) {
            console.log(err);
            throw err;
        }

        // select by id
        connection.query(
            `SELECT * FROM ${selectTable} WHERE id = ?`,
            [req.params.id],
            function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                    throw err;
                }
                // render it for template engine
                return res.render("edit-user", { rows });
            }
        );
    }
}

//update user by id
function editUserById(req, res) {
    const { first_name, last_name, email, phone, comments } = req.body;

    const url = req.originalUrl;
    // error handling
    if (
        !first_name ||
        !(typeof first_name === "string") ||
        /\s/.test(first_name)
    ) {
        return res.redirect(`${url}/?alert=warning&massage=invalidFirstName`);
    }
    if (
        !last_name ||
        !(typeof last_name === "string") ||
        /\s/.test(last_name)
    ) {
        return res.redirect(`${url}/?alert=warning&massage=invalidLastName`);
    }
    if (
        !email ||
        !(typeof email === "string") ||
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    ) {
        return res.redirect(`${url}/?alert=warning&massage=invalidEmail`);
    }
    if (
        !phone ||
        !Boolean(Number(phone)) ||
        /\s/.test(phone) ||
        !(phone.length === 10)
    ) {
        return res.redirect(`${url}/?alert=warning&massage=invalidPhone`);
    }
    if (!comments || !(typeof comments === "string")) {
        return res.redirect(`${url}/?alert=warning&massage=invalidComment`);
    }

    pool.getConnection(edituser);

    function edituser(err, connection) {
        // error handler
        if (err) {
            console.log(err);
            throw err;
        }

        // select by id
        connection.query(
            `UPDATE ${selectTable} SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?`,
            [first_name, last_name, email, phone, comments, req.params.id],
            function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                    throw err;
                }
                // render it for template engine
                return res.redirect(`/?alert=success&massage=userUpdate`);
            }
        );
    }
}

//delete user
function deleteUserById(req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            throw err;
        }
        connection.query(
            `DELETE FROM ${selectTable} WHERE id = ?`,
            [req.params.id],
            function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                    return res.redirect(
                        `/?alert=warning&massage=somthingHappened`
                    );
                }
                return res.redirect(
                    `/?alert=success&massage=userSuccesfullyDelete`
                );
            }
        );
    });
}

//view user
function viewUserById(req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            throw err;
        }
        connection.query(
            `SELECT * FROM ${selectTable} WHERE id = ?`,
            [req.params.id],
            function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                    return res.redirect(
                        `/?alert=warning&massage=somthingHappend`
                    );
                }
                return res.render("view-user", { rows });
            }
        );
    });
}

module.exports = {
    getAllUser,
    findUser,
    addUserForm,
    editUserPage,
    editUserById,
    deleteUserById,
    viewUserById,
};
