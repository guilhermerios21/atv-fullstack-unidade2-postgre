"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority = exports.TaskPriority || (exports.TaskPriority = {}));
// Agora este arquivo só expõe tipos/enums. Persistência via Prisma.
exports.default = {};
