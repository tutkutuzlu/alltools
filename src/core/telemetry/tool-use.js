export function createToolUseTracker({ telemetry, toolId, category, debounceMs = 300, setTimer = setTimeout, clearTimer = clearTimeout }) {
  let sent = false;
  let timer;
  return Object.freeze({
    observe(isMeaningful) {
      if (sent || !isMeaningful) return;
      clearTimer(timer);
      timer = setTimer(() => {
        if (sent) return;
        sent = true;
        telemetry.trackToolUse({ toolId, category, source: "meaningful_input" });
      }, debounceMs);
    },
    cancel() { clearTimer(timer); },
    get sent() { return sent; }
  });
}
