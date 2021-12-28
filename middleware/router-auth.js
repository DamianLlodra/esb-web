export default function ({ store, redirect, route }) {
  if (!store.state.user.user.email) {
    if (!isLoginRoute(route)) {
      redirect('/auth/login');
    }
  } else if (isAdminRoute(route)) {
    console.log(route.path);
    if (!store.state.user.user.admin) {
      redirect('/');
    }
  }
  if (isHomeRoute(route)) {
    redirect('/category');
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
