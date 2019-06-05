import Users from '../controllers/user';
import Queries from '../controllers/query';

export default (app) => {

    const baseUrl= '/api/v1';

    app.get(baseUrl, (req, res) => res.status(200).send({
        message: 'Welcome to the BookStore API!',
    }));

    app.post(`${baseUrl}/register`, Users.signUp); // user register
    app.post(`${baseUrl}/login`, Users.login); // user login
    app.post(`${baseUrl}/resetpassword`, Users.resetUserPassword); // resets the password, needs token and password in body
    app.delete(`${baseUrl}/users/:userId`, Users.deleteUser); // delete user by ID
    app.put(`${baseUrl}/users/:userId`, Users.updateUser); // update user
    app.get(`${baseUrl}/users`, Users.getAllUsers); // get all users
    app.get(`${baseUrl}/users/:userId`, Users.getUser); // get user by ID


    // app.post(`${baseUrl}/:userId/books`, Books.create); // creating a book object
    // app.delete(`${baseUrl}/:bookId/books`, Books.removeBook); // remove book object
    // app.put(`${baseUrl}/books/:bookId`, Books.updateBook); // update a book by specified bookId
    // app.get(`${baseUrl}/books`, Books.allBooks); // return all the books in the database
    // app.get(`${baseUrl}/:userId/books`, Books.getBook); // return all the books that belong to the user with userId
    // app.get(`${baseUrl}/books/:bookId`, Books.getBookById); // return the book by specified bookId

    app.post(`${baseUrl}/:userId/queries`, Queries.create); // creating a book object
    app.delete(`${baseUrl}/:queryId/queries`, Queries.removeQuery); // remove book object
    app.put(`${baseUrl}/queries/:queryId`, Queries.updateQuery); // update a book by specified bookId
    app.get(`${baseUrl}/queries`, Queries.getAllQueries); // return all the books in the database
    app.get(`${baseUrl}/:userId/queries`, Queries.getUserQueries); // return all the books that belong to the user with userId
    app.get(`${baseUrl}/queries/:queryId`, Queries.getQueryById); // return the book by specified bookId
};
