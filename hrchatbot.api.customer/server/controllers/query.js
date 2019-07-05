import model from '../models';

const { Inquiry } = model;
const { User } = model;

const Api = require('./api');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let latestResponse = null;

/**
 *
 * @param req
 * @param res
 * @param question
 * @param context
 * @return {Promise<void>}
 */
async function getAnswerFromWatson(req, res, question, context, id) {
    await Api.sendRequest(question, context, () => {});

    let d = await Api.getResponsePayload();

    let myObject = new Object();
    let ix = 0;
    if(question !== null && question !== undefined && question !== '') {
        // TODO: store here in the database by calling appropriate function
        let firstIntentName = '';
        let firstIntentConfidence = '';

        if(d.output.intents[0] !== null && d.output.intents[0] !== undefined) {
            firstIntentName = d.output.intents[0].intent;
            firstIntentConfidence = d.output.intents[0].confidence;
        }

        let firstEntityName = '';
        let firstEntityLocation = '';
        let firstEntityValue =  '';
        let firstEntityConfidence = '';

        if(d.output.entities[0] !== null && d.output.entities[0] !== undefined) {
            firstEntityName = d.output.entities[0].entity;
            firstEntityLocation = d.output.entities[0].location;
            firstEntityValue = d.output.entities[0].value;
            firstEntityConfidence = d.output.entities[0].confidence;
        }
        let doc = generateIntegerDateFormat(new Date());
        // return
        Inquiry
            .create({
                question: question,
                intent: firstIntentName,
                intentConfidence: parseFloat(firstIntentConfidence),
                entity: firstEntityName,
                location: firstEntityLocation,
                value: firstEntityValue,
                entityConfidence: parseFloat(firstEntityConfidence),
                jsonPayload: JSON.stringify(d),
                dateOfCreation: doc,
                userId: id
            })
        // .then(query => res.status(201).send({
        //     message: `Create a query object`,
        //     query
        // }))
    }
    // This is how we get multiple answers if there are such
    (d.output.generic).forEach(function (answer) {

        if (answer.response_type === 'text') {
            myObject[ix] = answer.text;
            ix++;
        }
    });

    res.status(200).send({
        success: true,
        message: myObject
    });
}

function generateIntegerDateFormat (date) {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const dateDay = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    return parseInt(year+month+dateDay+hours+minutes);
}

function getSessionIdFromWatson(req, res) {

    Api.getSessionId(async function () {

        if (Api.sessionStatusCode() === 200) {

            getAnswerFromWatson(req, res, '', null, 1)
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
        const {question, auth_token} = req.body;

        let userId = 'xyz';
        console.log(auth_token);
        await User
            .findOne({
                where: {
                    auth_token: auth_token
                },
                attributes: [
                    'id'
                ]
            })
            .then(user => {
                // if there is no user under the provided token the server sends
                // back 404 error - resource not found
                if (user !== undefined && user != null) {
                    // Checking if the token is still valid
                    userId = user.get('id');
                }
            }) // ending then
            .catch(function(err) {
                console.log(`Caught and error: ${err}`)
            });

        if (question !== undefined && question !== '' && userId !== 'xyz') {
            // this is the previous context of the conversation sent by the Watson API
            latestResponse = Api.getResponsePayload();

            if( latestResponse != null && latestResponse !== undefined && latestResponse.context !== undefined) {

                getAnswerFromWatson(req, res, question, latestResponse.context, parseInt(userId))
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


    // /**
    //  * Creates a query object in the database
    //  * @param req request object that holds all the values for the columns
    //  * @param res response object used to send back a message to the user
    //  * @return {Promise<T | never>}
    //  */
    // static create(req, res) {
    //     const { question,
    //         intent,
    //         intentConfidence,
    //         entity,
    //         entityConfidence,
    //         location,
    //         value,
    //         jsonPayload,
    //         userId} = req.body;
    //     const { userId } = req.params;
    //     return Inquiry
    //         .create({
    //             question,
    //             answer,
    //             userId,
    //             confidence
    //         })
    //         .then(query => res.status(201).send({
    //             message: `Create a query object`,
    //             query
    //         }))
    // }

    static getAllIntents(req, res) {
        return Inquiry
            .findAll({
                where: {
                    intent: {
                        [Op.notLike]: ""
                    }
                },
                attributes: [
                    'id',
                    'question',
                    'intent',
                    'intentConfidence',
                    'entity',
                    'location',
                    'value',
                    'entityConfidence'
                ],
                group: ['intent', 'id']
            })
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

    static getIntentList(req, res) {
        return Inquiry
            .findAll({
                where: {
                    intent: {
                        [Op.notLike]: ""
                    }
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('intent')) ,'intent']
                ],
                group: ['intent', 'id']
            })
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

    static getEntityList(req, res) {
        return Inquiry
            .findAll({
                where: {
                    entity: {
                        [Op.notLike]: ""
                    }
                },
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('entity')) ,'entity']
                ],
                group: ['entity', 'id']
            })
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

    static getAllIntentCount(req, res) {
        return Inquiry
            .findAll({
                where: {
                    intent: {
                        [Op.notLike]: ""
                    }
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('intent')), 'count'],
                    'intent'
                ],
                group: ['intent']
            })
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

    //TODO possibly change to only when there is intent or entity returned
    static getDailyCount(req, res) {
        return Inquiry
            .findAll({
                // where: {
                //     intent: {
                //         [Op.notLike]: ""
                //     }
                // },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('intent')), 'count'],
                    [Sequelize.fn('LEFT', Sequelize.col('dateOfCreation'), 8), 'doc']
                ],
                order: [
                    [Sequelize.fn('LEFT', Sequelize.col('dateOfCreation'), 8)]
                ],
                group: ['doc']
            })
            .then(queries => {
                // if there are no queries in the database error is returned along with
                // 404 - resource not found code
                if(queries != null && queries.length > 0) {
                    res.status(200).send({
                        success: true,
                        message: 'Queries fetched',
                        queries
                    });
                } else {
                    res.status(404).send({
                        success: false,
                        message: 'There are no queries in the database'
                    });
                }
            });
    }

    static getEntitiesByName(req, res) {
        const { entity } = req.params;
        return Inquiry
            .findAll({
                where: {
                    entity: entity
                }
            })
            .then(queries => {
                if(queries != null && queries.length > 0) res.status(200).send({
                    success: true,
                    message: 'Queries fetched',
                    queries
                });
                else res.status(404).send({
                    success: false,
                    message: 'There are no queries in the database by that entity name'
                });
            })
    }

    static getIntentsByName(req, res) {
        const { intent } = req.params;
        return Inquiry
            .findAll({
                where: {
                    intent: intent
                }
            })
            .then(queries => {
                    if(queries != null && queries.length > 0) res.status(200).send({
                        success: true,
                        message: 'Queries fetched',
                        queries
                    });
                    else res.status(404).send({
                        success: false,
                        message: 'There are no queries in the database by that intent name'
                    });
                }
            )
    }

    static getAllEntities(req, res) {
        return Inquiry
            .findAll({
                where: {
                    entity: {
                        [Op.notLike]: ""
                    }
                },
                attributes: [
                    'id',
                    'question',
                    'intent',
                    'intentConfidence',
                    'entity',
                    'location',
                    'value',
                    'entityConfidence'
                ],
                group: ['entity', 'id']
            })
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


    static getAllEntitiesCount(req, res) {
        return Inquiry
            .findAll({
                where: {
                    entity: {
                        [Op.notLike]: ""
                    }
                },
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('entity')), 'count'],
                    'entity'
                ],
                group: ['entity']
            })
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


    static updateQuery(req, res) {
        const { question,
            intent,
            intentConfidence,
            entity,
            entityConfidence,
            location,
            value,
            jsonPayload,
            userId} = req.body;
        const { queryId } = req.params.queryId;
        return Inquiry
            .findByPk(queryId)
            .then((query) => {
                query.update({
                    question: question || query.question,
                    intent: intent || query.intent,
                    intentConfidence: intentConfidence || query.intentConfidence,
                    entity: entity || query.entity,
                    entityConfidence: entityConfidence || query.entityConfidence,
                    location: location || query.location,
                    value: value || query.value,
                    jsonPayload: jsonPayload || query.jsonPayload,
                    userId: userId || query.userId,
                })
                    .then((updatedQuery) => {
                        res.status.code(200).send({
                            message: 'Query updated successfully',
                            data: {
                                question: updatedQuery.question,
                                intent: updatedQuery.intent,
                                intentConfidence: updatedQuery.intentConfidence,
                                entity: updatedQuery.entity,
                                entityConfidence: updatedQuery.entityConfidence,
                                location: updatedQuery.location,
                                value: updatedQuery.value,
                                jsonPayload: updatedQuery.jsonPayload,
                                userId: updatedQuery.userId,
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
