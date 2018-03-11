import Dashboard from 'views/Dashboard/Dashboard';

const appRoutes = [
    { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { redirect: true, path:"/", to:"/dashboard", name: "Dashboard" },
];

export default appRoutes;
