import Users from '../controllers/user';
import Queries from '../controllers/query';

export default (app) => {

    const baseUrl= '/api/v1';

    app.get(baseUrl, (req, res) => res.status(200).send({
        message: 'Welcome to the BookStore API!',
    }));

    app.post(`${baseUrl}/register`, Users.signUp); // user register
    app.put(`${baseUrl}/users/:userId`, Users.updateUser); // update user
    app.put(`${baseUrl}/login`, Users.login); // user login
    app.put(`${baseUrl}/resetpassword`, Users.resetUserPassword); // resets the password, needs token and password in body
    app.delete(`${baseUrl}/users/:userId`, Users.deleteUser); // delete user by ID
    app.get(`${baseUrl}/users`, Users.getAllUsers); // get all users
    app.get(`${baseUrl}/users/:userId`, Users.getUser); // get user by ID
    app.get(`${baseUrl}/isAdmin`, Users.isAdministrator); // get user admin status


    app.post(`${baseUrl}/:userId/queries`, Queries.create); // creating a book object
    app.delete(`${baseUrl}/:queryId/queries`, Queries.removeQuery); // remove book object
    app.put(`${baseUrl}/queries/:queryId`, Queries.updateQuery); // update a book by specified bookId
    app.get(`${baseUrl}/queries`, Queries.getAllQueries); // return all the books in the database
    app.get(`${baseUrl}/:userId/queries`, Queries.getUserQueries); // return all the books that belong to the user with userId
    app.get(`${baseUrl}/queries/:queryId`, Queries.getQueryById); // return the book by specified bookId
};
