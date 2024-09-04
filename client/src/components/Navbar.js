"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_router_dom_1 = require("react-router-dom");
function Navbar() {
    return ((0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex justify-between items-center mb-6", children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.NavLink, { to: "/", children: (0, jsx_runtime_1.jsx)("img", { alt: "MongoDB logo", className: "h-10 inline", src: "https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png" }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.NavLink, { className: "inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3", to: "/create", children: "Create Employee" })] }) }));
}
exports.default = Navbar;
