import {inject, Lazy, useView} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

// polyfill fetch client conditionally
const fetch = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);

@useView('../views/users.html')
@inject(Lazy.of(HttpClient))
export class Users {
  heading = 'Github Users';
  users = [];

  constructor(getHttpClient) {
    this.getHttpClient = getHttpClient;
  }

  async activate() {
    // ensure fetch is polyfilled before we create the http client
    await fetch;
    const http = this.http = this.getHttpClient();

    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('https://api.github.com/');
    });

    const response = await http.fetch('users');
    this.users = await response.json();
  }
}
