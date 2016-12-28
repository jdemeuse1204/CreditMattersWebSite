import * as environment from '../environment';
import { HttpClient as FetchClient, json } from 'aurelia-fetch-client';
import { HttpClient } from 'aurelia-http-client';
import loginFunctions from "./loginFunctions";
import { merge } from "lodash";

export function post(url, payload) {

    let httpClient = new FetchClient();

    const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val(),
        _tokenData = loginFunctions(1000).getToken(),
        _jwt = !!_tokenData ? _tokenData.token || "" : "";

    httpClient.configure(config => {
        config
            .useStandardConfiguration()
            .withBaseUrl(environment.repositoryUrl)
            .withDefaults({
                headers: {
                    'X-Requested-With': "XMLHttpRequest",
                    'Authorization': `Bearer${_jwt}`
                }
            });
    });

    if (!!payload) {
        return httpClient.fetch(url, {
            method: 'POST',
            body: json(payload)
        }).then(response => response.json());
    }

    return httpClient.fetch(url, {
        method: 'POST'
    }).then(response => response.json());
}

export function get(url, payload) {

    const client = new HttpClient();
    const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val(),
        _tokenData = loginFunctions(1000).getToken(),
        _jwt = !!_tokenData ? _tokenData.token || "" : "";
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
            });
    }

    return partialClient
        .send()
        .then(response => {
            return response && response.response ? JSON.parse(response.response) : undefined;
        });
}

export function createKendoDataSource(options, url) {

    const _xsrfToken = $(":hidden[name=\"__RequestVerificationToken\"]").val();
    const _tokenData = loginFunctions(1000).getToken();
    const _jwt = !!_tokenData ? _tokenData.token || "" : "";
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
