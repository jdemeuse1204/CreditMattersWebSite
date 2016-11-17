import { useView } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { account } from '../common/repository';
import globalAjax from '../common/globalAjax';
import { includes } from 'lodash';
import { routes } from '../constants';

@useView('../views/app.html')
export class App {

  constructor() {

    // register global ajax
    globalAjax();

  }

  configureRouter(config, router) {
    var step = new AuthorizeStep;
    config.addAuthorizeStep(step)
    config.title = 'Credit Matters';
    config.map([
      // un auth routes
      { route: ['', 'home'], name: 'home', moduleId: './home', nav: true, title: 'Home' },
      { route: 'login', name: 'login', moduleId: './login', nav: true, title: 'Login' },
      { route: 'register', name: 'register', moduleId: './register', nav: true, title: 'Register' },

      // management routes
      { route: 'Management/ManageCreditItems', name: 'ManageCreditItems', moduleId: './management/manageCreditItems', nav: true, title: 'Manage Credit Items', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/LinkedProfessional', name: 'LinkedProfessional', moduleId: './management/linkedProfessional', nav: true, title: 'Linked Professional', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/StallLetters', name: 'StallLetters', moduleId: './management/stallLetters', nav: true, title: 'Stall Letters', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/Credit Cards', name: 'CreditCards', moduleId: './management/creditCards', nav: true, title: 'Credit Cards', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/HelpfulVideos', name: 'HelpfulVideos', moduleId: './management/helpfulVideos', nav: true, title: 'Helpful Videos', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/EstablishAccounts', name: 'EstablishAccounts', moduleId: './management/establishAccounts', nav: true, title: 'Establish Accounts', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/ResolvingCDS', name: 'ResolvingCDS', moduleId: './management/resolvingCDS', nav: true, title: 'Resolving CDS', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } },
      { route: 'Management/TrackingDisputeActivity', name: 'TrackingDisputeActivity', moduleId: './management/trackingDisputeActivity', nav: true, title: 'Tracking Dispute Activity', layoutView: 'views/layouts/layout.html', layoutViewModel: 'viewmodels/layouts/layout', settings: { auth: true } }
    ]);

    this.router = router;
  }
}

class AuthorizeStep {
  run(navigationInstruction, next) {

    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.auth)) {

      if (includes(navigationInstruction.fragment, "Management/") === true) {

        return account.canAccessManagementPages().then((response) => {

          if (response.Data.success === true) {
            return next();
          }

          return next.cancel(new Redirect(routes.login));
        });
      }

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
