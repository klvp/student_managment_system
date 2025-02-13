// export function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//     return null;
// }
// export function deleteCookie(name) {
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// }

export function getCookie(key) {
    return sessionStorage.getItem(key)
}
export function deleteCookie(key) {
    sessionStorage.removeItem(key);
}
export function setCookie(key, value) {
    sessionStorage.setItem(key, value);
}