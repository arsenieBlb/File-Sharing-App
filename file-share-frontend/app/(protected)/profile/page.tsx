import { getMe } from "@/actions/profile";
import { Profile } from "@/components/profile/Profile";

const ProfilePage = async () => {
    const userData = await getMe();
    return (
        <div className="p-4">
            <Profile userData={userData.data.user} />
        </div>
    )
}

export default ProfilePage;