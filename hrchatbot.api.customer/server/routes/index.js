import Users from '../controllers/user';
import Queries from '../controllers/query';

export default (app) => {

    const baseUrl = '/api/v1';

    app.get(baseUrl, (req, res) => res.status(200).send({
        message: 'Welcome to the BookStore API!',
    }));

    // USER routes
    // INSERT
    app.post(`${baseUrl}/register`, Users.signUp); // user register
    app.post(`${baseUrl}/resetPasswordLink`, Users.generateUserResetLink); // generate reset password link
    // UPDATE
    app.put(`${baseUrl}/users/:userId`, Users.updateUser); // update user
    app.put(`${baseUrl}/login`, Users.login); // user login
    app.put(`${baseUrl}/resetpassword`, Users.resetUserPassword); // resets the password, needs token and password in body
    app.put(`${baseUrl}/reset/:userHash`, Users.resetUserPasswordLink); // resets the password, needs token and password in body

    // DELETE
    app.delete(`${baseUrl}/users/:userId`, Users.deleteUser); // delete user by ID
    // GET
    app.get(`${baseUrl}/users`, Users.getAllUsers); // get all users
    app.get(`${baseUrl}/users/:userId`, Users.getUser); // get user by ID
    app.get(`${baseUrl}/isAdmin`, Users.isAdministrator); // get user admin status
    app.post(`${baseUrl}/isLoggedIn`, Users.isLoggedIn);


    // User Question
    app.post(`${baseUrl}/question`, Queries.askedQuestion);

    app.get(`${baseUrl}/session`, Queries.getSessionId);

    // QUERIES routes
    // INSERT
    // app.post(`${baseUrl}/:userId/queries`, Queries.create); // creating a query object
    // DELETE
    // TODO: remove this if we don't wanna allow query deletions
    app.delete(`${baseUrl}/:queryId/queries`, Queries.removeQuery); // remove query object
    // UPDATE
    app.put(`${baseUrl}/queries/:queryId`, Queries.updateQuery); // update a query by specified queryId
    // GET
    app.get(`${baseUrl}/queries`, Queries.getAllQueries); // return all the queries in the database
    app.get(`${baseUrl}/:userId/queries`, Queries.getUserQueries); // return all the queries that belong to the user with userId
    app.get(`${baseUrl}/queries/:queryId`, Queries.getQueryById); // return the query by specified queryId

    // FOR THE ANALYTICS PART
    app.get(`${baseUrl}/entities`, Queries.getAllEntities);
    app.get(`${baseUrl}/entityCount`, Queries.getAllEntitiesCount);
    app.get(`${baseUrl}/entityList`, Queries.getEntityList);
    app.get(`${baseUrl}/entities/:entity`, Queries.getEntitiesByName);

    app.get(`${baseUrl}/intents`, Queries.getAllIntents);
    app.get(`${baseUrl}/intentCount`, Queries.getAllIntentCount);
    app.get(`${baseUrl}/intentList`, Queries.getIntentList);
    app.get(`${baseUrl}/intents/:intent`, Queries.getIntentsByName);

    app.get(`${baseUrl}/dailyCount`, Queries.getDailyCount); // questions asked per day

};
