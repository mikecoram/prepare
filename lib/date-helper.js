exports.format = formatDate;

const DATE_FORMAT_OPTIONS = {  
    weekday: "long", year: "numeric", month: "short",  
    day: "numeric", hour: "2-digit", minute: "2-digit"  
};

function formatDate(date) {
    return date.toLocaleTimeString('en-uk', DATE_FORMAT_OPTIONS);
}