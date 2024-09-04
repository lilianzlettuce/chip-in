"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
function Record() {
    var _a = (0, react_1.useState)({
        name: "",
        position: "",
        level: "",
    }), form = _a[0], setForm = _a[1];
    var _b = (0, react_1.useState)(true), isNew = _b[0], setIsNew = _b[1];
    var params = (0, react_router_dom_1.useParams)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        function fetchData() {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var id, response, message, record;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = ((_a = params.id) === null || _a === void 0 ? void 0 : _a.toString()) || undefined;
                            if (!id)
                                return [2 /*return*/];
                            setIsNew(false);
                            return [4 /*yield*/, fetch("http://localhost:5050/record/".concat(params.id.toString()))];
                        case 1:
                            response = _b.sent();
                            if (!response.ok) {
                                message = "An error has occurred: ".concat(response.statusText);
                                console.error(message);
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, response.json()];
                        case 2:
                            record = _b.sent();
                            if (!record) {
                                console.warn("Record with id ".concat(id, " not found"));
                                navigate("/");
                                return [2 /*return*/];
                            }
                            setForm(record);
                            return [2 /*return*/];
                    }
                });
            });
        }
        fetchData();
        return;
    }, [params.id, navigate]);
    // These methods will update the state properties.
    function updateForm(value) {
        return setForm(function (prev) {
            return __assign(__assign({}, prev), value);
        });
    }
    // This function will handle the submission.
    function onSubmit(e) {
        return __awaiter(this, void 0, void 0, function () {
            var person, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        person = __assign({}, form);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        response = void 0;
                        if (!isNew) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch("http://localhost:5050/record", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(person),
                            })];
                    case 2:
                        // if we are adding a new record we will POST to /record.
                        response = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, fetch("http://localhost:5050/record/".concat(params.id), {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(person),
                        })];
                    case 4:
                        // if we are updating a record we will PATCH to /record/:id.
                        response = _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        console.error('A problem occurred with your fetch operation: ', error_1);
                        return [3 /*break*/, 8];
                    case 7:
                        setForm({ name: "", position: "", level: "" });
                        navigate("/");
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    // This following section will display the form that takes the input from the user.
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold p-4", children: "Create/Update Employee Record" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: onSubmit, className: "border rounded-lg overflow-hidden p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-base font-semibold leading-7 text-slate-900", children: "Employee Info" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm leading-6 text-slate-600", children: "This information will be displayed publicly so be careful what you share." })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sm:col-span-4", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "name", className: "block text-sm font-medium leading-6 text-slate-900", children: "Name" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: "flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md", children: (0, jsx_runtime_1.jsx)("input", { type: "text", name: "name", id: "name", className: "block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6", placeholder: "First Last", value: form.name, onChange: function (e) { return updateForm({ name: e.target.value }); } }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "sm:col-span-4", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "position", className: "block text-sm font-medium leading-6 text-slate-900", children: "Position" }), (0, jsx_runtime_1.jsx)("div", { className: "mt-2", children: (0, jsx_runtime_1.jsx)("div", { className: "flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md", children: (0, jsx_runtime_1.jsx)("input", { type: "text", name: "position", id: "position", className: "block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6", placeholder: "Developer Advocate", value: form.position, onChange: function (e) { return updateForm({ position: e.target.value }); } }) }) })] }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("fieldset", { className: "mt-4", children: [(0, jsx_runtime_1.jsx)("legend", { className: "sr-only", children: "Position Options" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("input", { id: "positionIntern", name: "positionOptions", type: "radio", value: "Intern", className: "h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer", checked: form.level === "Intern", onChange: function (e) { return updateForm({ level: e.target.value }); } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "positionIntern", className: "ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4", children: "Intern" }), (0, jsx_runtime_1.jsx)("input", { id: "positionJunior", name: "positionOptions", type: "radio", value: "Junior", className: "h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer", checked: form.level === "Junior", onChange: function (e) { return updateForm({ level: e.target.value }); } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "positionJunior", className: "ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4", children: "Junior" }), (0, jsx_runtime_1.jsx)("input", { id: "positionSenior", name: "positionOptions", type: "radio", value: "Senior", className: "h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer", checked: form.level === "Senior", onChange: function (e) { return updateForm({ level: e.target.value }); } }), (0, jsx_runtime_1.jsx)("label", { htmlFor: "positionSenior", className: "ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4", children: "Senior" })] }) })] }) })] })] }), (0, jsx_runtime_1.jsx)("input", { type: "submit", value: "Save Employee Record", className: "inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4" })] })] }));
}
exports.default = Record;
