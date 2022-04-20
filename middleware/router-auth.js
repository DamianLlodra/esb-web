export default function ({ store, redirect, route }) {
  console.log('router-auth.js');
  if (store.state.user.user.email) {
    console.log('user logged in');
    if (isAdminRoute(route)) {
      console.log(route.path);
      if (!store.state.user.user.admin) {
        redirect('/');
      }
    }
    if (isHomeRoute(route)) {
      redirect('/category');
    }
  } else {
    console.log('user not logged in');
    if (!isLoginRoute(route)) {
      console.log('redirect to login');
      redirect('/auth/login');
    }
  }
}
function isHomeRoute(route) {
  if (route.path === '/') {
    return true;
  }
}
function isAdminRoute(route) {
  if (route.matched.some((record) => record.path === '/admin')) {
    return true;
  }
}

function isLoginRoute(route) {
  if (route.matched.some((record) => record.path === '/auth/login')) {
    return true;
  }
}
