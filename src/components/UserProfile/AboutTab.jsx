import {
  MdPerson,
  MdEdit,
  MdEmail,
  MdLocationOn,
  MdPhone,
  MdFavorite,
  MdCalendarMonth,
} from "react-icons/md";

const AboutTab = ({ profileUser, isOwnProfile, fullName, joinDate }) => {
  // Helper function to format gender display
  const formatGender = (gender) => {
    const genderMap = {
      male: "Male",
      female: "Female",
      other: "Other",
    };
    return genderMap[gender] || "Gender not specified";
  };

  // Helper function to format relationship status display
  const formatRelationshipStatus = (status) => {
    const statusMap = {
      single: "Single",
      in_a_relationship: "In a Relationship",
      married: "Married",
      divorced: "Divorced",
      widowed: "Widowed",
    };
    return statusMap[status] || "Not specified";
  };

  // Helper function to format join date
  const formatJoinDate = () => {
    if (joinDate) return joinDate;

    if (profileUser?.date_joined) {
      return new Date(profileUser.date_joined).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }

    return "Recently joined";
  };

  return (
    //--> About activeTab
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-3xl">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl px-4 sm:px-2 lg:px-6 py-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MdPerson className="w-6 h-6 text-blue-600" />
            About {isOwnProfile ? "Me" : fullName}
          </h3>

          <div className="space-y-6">
            {/* Bio Section */}
            {profileUser.bio ? (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MdEdit className="w-4 h-4 text-blue-600" />
                  Bio
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {profileUser.bio}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 border border-gray-200 border-dashed">
                <h4 className="font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <MdEdit className="w-4 h-4 text-gray-400" />
                  Bio
                </h4>
                <p className="text-gray-400 italic">No bio available</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-lg px-3 py-4 border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MdPerson className="w-4 h-4 text-blue-600" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Username */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdPerson className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      Username
                    </p>
                    <p className="text-sm text-gray-800 truncate">
                      {profileUser.username}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdEmail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p
                      className={`text-sm ${
                        profileUser.email
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      } truncate`}
                    >
                      {profileUser.email || "Email not available"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdLocationOn className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p
                      className={`text-sm ${
                        profileUser.location
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      } truncate`}
                    >
                      {profileUser.location || "Location not available"}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdPhone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p
                      className={`text-sm ${
                        profileUser.phone || profileUser.phone_number
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      } truncate`}
                    >
                      {profileUser.phone ||
                        profileUser.phone_number ||
                        "Phone not available"}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdFavorite className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </p>
                    <p
                      className={`text-sm ${
                        profileUser.date_of_birth
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      } truncate`}
                    >
                      {profileUser.date_of_birth
                        ? new Date(
                            profileUser.date_of_birth
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Date of birth not available"}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdPerson className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p
                      className={`text-sm ${
                        profileUser.gender
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      } truncate`}
                    >
                      {formatGender(profileUser.gender)}
                    </p>
                  </div>
                </div>

                {/* Relationship Status */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdFavorite className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">
                      Relationship Status
                    </p>
                    <p
                      className={`text-sm ${
                        profileUser.relationship_status
                          ? "text-gray-800"
                          : "text-gray-400 italic"
                      } truncate`}
                    >
                      {formatRelationshipStatus(
                        profileUser.relationship_status
                      )}
                    </p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0">
                    <MdCalendarMonth className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Joined</p>
                    <p className="text-sm text-gray-800">{formatJoinDate()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
