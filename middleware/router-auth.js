export default function ({ store, redirect, route }) {
  if (store.state.user.user.email) {
    if (isAdminRoute(route)) {
      if (!store.state.user.user.admin) {
        redirect('/');
      }
    }
    if (isHomeRoute(route)) {
      redirect('/home');
    }
  } else if (!isLoginRoute(route)) {
    redirect('/auth/login');
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
