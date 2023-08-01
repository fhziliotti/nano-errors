"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sentry = require("@sentry/node");
const Integrations = require("@sentry/integrations");
const Transport = require("winston-transport");
const BaseError_1 = require("../BaseError");
const utils_1 = require("../utils");
class SentryTransport extends Transport {
    constructor(options) {
        super(options);
        this.name = 'Sentry';
        Sentry.init(Object.assign({ dsn: '', patchGlobal: false, install: false, environment: process.env.NODE_ENV, attachStacktrace: true, tags: {}, extra: {}, integrations: [
                new Integrations.ExtraErrorData({ depth: 6 }),
            ] }, options));
    }
    log(info, done) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.silent) {
                return done();
            }
            const meta = utils_1.prepareSentryMeta(info);
            if (info.level === 'error') {
                const error = new BaseError_1.BaseError(info, meta);
                error.name = info['name'] || BaseError_1.BaseError.name;
                Sentry.captureException(error);
            }
            else {
                Sentry.captureEvent(meta);
            }
            done();
        });
    }
}
exports.SentryTransport = SentryTransport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VudHJ5VHJhbnNwb3J0LmpzIiwic291cmNlUm9vdCI6Ii4vbGliLyIsInNvdXJjZXMiOlsibG9nZ2VyL1NlbnRyeVRyYW5zcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdUNBQXVDO0FBQ3ZDLHFEQUFxRDtBQUNyRCwrQ0FBK0M7QUFDL0MsNENBQXlDO0FBQ3pDLG9DQUE2QztBQUs3QyxNQUFhLGVBQWdCLFNBQVEsU0FBUztJQUk1QyxZQUFZLE9BQStCO1FBQ3pDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUpELFNBQUksR0FBRyxRQUFRLENBQUM7UUFNOUIsTUFBTSxDQUFDLElBQUksaUJBQ1QsR0FBRyxFQUFFLEVBQUUsRUFDUCxXQUFXLEVBQUUsS0FBSyxFQUNsQixPQUFPLEVBQUUsS0FBSyxFQUNkLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFDakMsZ0JBQWdCLEVBQUUsSUFBSSxFQUN0QixJQUFJLEVBQUUsRUFBRSxFQUNSLEtBQUssRUFBRSxFQUFFLEVBQ1QsWUFBWSxFQUFFO2dCQUNaLElBQUksWUFBWSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQzthQUM5QyxJQUNFLE9BQU8sRUFDVixDQUFDO0lBQ0wsQ0FBQztJQUVLLEdBQUcsQ0FBQyxJQUFnRCxFQUFFLElBQWdCOztZQUMxRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsT0FBTyxJQUFJLEVBQUUsQ0FBQzthQUNmO1lBRUQsTUFBTSxJQUFJLEdBQUcseUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFckMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLE9BQU8sRUFBRTtnQkFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDeEMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUkscUJBQVMsQ0FBQyxJQUFJLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNoQztpQkFBTTtnQkFDTCxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNCO1lBRUQsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDO0tBQUE7Q0FDRjtBQXZDRCwwQ0F1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBTZW50cnkgZnJvbSAnQHNlbnRyeS9ub2RlJztcbmltcG9ydCAqIGFzIEludGVncmF0aW9ucyBmcm9tICdAc2VudHJ5L2ludGVncmF0aW9ucyc7XG5pbXBvcnQgKiBhcyBUcmFuc3BvcnQgZnJvbSAnd2luc3Rvbi10cmFuc3BvcnQnO1xuaW1wb3J0IHsgQmFzZUVycm9yIH0gZnJvbSAnLi4vQmFzZUVycm9yJztcbmltcG9ydCB7IHByZXBhcmVTZW50cnlNZXRhIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlbnRyeVRyYW5zcG9ydE9wdGlvbnMgZXh0ZW5kcyBTZW50cnkuTm9kZU9wdGlvbnMsIFRyYW5zcG9ydC5UcmFuc3BvcnRTdHJlYW1PcHRpb25zIHtcbn1cblxuZXhwb3J0IGNsYXNzIFNlbnRyeVRyYW5zcG9ydCBleHRlbmRzIFRyYW5zcG9ydCB7XG4gIHB1YmxpYyByZWFkb25seSBuYW1lID0gJ1NlbnRyeSc7XG4gIHB1YmxpYyBvcHRpb25zOiBTZW50cnlUcmFuc3BvcnRPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFNlbnRyeVRyYW5zcG9ydE9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zKTtcblxuICAgIFNlbnRyeS5pbml0KHtcbiAgICAgIGRzbjogJycsXG4gICAgICBwYXRjaEdsb2JhbDogZmFsc2UsXG4gICAgICBpbnN0YWxsOiBmYWxzZSxcbiAgICAgIGVudmlyb25tZW50OiBwcm9jZXNzLmVudi5OT0RFX0VOVixcbiAgICAgIGF0dGFjaFN0YWNrdHJhY2U6IHRydWUsXG4gICAgICB0YWdzOiB7fSxcbiAgICAgIGV4dHJhOiB7fSxcbiAgICAgIGludGVncmF0aW9uczogW1xuICAgICAgICBuZXcgSW50ZWdyYXRpb25zLkV4dHJhRXJyb3JEYXRhKHsgZGVwdGg6IDYgfSksXG4gICAgICBdLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGxvZyhpbmZvOiB7IGxldmVsOiBzdHJpbmcsIHRhZ3M6IGFueSwgbWVzc2FnZTogYW55IH0sIGRvbmU6ICgpID0+IHZvaWQpIHtcbiAgICBpZiAodGhpcy5zaWxlbnQpIHtcbiAgICAgIHJldHVybiBkb25lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWV0YSA9IHByZXBhcmVTZW50cnlNZXRhKGluZm8pO1xuXG4gICAgaWYgKGluZm8ubGV2ZWwgPT09ICdlcnJvcicpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEJhc2VFcnJvcihpbmZvLCBtZXRhKTtcbiAgICAgIGVycm9yLm5hbWUgPSBpbmZvWyduYW1lJ10gfHwgQmFzZUVycm9yLm5hbWU7XG4gICAgICBTZW50cnkuY2FwdHVyZUV4Y2VwdGlvbihlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIFNlbnRyeS5jYXB0dXJlRXZlbnQobWV0YSk7XG4gICAgfVxuXG4gICAgZG9uZSgpO1xuICB9XG59XG4iXX0=