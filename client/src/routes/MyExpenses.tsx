import { useParams } from 'react-router-dom';

export default function MyExpenses() {
    const { householdId, userId } = useParams();

    return (
        <div>
            <h1>household id: {householdId}</h1>
            <h1>user id: {userId}</h1>
            
            <h1>This is the expense page, where you view how much you owe people.</h1>
        </div>
    );
}