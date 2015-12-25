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
    authOptions: function (dexter) {
        if (!dexter.environment('trello_api_key') || !dexter.environment('trello_token')) {
            this.fail('A [trello_api_key] or [trello_token] environment variables are required for this module');
            return false;
        } else {
            return {
                api_key: dexter.environment('trello_api_key'),
                token: dexter.environment('trello_token')
            }
        }
    },
    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var auth = this.authOptions(dexter);

        if (!auth) return;

        var t = new trello(auth.api_key, auth.token),
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
