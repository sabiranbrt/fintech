export const formatDate = (date: Date) => { 
    const local_timestamp = date;

    const formattedDate = local_timestamp.getFullYear() + "-" +
    String(local_timestamp.getMonth() + 1).padStart(2, "0") + "-" +  // Months are 0-based
    String(local_timestamp.getDate()).padStart(2, "0") + " " +
    String(local_timestamp.getHours()).padStart(2, "0") + ":" +
    String(local_timestamp.getMinutes()).padStart(2, "0") + ":" +
    String(local_timestamp.getSeconds()).padStart(2, "0");
    
    return formattedDate;
}