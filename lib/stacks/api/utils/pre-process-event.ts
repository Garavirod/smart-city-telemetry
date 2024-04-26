
export const preProcessEvent = <T>(event: any) => {
  /* we're expecting something shaped like this because of the
   *  mapping templates we have defined.
   * { "brand_id": "kindred", "model": { ...http body if it exists... } }
   * To keep handlers simpler, we're going to combine what's in the model
   * property so it winds up looking like this:
   * { "brand_id": "kindred", ...http body if it exists... }
   */
  const hasModel = event.model !== void 0;
  const spread = event.model ? { ...event, ...event.model } : { ...event };
  delete spread.model;
  console.debug(`Incoming Event: ${JSON.stringify(event, null, 4)}`);
  if (hasModel) {
    console.debug(`Event after model spread: ${JSON.stringify(spread, null, 4)}`);
  }
  return spread as T;
};