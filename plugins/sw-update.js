export default async function checkForUpdate(context, err, firstTime = true) {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      registration.update();
      if (firstTime) {
        registration.addEventListener('updatefound', () => {
          // any code you need to do to suppress "unsaved changes" warnings
          alert('New version available. Please reload the page.');
          window.location.reload();
        });
      }
    }
  }
  setTimeout(() => checkForUpdate(context, err, false), 1000 * 60 * 60 * 24);
}
