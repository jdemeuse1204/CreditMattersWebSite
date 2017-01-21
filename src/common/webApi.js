import * as environment from '../environment';
import { HttpClient as FetchClient, json } from 'aurelia-fetch-client';
import { HttpClient } from 'aurelia-http-client';
import { getAuthorizationToken } from "./authorization";
import { merge } from "lodash";
import { routes } from '../constants';

export function post(url, payload, options) {

    let httpClient = new FetchClient();

    //const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val();
    const _jwt = getAuthorizationToken();
    let headers = {
        headers: {
            'X-Requested-With': "XMLHttpRequest",
            'Authorization': `Bearer${_jwt}`
        }
    };

    if (!!options && !!options.addCustomClaimsCallback) {
        headers = options.addCustomClaimsCallback(headers);
    }

    httpClient.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl(environment.repositoryUrl)
            .withDefaults(headers);
    });

    const shouldRedirect = !!options ? options.shouldRedirect === true : true;

    if (!!payload) {
        return httpClient.fetch(url, {
            method: 'POST',
            body: json(payload)
        }).then(response => response.json()).catch(error => {
            httpErrorHandler(error, shouldRedirect);
        });
    }

    return httpClient.fetch(url, {
        method: 'POST'
    }).then(response => response.json()).catch(error => {
        httpErrorHandler(error, shouldRedirect);
    });
}

export function get(url, payload) {

    const client = new HttpClient();
    const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val();
    const _jwt = getAuthorizationToken();
    const partialClient = client.createRequest(url)
        .asGet()
        .withBaseUrl(environment.repositoryUrl)
        .withHeader('X-Requested-With', "XMLHttpRequest")
        .withHeader('Authorization', `Bearer${_jwt}`);

    if (!!payload) {

        return partialClient
            .withParams(payload)
            .send()
            .then(response => {
                return response && response.response ? JSON.parse(response.response) : undefined;
            }).catch(error => {
                httpErrorHandler(error, true);
            });
    }

    return partialClient
        .send()
        .then(response => {
            return response && response.response ? JSON.parse(response.response) : undefined;
        }).catch(error => {
            httpErrorHandler(error, true);
        });
}

export function createKendoDataSource(options, url) {

    const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val();
    const _jwt = getAuthorizationToken();
    const mainOptions = {
        transport: {
            read: {
                url: `${environment.repositoryUrl}${url}`,
                beforeSend: (request) => {
                    request.setRequestHeader('X-Requested-With', "XMLHttpRequest");
                    request.setRequestHeader('Authorization', `Bearer${_jwt}`);
                }
            }
        }
    };

    const mergedOptions = merge(mainOptions, options);

    const model = kendo.data.DataSource.create(mergedOptions);

    return model;
}

function httpErrorHandler(error, shouldRedirect) {

    switch (error.status || error.statusCode) {
        case 401:

            if (shouldRedirect === true) {
                window.location.href = routes.login;
            }
            break;
    };
}
