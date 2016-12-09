import { findIndex } from 'lodash';

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