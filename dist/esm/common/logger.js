import debug from "debug";
var logger = debug("oa-verify");
export var getLogger = function (namespace) { return ({
    trace: logger.extend("trace:" + namespace),
    debug: logger.extend("debug:" + namespace),
    info: logger.extend("info:" + namespace),
    warn: logger.extend("warn:" + namespace),
    error: logger.extend("error:" + namespace),
}); };
