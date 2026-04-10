import { getMe } from "@/actions/profile";
import { Profile } from "@/components/profile/Profile";

const ProfilePage = async () => {
    const userData = await getMe();
    return (
        <Profile userData={userData.data.user} />
    )
}

export default ProfilePage;