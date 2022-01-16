export default ({ app }, inject) => {
  inject('timeConverter', (UNIX_timestamp, addHtml) => {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = '' + (a.getMonth() + 1);
    let date = '' + a.getDate();
    let hour = '' + a.getHours();
    let min = '' + a.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (date.length < 2)  date = '0' + date;
    if (hour.length < 2)  hour = '0' + hour;
    if (min.length < 2)   min = '0' + min;

    if(addHtml) {
        return '<span> ' + date + '.' + month + '.' + year + '</span><span>' + hour + ':' + min + '</span>';
    }
    else {
        return date + '.' + month + '.' + year + ' ' + hour + ':' + min;
    }
  });
  
  inject('timeConverterOnlyDate', (UNIX_timestamp) => {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = '' + (a.getMonth() + 1);
    let date = '' + a.getDate();

    if (month.length < 2) month = '0' + month;
    if (date.length < 2)  date = '0' + date;

    return date + '.' + month + '.' + year;
  });
  
  inject('timeConverterOnlyTime', (UNIX_timestamp) => {
    let a = new Date(UNIX_timestamp * 1000);
    let hour = '' + a.getHours();
    let min = '' + a.getMinutes();

    if (hour.length < 2)  hour = '0' + hour;
    if (min.length < 2)   min = '0' + min;

    return hour + ':' + min;
  })
}