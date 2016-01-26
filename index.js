var trello = require('node-trello'),
    _ = require('lodash'),
    util = require('./util'),
    pickInputs = {
        query: {
            key: 'query',
            type: 'string',
            validate: {
                req: true
            }
        },
        idOrganizations: {
            key: 'idOrganizations',
            type: 'string',
            validate: {
                req: true
            }
        }
    };
module.exports = {
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('trello').credentials(),
            t = new trello(_.get(credentials, 'consumer_key'), _.get(credentials, 'access_token')),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        t.get("/1/search", { query: inputs.query, idOrganizations: inputs.idOrganizations}, function(err, data) {
            if (!err) {
                this.complete({results: data});
            } else {
                this.fail(err);
            }
        }.bind(this));
    }
};
