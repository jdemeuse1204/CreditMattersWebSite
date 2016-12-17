import { findIndex, forEach } from 'lodash';

export function validate(controller, options) {

    const response = new Promise((resolve, reject) => {

        controller.validate(options).then(response => {

            if (findIndex(response.results, { valid: false }) === -1) {
                resolve();
            } else {
                reject(response);
            }
        });

    });

    return response;
}

export function validateMultiple(controller, options) {

    const response = new Promise((resolve, reject) => {

        let promises = [];

        for(let i = 0; i < options.length; i++) {
            promises.push(controller.validate(options[i]));
        }

        Promise.all(promises).then(values => { 

            let hasErrors = false;

            for(let i = 0; i < values.length; i++) {
                const value = values[i];

                if (value.valid === false) {
                    hasErrors = true;
                    continue;
                }
            }

            if (hasErrors === true) {
                reject();
            } else {
                resolve();
            }
        });
    });

    return response;
}