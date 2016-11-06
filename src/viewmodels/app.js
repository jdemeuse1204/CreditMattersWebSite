import {useView} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {account} from '../common/repository';
import globalAjax from '../common/globalAjax';
import validation from '../common/validation';

@useView('../views/app.html')
export class App {

  constructor() {

    // register global ajax
    globalAjax();

    // register jquery validation
    validation();
  }

  configureRouter(config, router) {
    var step = new AuthorizeStep;
    config.addAuthorizeStep(step)
    config.title = 'Credit Matters';
    config.map([
      // un auth routes
      { route: ['', 'home'], name: 'home',      moduleId: './home',      nav: true, title: 'Credit Matters - Home' },
      { route: ['login'], name: 'login',      moduleId: './login',      nav: true, title: 'Credit Matters - Login' },

      // management routes
      { route: 'Management/ManageCreditItems', name: 'ManageCreditItems', moduleId: './management/manageCreditItems', nav: true, title: 'Manage Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout' },
      { route: 'users',         name: 'users',        moduleId: './users',        nav: true, title: 'Github Users', settings: { auth: true } },
      { route: 'child-router',  name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
    ]);

    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {

    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {
      return next(); // always authorize for now
      // return account.isAdmin().then((response) => {
        
      //   if (response.Data.success === true) {
      //     return next();
      //   }

      //   return next.cancel(new Redirect('login'));
      // });
    }

    return next();
  }
}
