;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="33f5be41-02b4-1501-08a7-ba1fde2f3ecd")}catch(e){}}();
module.exports = [
"[project]/sentry.server.config.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@sentry/nextjs/build/cjs/index.server.js [instrumentation] (ecmascript)");
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$sentry$2f$nextjs$2f$build$2f$cjs$2f$index$2e$server$2e$js__$5b$instrumentation$5d$__$28$ecmascript$29$__["init"]({
    dsn: "https://64b576b795abe23942f29258bcd88125@o4511683556343808.ingest.us.sentry.io/4511684358111232",
    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,
    // Enable logs to be sent to Sentry
    enableLogs: true,
    dataCollection: {
    }
});
}),
];

//# debugId=33f5be41-02b4-1501-08a7-ba1fde2f3ecd
//# sourceMappingURL=sentry_server_config_ts_12ua_3q._.js.map