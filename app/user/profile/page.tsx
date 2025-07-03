import LogoutButton from "@/components/ui/logout-button";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      <p className="text-lg">This is your profile page.</p>
      <p className="text-sm text-gray-500 mt-2">
        You can view and edit your profile information here.
      </p>
      <LogoutButton />
    </div>
  );
}
