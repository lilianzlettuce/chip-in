import { useParams } from 'react-router-dom';

export default function Home() {
    const { householdId, userId } = useParams();

    return (
        <div>
            <h1>household id: {householdId}</h1>
            <h1>user id: {userId}</h1>
            <h1>This is the Household Home / uhhh where you view the statistics (name is TBD).</h1>
        </div>
    );
}