import Link from "next/link";
import { useAuth } from "../lib/auth";

const ProfilePage = ({}) => {
    const { user, loading, signOut } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

}