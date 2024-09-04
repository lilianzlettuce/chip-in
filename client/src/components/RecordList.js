"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Record = function (props) { return ((0, jsx_runtime_1.jsxs)("tr", { className: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", children: [(0, jsx_runtime_1.jsx)("td", { className: "p-4 align-middle [&:has([role=checkbox])]:pr-0", children: props.record.name }), (0, jsx_runtime_1.jsx)("td", { className: "p-4 align-middle [&:has([role=checkbox])]:pr-0", children: props.record.position }), (0, jsx_runtime_1.jsx)("td", { className: "p-4 align-middle [&:has([role=checkbox])]:pr-0", children: props.record.level }), (0, jsx_runtime_1.jsx)("td", { className: "p-4 align-middle [&:has([role=checkbox])]:pr-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { className: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3", to: "/edit/".concat(props.record._id), children: "Edit" }), (0, jsx_runtime_1.jsx)("button", { className: "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3", color: "red", type: "button", onClick: function () {
                            props.deleteRecord(props.record._id);
                        }, children: "Delete" })] }) })] })); };
function RecordList() {
    var _a = (0, react_1.useState)([]), records = _a[0], setRecords = _a[1];
    // This method fetches the records from the database.
    (0, react_1.useEffect)(function () {
        function getRecords() {
            return __awaiter(this, void 0, void 0, function () {
                var response, message, records;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch("http://localhost:5050/record/")];
                        case 1:
                            response = _a.sent();
                            if (!response.ok) {
                                message = "An error occurred: ".concat(response.statusText);
                                console.error(message);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            records = _a.sent();
                            setRecords(records);
                            return [2 /*return*/];
                    }
                });
            });
        }
        getRecords();
        return;
    }, [records.length]);
    // This method will delete a record
    function deleteRecord(id) {
        return __awaiter(this, void 0, void 0, function () {
            var newRecords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("http://localhost:5050/record/".concat(id), {
                            method: "DELETE",
                        })];
                    case 1:
                        _a.sent();
                        newRecords = records.filter(function (el) { return el._id !== id; });
                        setRecords(newRecords);
                        return [2 /*return*/];
                }
            });
        });
    }
    // This method will map out the records on the table
    function recordList() {
        return records.map(function (record) {
            return ((0, jsx_runtime_1.jsx)(Record, { record: record, deleteRecord: function () { return deleteRecord(record._id); } }, record._id));
        });
    }
    // This following section will display the table with the records of individuals.
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold p-4", children: "Employee Records" }), (0, jsx_runtime_1.jsx)("div", { className: "border rounded-lg overflow-hidden", children: (0, jsx_runtime_1.jsx)("div", { className: "relative w-full overflow-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full caption-bottom text-sm", children: [(0, jsx_runtime_1.jsx)("thead", { className: "[&_tr]:border-b", children: (0, jsx_runtime_1.jsxs)("tr", { className: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", children: [(0, jsx_runtime_1.jsx)("th", { className: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", children: "Name" }), (0, jsx_runtime_1.jsx)("th", { className: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", children: "Position" }), (0, jsx_runtime_1.jsx)("th", { className: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", children: "Level" }), (0, jsx_runtime_1.jsx)("th", { className: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", children: "Action" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "[&_tr:last-child]:border-0", children: recordList() })] }) }) })] }));
}
exports.default = RecordList;
