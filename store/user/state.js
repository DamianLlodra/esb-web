export default () => ({
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : {},
});
