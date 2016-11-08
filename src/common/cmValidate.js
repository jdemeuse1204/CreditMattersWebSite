export function validate(controller, options) {

    const response = new Promise((resolve, reject) => {

        controller.validate(options).then(errors => {
            if (errors.length === 0) {
                resolve();
            } else {
                reject(errors);
            }
        });

    });

    return response;
}