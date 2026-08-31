function getTwoYearsAgoDate () {
    const now = new Date(); 
    now.setFullYear(now.getFullYear() - 2); 
    const twoYearsAgo = now.toISOString().split('T')[0]; 
    return twoYearsAgo;
  }
    

//Supported via standard programming aids
function unixToDate (unixTimestamp){
    const date = new Date(unixTimestamp * 1000);
    const year = date.getFullYear();

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}