import React from "react";

// Mock sponsor data - can be easily modified or replaced with API data
const SPONSOR_DATA = [
  {
    id: "sp1",
    title: "Nike Air Max Sale",
    description: "Up to 50% off on latest Nike collection. Limited time offer!",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=200&fit=crop",
    buttonText: "Shop Now",
    link: "#",
    brand: "Nike",
    isPromoted: true,
    category: "Fashion",
  },
  {
    id: "sp2",
    title: "iPhone 15 Pro",
    description:
      "The most advanced iPhone yet. Experience titanium technology.",
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=200&fit=crop",
    buttonText: "Learn More",
    link: "#",
    brand: "Apple",
    isPromoted: true,
    category: "Technology",
  },
  {
    id: "sp3",
    title: "Netflix Premium",
    description: "Watch unlimited movies and shows. First month free!",
    image:
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=200&fit=crop",
    buttonText: "Subscribe",
    link: "#",
    brand: "Netflix",
    isPromoted: true,
    category: "Entertainment",
  },
];

/**
 * SponsorCard Component - Modular sponsor management
 * Handles sponsor data, rotation, and easy addition of new sponsors
 * @param {number} position - Position index for sponsor rotation
 * @param {string[]} hiddenSponsors - Array of hidden sponsor IDs
 * @param {function} onHide - Callback function when hiding a sponsor
 * @param {string} className - Additional CSS classes
 */
const SponsorCard = ({
  position = 0,
  hiddenSponsors = [],
  onHide,
  className = "",
}) => {
  // Get visible sponsors (not hidden)
  const visibleSponsors = SPONSOR_DATA.filter(
    (sponsor) => !hiddenSponsors.includes(sponsor.id)
  );

  // Get sponsor for current position with rotation
  const currentSponsor =
    visibleSponsors.length > 0
      ? visibleSponsors[position % visibleSponsors.length]
      : null;

  // Handle sponsor click
  const handleSponsorClick = () => {
    if (currentSponsor?.link && currentSponsor.link !== "#") {
      window.open(currentSponsor.link, "_blank", "noopener,noreferrer");
    }
  };

  // Handle hiding sponsor
  const handleHideSponsor = (e) => {
    e.stopPropagation();
    if (currentSponsor && onHide) {
      onHide(currentSponsor.id);
    }
  };

  // Don't render if no sponsors available
  if (!currentSponsor) {
    return null;
  }

  return (
    <article
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}
      role="banner"
      aria-label="Sponsored content"
    >
      {/* Sponsored Label */}
      <header className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Sponsored
        </span>
        <button
          onClick={handleHideSponsor}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors text-sm"
          title="Hide this ad"
          aria-label="Hide this advertisement"
        >
          ✕
        </button>
      </header>

      {/* Sponsor Content */}
      <div
        className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={handleSponsorClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleSponsorClick();
          }
        }}
      >
        {/* Sponsor Image */}
        <div className="relative">
          <img
            src={currentSponsor.image}
            alt={`${currentSponsor.brand} - ${currentSponsor.title}`}
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x200/f3f4f6/6b7280?text=Sponsor+Image";
            }}
          />
          {/* Brand Badge */}
          <div className="absolute top-3 left-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium">
            {currentSponsor.brand}
          </div>
        </div>

        {/* Sponsor Details */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
            {currentSponsor.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {currentSponsor.description}
          </p>

          {/* Action Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`${currentSponsor.buttonText} - ${currentSponsor.title}`}
          >
            {currentSponsor.buttonText}
          </button>
        </div>
      </div>
    </article>
  );
};

export default SponsorCard;
