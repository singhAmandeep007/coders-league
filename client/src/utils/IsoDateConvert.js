export default function convertIsoToDate(ISO) {
  var created_date = new Date(ISO);
  return created_date.toDateString().split(" ").slice(1).join(" ");
}

export function IsoToDateWithDay(ISO) {
  var created_date = new Date(ISO);
  return created_date.toDateString();
}

export function IsoToDateWithDayAndTime(ISO) {
  var created_date = new Date(ISO);
  return (
    created_date.toDateString() +
    " " +
    created_date.toTimeString().substring(0, created_date.toTimeString().indexOf("GMT"))
  );
}
