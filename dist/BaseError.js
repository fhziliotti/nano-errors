"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid");
const utils_1 = require("./utils");
/**
 * The base error details enables the developer to add
 * specific metadata to their errors.
 */
class BaseErrorDetails {
    constructor(data = {}) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }
}
exports.BaseErrorDetails = BaseErrorDetails;
/**
 * An enhanced error instance for the TS Framework.
 * <br />
 * Basic features:
 * - Unique stack id using UUID v4
 * - Serializers: toObject and toJSON
 * - Better stack trace mapping using "clean-stack"
 * - Inherits errors with rich stack trace and json outputs
 */
class BaseError extends Error {
    constructor(input, details = new BaseErrorDetails()) {
        let message;
        let originalMessage;
        let stackId = uuid.v4();
        if (input && input.message) {
            // Handle input message from another error
            message = input.message.split(' (stackId:')[0];
            originalMessage = input.message;
            stackId = input.stackId || details.stackId || stackId;
        }
        else if (input && typeof input.toString === 'function') {
            // Handle input message as string
            message = input.toString();
            originalMessage = input.toString();
            stackId = input.stackId || details.stackId || stackId;
        }
        else {
            // We don't really know how to handle this case
            // Passing on to prevent breaking changes, but this might catch up onto us
            message = input;
            originalMessage = input;
        }
        super(`${message} (stackId: ${stackId})`);
        this.stackId = stackId;
        this.originalMessage = originalMessage;
        this.name = this.constructor.name;
        this.details = details instanceof BaseErrorDetails ? details : new BaseErrorDetails(details);
        // Prepare instance stack trace
        if ((input && input.stack) || details.stack) {
            // Tries to inherit original stack trace, input looks like an Error instance
            this.stack = utils_1.inheritStackTrace(this, input.stack || details.stack);
        }
        else if (typeof Error.captureStackTrace === 'function') {
            // Generates a new Stack Trace (available on v8 platforms)
            Error.captureStackTrace(this, this.constructor);
        }
        else {
            // Fallback mode to simple error
            this.stack = (new Error(this.message)).stack;
        }
        // External dependency for cleaning unuseful stack trace frames
        if (require.resolve('clean-stack')) {
            try {
                // Try to get clean stack gracefully
                this._cleanStack = require('clean-stack');
            }
            catch (exception) {
                //console.warn('Dependency "clean-stack" is not supported in this platform, errors will be ignored', exception);
            }
        }
    }
    /**
     * Generates plain object for this error instance.
     */
    toObject() {
        let stack = this.stack;
        // External dependency for cleaning unuseful stack trace frames
        if (this._cleanStack) {
            try {
                stack = this._cleanStack(this.stack);
            }
            catch (exception) {
                //console.warn('Dependency "clean-stack" is not supported in this platform, errors will be ignored', exception);
            }
        }
        return {
            message: this.message,
            stackId: this.stackId,
            details: this.details,
            // tslint:disable-next-line:object-shorthand-properties-first
            stack,
        };
    }
    /**
     * Generates clean object for this error instance ready for JSON stringification (optional).
     *
     * @param stringify Flag to enable stringification
     */
    toJSON(stringify = false) {
        const obj = this.toObject();
        if (stringify) {
            return JSON.stringify(obj);
        }
        return obj;
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmFzZUVycm9yLmpzIiwic291cmNlUm9vdCI6Ii4vbGliLyIsInNvdXJjZXMiOlsiQmFzZUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLG1DQUE0QztBQUU1Qzs7O0dBR0c7QUFDSCxNQUFhLGdCQUFnQjtJQUczQixZQUFZLElBQUksR0FBRyxFQUFFO1FBQ25CLEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3RCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN2QjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBVkQsNENBVUM7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsU0FBVSxTQUFRLEtBQUs7SUFxQmxDLFlBQVksS0FBVyxFQUFFLFVBQWUsSUFBSSxnQkFBZ0IsRUFBRTtRQUM1RCxJQUFJLE9BQWUsQ0FBQztRQUNwQixJQUFJLGVBQXVCLENBQUM7UUFDNUIsSUFBSSxPQUFPLEdBQVcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBRWhDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDMUIsMENBQTBDO1lBQzFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvQyxlQUFlLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztZQUNoQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztTQUN2RDthQUFNLElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDeEQsaUNBQWlDO1lBQ2pDLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0IsZUFBZSxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztTQUN2RDthQUFNO1lBQ0wsK0NBQStDO1lBQy9DLDBFQUEwRTtZQUMxRSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ2hCLGVBQWUsR0FBRyxLQUFLLENBQUM7U0FDekI7UUFFRCxLQUFLLENBQUMsR0FBRyxPQUFPLGNBQWMsT0FBTyxHQUFHLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxZQUFZLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0YsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDM0MsNEVBQTRFO1lBQzVFLElBQUksQ0FBQyxLQUFLLEdBQUcseUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BFO2FBQU0sSUFBSSxPQUFPLEtBQUssQ0FBQyxpQkFBaUIsS0FBSyxVQUFVLEVBQUU7WUFDeEQsMERBQTBEO1lBQzFELEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2pEO2FBQU07WUFDTCxnQ0FBZ0M7WUFDaEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUM5QztRQUVELCtEQUErRDtRQUMvRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDbEMsSUFBSTtnQkFDRixvQ0FBb0M7Z0JBQ3BDLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzNDO1lBQUMsT0FBTyxTQUFTLEVBQUU7Z0JBQ2xCLGdIQUFnSDthQUNqSDtTQUNGO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFdkIsK0RBQStEO1FBQy9ELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJO2dCQUNGLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QztZQUFDLE9BQU8sU0FBUyxFQUFFO2dCQUNsQixnSEFBZ0g7YUFDakg7U0FDRjtRQUVELE9BQU87WUFDTCxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQiw2REFBNkQ7WUFDN0QsS0FBSztTQUNOLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxZQUFxQixLQUFLO1FBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLFNBQVMsRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztDQUNGO0FBNUdELDhCQTRHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHV1aWQgZnJvbSAndXVpZCc7XG5pbXBvcnQgeyBpbmhlcml0U3RhY2tUcmFjZSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIFRoZSBiYXNlIGVycm9yIGRldGFpbHMgZW5hYmxlcyB0aGUgZGV2ZWxvcGVyIHRvIGFkZFxuICogc3BlY2lmaWMgbWV0YWRhdGEgdG8gdGhlaXIgZXJyb3JzLlxuICovXG5leHBvcnQgY2xhc3MgQmFzZUVycm9yRGV0YWlscyB7XG4gIFtrZXk6IHN0cmluZ106IGFueTtcblxuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IGRhdGFba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBlbmhhbmNlZCBlcnJvciBpbnN0YW5jZSBmb3IgdGhlIFRTIEZyYW1ld29yay5cbiAqIDxiciAvPlxuICogQmFzaWMgZmVhdHVyZXM6XG4gKiAtIFVuaXF1ZSBzdGFjayBpZCB1c2luZyBVVUlEIHY0XG4gKiAtIFNlcmlhbGl6ZXJzOiB0b09iamVjdCBhbmQgdG9KU09OXG4gKiAtIEJldHRlciBzdGFjayB0cmFjZSBtYXBwaW5nIHVzaW5nIFwiY2xlYW4tc3RhY2tcIlxuICogLSBJbmhlcml0cyBlcnJvcnMgd2l0aCByaWNoIHN0YWNrIHRyYWNlIGFuZCBqc29uIG91dHB1dHNcbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIFRoZSB1bmlxdWUgZXhjZXB0aW9uIGlkLlxuICAgKi9cbiAgcHVibGljIHN0YWNrSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGVycm9yIGRldGFpbHMgZm9yIGVhc2llciB0cmFja2luZyBvZiBleGNlcHRpb25zXG4gICAqL1xuICBwdWJsaWMgZGV0YWlsczogQmFzZUVycm9yRGV0YWlscztcblxuICAvKipcbiAgICogVGhlIGVycm9yIG9yaWdpbmFsIG1lc3NhZ2Ugd2l0aG91dCB0aGUgZ2VuZXJhdGVkIG1ldGFkYXRhLlxuICAgKi9cbiAgcHVibGljIG9yaWdpbmFsTWVzc2FnZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYGNsZWFuLXN0YWNrYCB3cmFwcGVyIHdoZW4gYXZhaWxhYmxlLlxuICAgKi9cbiAgcHJvdGVjdGVkIF9jbGVhblN0YWNrPzogKGlucHV0OiBzdHJpbmcpID0+IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihpbnB1dD86IGFueSwgZGV0YWlsczogYW55ID0gbmV3IEJhc2VFcnJvckRldGFpbHMoKSkge1xuICAgIGxldCBtZXNzYWdlOiBzdHJpbmc7XG4gICAgbGV0IG9yaWdpbmFsTWVzc2FnZTogc3RyaW5nO1xuICAgIGxldCBzdGFja0lkOiBzdHJpbmcgPSB1dWlkLnY0KCk7XG5cbiAgICBpZiAoaW5wdXQgJiYgaW5wdXQubWVzc2FnZSkge1xuICAgICAgLy8gSGFuZGxlIGlucHV0IG1lc3NhZ2UgZnJvbSBhbm90aGVyIGVycm9yXG4gICAgICBtZXNzYWdlID0gaW5wdXQubWVzc2FnZS5zcGxpdCgnIChzdGFja0lkOicpWzBdO1xuICAgICAgb3JpZ2luYWxNZXNzYWdlID0gaW5wdXQubWVzc2FnZTtcbiAgICAgIHN0YWNrSWQgPSBpbnB1dC5zdGFja0lkIHx8IGRldGFpbHMuc3RhY2tJZCB8fCBzdGFja0lkO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQgJiYgdHlwZW9mIGlucHV0LnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBIYW5kbGUgaW5wdXQgbWVzc2FnZSBhcyBzdHJpbmdcbiAgICAgIG1lc3NhZ2UgPSBpbnB1dC50b1N0cmluZygpO1xuICAgICAgb3JpZ2luYWxNZXNzYWdlID0gaW5wdXQudG9TdHJpbmcoKTtcbiAgICAgIHN0YWNrSWQgPSBpbnB1dC5zdGFja0lkIHx8IGRldGFpbHMuc3RhY2tJZCB8fCBzdGFja0lkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSBkb24ndCByZWFsbHkga25vdyBob3cgdG8gaGFuZGxlIHRoaXMgY2FzZVxuICAgICAgLy8gUGFzc2luZyBvbiB0byBwcmV2ZW50IGJyZWFraW5nIGNoYW5nZXMsIGJ1dCB0aGlzIG1pZ2h0IGNhdGNoIHVwIG9udG8gdXNcbiAgICAgIG1lc3NhZ2UgPSBpbnB1dDtcbiAgICAgIG9yaWdpbmFsTWVzc2FnZSA9IGlucHV0O1xuICAgIH1cblxuICAgIHN1cGVyKGAke21lc3NhZ2V9IChzdGFja0lkOiAke3N0YWNrSWR9KWApO1xuICAgIHRoaXMuc3RhY2tJZCA9IHN0YWNrSWQ7XG4gICAgdGhpcy5vcmlnaW5hbE1lc3NhZ2UgPSBvcmlnaW5hbE1lc3NhZ2U7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIHRoaXMuZGV0YWlscyA9IGRldGFpbHMgaW5zdGFuY2VvZiBCYXNlRXJyb3JEZXRhaWxzID8gZGV0YWlscyA6IG5ldyBCYXNlRXJyb3JEZXRhaWxzKGRldGFpbHMpO1xuXG4gICAgLy8gUHJlcGFyZSBpbnN0YW5jZSBzdGFjayB0cmFjZVxuICAgIGlmICgoaW5wdXQgJiYgaW5wdXQuc3RhY2spIHx8IGRldGFpbHMuc3RhY2spIHtcbiAgICAgIC8vIFRyaWVzIHRvIGluaGVyaXQgb3JpZ2luYWwgc3RhY2sgdHJhY2UsIGlucHV0IGxvb2tzIGxpa2UgYW4gRXJyb3IgaW5zdGFuY2VcbiAgICAgIHRoaXMuc3RhY2sgPSBpbmhlcml0U3RhY2tUcmFjZSh0aGlzLCBpbnB1dC5zdGFjayB8fCBkZXRhaWxzLnN0YWNrKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gR2VuZXJhdGVzIGEgbmV3IFN0YWNrIFRyYWNlIChhdmFpbGFibGUgb24gdjggcGxhdGZvcm1zKVxuICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZhbGxiYWNrIG1vZGUgdG8gc2ltcGxlIGVycm9yXG4gICAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpKS5zdGFjaztcbiAgICB9XG5cbiAgICAvLyBFeHRlcm5hbCBkZXBlbmRlbmN5IGZvciBjbGVhbmluZyB1bnVzZWZ1bCBzdGFjayB0cmFjZSBmcmFtZXNcbiAgICBpZiAocmVxdWlyZS5yZXNvbHZlKCdjbGVhbi1zdGFjaycpKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUcnkgdG8gZ2V0IGNsZWFuIHN0YWNrIGdyYWNlZnVsbHlcbiAgICAgICAgdGhpcy5fY2xlYW5TdGFjayA9IHJlcXVpcmUoJ2NsZWFuLXN0YWNrJyk7XG4gICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgLy9jb25zb2xlLndhcm4oJ0RlcGVuZGVuY3kgXCJjbGVhbi1zdGFja1wiIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBwbGF0Zm9ybSwgZXJyb3JzIHdpbGwgYmUgaWdub3JlZCcsIGV4Y2VwdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBwbGFpbiBvYmplY3QgZm9yIHRoaXMgZXJyb3IgaW5zdGFuY2UuXG4gICAqL1xuICBwdWJsaWMgdG9PYmplY3QoKSB7XG4gICAgbGV0IHN0YWNrID0gdGhpcy5zdGFjaztcblxuICAgIC8vIEV4dGVybmFsIGRlcGVuZGVuY3kgZm9yIGNsZWFuaW5nIHVudXNlZnVsIHN0YWNrIHRyYWNlIGZyYW1lc1xuICAgIGlmICh0aGlzLl9jbGVhblN0YWNrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBzdGFjayA9IHRoaXMuX2NsZWFuU3RhY2sodGhpcy5zdGFjayk7XG4gICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgLy9jb25zb2xlLndhcm4oJ0RlcGVuZGVuY3kgXCJjbGVhbi1zdGFja1wiIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBwbGF0Zm9ybSwgZXJyb3JzIHdpbGwgYmUgaWdub3JlZCcsIGV4Y2VwdGlvbik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIHN0YWNrSWQ6IHRoaXMuc3RhY2tJZCxcbiAgICAgIGRldGFpbHM6IHRoaXMuZGV0YWlscyxcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpvYmplY3Qtc2hvcnRoYW5kLXByb3BlcnRpZXMtZmlyc3RcbiAgICAgIHN0YWNrLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGNsZWFuIG9iamVjdCBmb3IgdGhpcyBlcnJvciBpbnN0YW5jZSByZWFkeSBmb3IgSlNPTiBzdHJpbmdpZmljYXRpb24gKG9wdGlvbmFsKS5cbiAgICpcbiAgICogQHBhcmFtIHN0cmluZ2lmeSBGbGFnIHRvIGVuYWJsZSBzdHJpbmdpZmljYXRpb25cbiAgICovXG4gIHB1YmxpYyB0b0pTT04oc3RyaW5naWZ5OiBib29sZWFuID0gZmFsc2UpOiBhbnkge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMudG9PYmplY3QoKTtcbiAgICBpZiAoc3RyaW5naWZ5KSB7XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuIl19