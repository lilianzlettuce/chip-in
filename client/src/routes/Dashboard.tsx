import { useUserContext } from '../UserContext';

export default function Dashboard() {
    const { user } = useUserContext();

    return (
        <div>
            <h1>This is the Dashboard.</h1>
            <h1>user id: {user?.id}</h1>
            <h1>username: {user?.username}</h1>
            <h1>email: {user?.email}</h1>
            <h1>households: </h1>
        </div>
    );
}