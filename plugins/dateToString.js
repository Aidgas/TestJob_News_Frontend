export default ({ app }, inject) => {
  inject('dateToString', (a) => {
    let year = a.getFullYear();
    let month = '' + (a.getMonth() + 1);
    let date = '' + a.getDate();

    if (month.length < 2) month = '0' + month;
    if (date.length < 2)  date = '0' + date;

    return date + '.' + month + '.' + year;
  });
}