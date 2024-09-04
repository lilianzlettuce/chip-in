"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var ReactDOM = require("react-dom/client");
var react_router_dom_1 = require("react-router-dom");
var App_1 = require("./App");
var Record_1 = require("./components/Record");
var RecordList_1 = require("./components/RecordList");
require("./index.css");
var router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: "/",
        element: (0, jsx_runtime_1.jsx)(App_1.default, {}),
        children: [
            {
                path: "/",
                element: (0, jsx_runtime_1.jsx)(RecordList_1.default, {}),
            },
        ],
    },
    {
        path: "/edit/:id",
        element: (0, jsx_runtime_1.jsx)(App_1.default, {}),
        children: [
            {
                path: "/edit/:id",
                element: (0, jsx_runtime_1.jsx)(Record_1.default, {}),
            },
        ],
    },
    {
        path: "/create",
        element: (0, jsx_runtime_1.jsx)(App_1.default, {}),
        children: [
            {
                path: "/create",
                element: (0, jsx_runtime_1.jsx)(Record_1.default, {}),
            },
        ],
    },
]);
var root = document.getElementById("root");
ReactDOM.createRoot(root).render((0, jsx_runtime_1.jsx)(React.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_router_dom_1.RouterProvider, { router: router }) }));
