import model from '../models';
const { Inquiry } = model;

const Api = require('./api');

let latestResponse = null;

async function getAnswerFromWatson(req, res, question, context) {
    await Api.sendRequest(question, context, () => {});

    let d = await Api.getResponsePayload();

    let myObject = new Object();

    // This is how we get multiple answers if there are such
    (d.output.generic).forEach(function (answer, index) {
        if (answer.response_type === 'text') {
            myObject[index] = answer.text;
        }
    });

    res.status(200).send({
        success: true,
        message: 'Message sent and answer received',
        data: {
            message: myObject
        }
    });
}

function getSessionIdFromWatson(req, res) {


    Api.getSessionId(async function () {

        if (Api.sessionStatusCode() === 200) {

            getAnswerFromWatson(req, res, '', null)
                .then(()=>{
                    console.log('Success');
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            res.status(Api.sessionStatusCode()).send({
                success: false,
                message: 'Something went wrong'
            });
        }
    });
}


class Inquiries {


    /**
     * This is used to initialize the API since it sets the session ID and sends a empty/initial request to WA
     * @param req request object, which is in this case empty
     * @param res
     * @return {{sessionId: void}}
     */
    static getSessionId(req, res){
        getSessionIdFromWatson(req, res);
    }

    static async askedQuestion(req, res) {
        console.log(`Question called`);
        const {question} = req.body;
        if (question !== undefined && question !== '') {

            // this is the previous context of the conversation sent by the Watson API
            latestResponse = await Api.getResponsePayload();

            console.log(latestResponse);

            if( latestResponse != null && latestResponse !== undefined && latestResponse.context !== undefined) {

                getAnswerFromWatson(req, res, question, latestResponse.context)
                    .then(()=>{
                        console.log('Success');
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                getSessionIdFromWatson(req, res);
            }
        } else {
            // getSessionId needs to be called only once in order to declare the variable in the Api
            Api.getRequestPayload();
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
