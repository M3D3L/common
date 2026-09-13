onRecordUpdate((event) => {
  const previousCatering = event.record.original().get("catering");
  const nextCatering = event.record.get("catering");

  if (nextCatering === null && previousCatering !== null) {
    event.record.set("catering", previousCatering);
  }

  event.next();
}, "menu");
