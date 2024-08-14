
import {jwtDecode} from 'jwt-decode';
export default function CheckToken(){
    const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000; 
                if (decodedToken.exp >= currentTime) {
                   return true
                }
            }
            else 
                return false;
}
