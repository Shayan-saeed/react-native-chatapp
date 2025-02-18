export const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
  
    const date = new Date(timestamp.seconds * 1000);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
  
    hours = hours % 12 || 12;
  
    return `${hours}:${minutes} ${ampm}`;
  };
  