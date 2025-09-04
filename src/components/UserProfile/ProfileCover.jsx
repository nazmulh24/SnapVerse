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
          onError={(e) => {
            console.log("Cover image failed to load:", coverPhotoUrl);
            // Hide the broken image and show the default background
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center">
                <div class="text-center text-white/80">
                  <div class="w-24 h-24 mx-auto mb-4 opacity-50 flex items-center justify-center">
                    <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
              </div>
            `;
          }}
          onLoad={() => {
            console.log("Cover image loaded successfully:", coverPhotoUrl);
          }}
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
