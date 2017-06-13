/* beautify preserve:start */
import { account } from '../../common/repository';
import { logout, getClaims, getAuthorizationToken } from '../../common/authorization';
import drawer from '../../common/drawer';
import { useView } from 'aurelia-framework';
import { routes } from '../../constants';
import ls from '../../common/localStorage';
import { PLATFORM } from 'aurelia-pal';
/* beautify preserve:end */

@useView(PLATFORM.moduleName('../views/layouts/layout.html'))
export class Layout {

  firstName = '';
  accountType = 'Free Trial';
  profileStatus = '';
  userIsAdmin = false;

  constructor() {

  }

  async activate() {
    const token = getAuthorizationToken();
    const userIsAdminResponse = await account.isAdmin();

    this.userIsAdmin = userIsAdminResponse.Data.success;

    if (!!token) {
      const claims = getClaims(token);
      this.firstName = claims.usr;

      // get profile status
    }
  }

  attached() {
    drawer.initialize();
  }

  logout() {
    logout();
    window.location.href = routes.home;
  }

  drawerNavigate() {

  }
}
