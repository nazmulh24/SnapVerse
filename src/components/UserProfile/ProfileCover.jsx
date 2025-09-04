import { MdPerson } from "react-icons/md";

const ProfileCover = ({ coverPhotoUrl }) => {
  return (
    //--> Cover Photo Section
    <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
      {coverPhotoUrl ? (
        <img
          src={coverPhotoUrl}
          alt="Cover Photo"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center text-white/80">
            <MdPerson className="w-24 h-24 mx-auto mb-4 opacity-50" />
          </div>
        </div>
      )}

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
    </div>
  );
};

export default ProfileCover;
