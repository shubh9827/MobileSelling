
import { Navigate, Outlet } from 'react-router-dom';
import CheckToken from '../Helpers/CheckToken';
const PrivateRoutes = () => { 
    let auth = {'token': CheckToken()}
    return auth.token ? <Outlet/> : <Navigate to="/Auth"/>;
};

export default PrivateRoutes
