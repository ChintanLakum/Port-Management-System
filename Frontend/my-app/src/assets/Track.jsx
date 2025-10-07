import Orders from "./Orders"
import { useSelector } from "react-redux"

const Track = ()=>{
    const {userId, isLoggedIn , isSystemAdmin, isAdmin} = useSelector(
        (state) =>
            state.auth
    )
    return (<div>
        <Orders />
    </div>)
}
export default Track 