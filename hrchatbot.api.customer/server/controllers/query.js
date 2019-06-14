import model from '../models';
const { Inquiry } = model;

const Api = require('./api');

let latestResponse = null;


class Inquiries {


    /**
     * This is used to intialize the API since it sets the session ID and sends a empty/initial request to WA
     * @param req
     * @param res
     * @return {{sessionId: void}}
     */
    static getSessionId(req, res){
        let sessionId = Api.getSessionId(function() {
            Api.sendRequest('', null);
        });
        return {
            sessionId: sessionId
        }
    }

    static askedQuestion(req, res){
        const { question } = req.body;
        if (question !== undefined && question !== ''){

            // this is the previous context of the conversation
            latestResponse = Api.getResponsePayload();

            // after this has been executed Api has set a response and a request payload
            Api.sendRequest(question, latestResponse.context);

            // 1. staviti question kao request payload na API
            // 2. izvuci iz API-ja response payload

            // 3. sada kada imamo i question i answer
            // payload trebamo stvoriti query objekt

        } else {
            // getSessionId needs to be called only once in order to declare the variable in the Api
            Api.getRequestPayload();
            // Api.getSessionId(function() {
            //     Api.sendRequest('', null);
            // });
            latestResponse = Api.getResponsePayload();
        }
        return {
            question: question,
            responsePayload: latestResponse
        }
    }

    /**
     * Creates a query object in the database
     * @param req request object that holds all the values for the columns
     * @param res response object used to send back a message to the user
     * @return {Promise<T | never>}
     */
    static create(req, res) {
        const { question, answer, confidence } = req.body;
        const { userId } = req.params;
        return Inquiry
            .create({
                question,
                answer,
                userId,
                confidence
            })
            .then(query => res.status(201).send({
                message: `Create a query object`,
                query
            }))
    }

    /**
     *
     * @param req request object that
     * @param res
     * @return {Promise<T | never>}
     */
    static getAllQueries(req, res) {
        return Inquiry
            .findAll()
            .then(queries => {
                // if there are no queries in the database error is returned along with
                // 404 - resource not found code
                if(queries != null && queries.length > 0) res.status(200).send({
                    success: true,
                    message: 'Queries fetched',
                    queries
                });
                else res.status(404).send({
                    success: false,
                    message: 'There are no queries in the database'
                });
            });
    }

    /**
     * Returns user specific queries based on the passed user id, all queries that belong to a single user
     * @param req
     * @param res
     * @return {Promise<T | never>}
     */
    static getUserQueries(req, res) {
        const { userId } = req.params;
        return Inquiry
            .findAll({
                where: {
                    userId: userId
                }
            })
            .then(query => res.status(200).send(query))
    }

    /**
     * Updates the data for the specific query based on its query id
     * @param req
     * @param res
     * @return {Promise<T | never>}
     */
    static updateQuery(req, res) {
        const { question, answer, confidence } = req.body;
        const { queryId } = req.params.queryId;
        return Inquiry
            .findByPk(queryId)
            .then((query) => {
                query.update({
                    question: question || query.question,
                    answer: answer || query.answer,
                    confidence: confidence || query.confidence
                })
                    .then((updatedQuery) => {
                        res.status.code(200).send({
                            message: 'Query updated successfully',
                            data: {
                                title: updatedQuery.title,
                                author: updatedQuery.author,
                                description: updatedQuery.description,
                                quantity: updatedQuery.quantity
                            }
                        })
                    })
                    .catch(error => res.status(400).send(error))
            })
            .catch(error => res.status(400).send(error))
    }

    /**
     * Removes the query from the database based on its query id
     * @param req
     * @param res
     * @return {Promise<T | never>}
     */
    static removeQuery(req, res) {
        const { queryId } = req.params;
        return Inquiry
            .destroy({
                where: {
                    id: queryId
                }
            })
            .then(query => res.status(202).send({
                message: `Query under "${queryId}" id has been removed`,
                book: query
            }))
    }

    /**
     * Returns a single query object based on its passed query id
     * @param req
     * @param res
     * @return {Promise<T | never>}
     */
    static getQueryById(req, res) {
        const { queryId } = req.params;
        return Inquiry
            .findAll({
                where: {
                    id: queryId
                }
            })
            .then(query => res.status(200).send(query))
    }
}

export default Inquiries
