import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CourseCard = ({ course, onWishlistToggle, onCompareToggle, isInWishlist, isInComparison, showPrices = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Safely access course properties with fallbacks
  const courseData = course || {};
  const instructor = courseData.instructor || {};
  const outcomes = courseData.outcomes || [];

  // Check if price should be shown for this course
  const shouldShowPrice = () => {
    return courseData.showPrice !== false && showPrices;
  };

  const formatDuration = (course) => {
    if (!course) return 'N/A';
    
    // Handle different duration formats
    if (course.durationUnit === 'hours') {
      return `${course.duration || 0}h`;
    } else if (course.durationUnit === 'months') {
      const months = course.months || 0;
      if (months === 1) return '1 month';
      if (months === 0.5) return '2 weeks';
      return `${months} months`;
    } else if (course.durationUnit === 'years') {
      const years = course.years || 0;
      if (years === 1) return '1 year';
      if (years === 1.5) return '1.5 years';
      if (years === 0.5) return '6 months';
      return `${years} years`;
    }
    
    // Fallback for old format
    const duration = course.duration || 0;
    if (duration < 60) return `${duration} hours`;
    const months = Math.floor(duration / 30);
    const weeks = Math.floor((duration % 30) / 7);
    return `${months}${months > 1 ? ' months' : ' month'}${weeks > 0 ? ` ${weeks}w` : ''}`;
  };

  const getDifficultyColor = (level) => {
    if (!level) return 'text-gray-600 bg-gray-100 border-gray-200';
    
    switch (level.toLowerCase()) {
      case 'beginner': return 'text-green-700 bg-green-100 border-green-200';
      case 'intermediate': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'advanced': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const formatPrice = (price, showPrice = true) => {
    if (!showPrice) return 'Contact for Price';
    if (price === 0 || price === '0' || !price) return 'Free';
    return `RS ${price.toLocaleString('en-LK')}`;
  };

  const formatNumber = (value) => {
    return value === 0 || value === '' || !value ? '0' : value;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={courseData.image}
          alt={courseData.imageAlt || 'Course image'}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=Course+Image';
            setImageLoaded(true);
          }}
        />
        
        {/* Image Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Overlay Actions */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Wishlist Button */}
          {/* <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistToggle?.(courseData.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
              isInWishlist 
                ? 'bg-red-500 text-white border-red-500 shadow-md' 
                : 'bg-white/90 text-gray-600 border-white/50 hover:bg-red-500/10 hover:text-red-600 hover:border-red-200'
            }`}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Icon name="Heart" size={16} fill={isInWishlist ? "currentColor" : "none"} />
          </button> */}
          
          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCompareToggle?.(courseData.id);
            }}
            className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
              isInComparison 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white/90 text-gray-600 border-white/50 hover:bg-blue-600/10 hover:text-blue-600 hover:border-blue-200'
            }`}
            aria-label={isInComparison ? 'Remove from comparison' : 'Add to comparison'}
          >
            <Icon name="GitCompare" size={16} />
          </button>
        </div>

        {/* Course Badge */}
        {courseData.isNew && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
              NEW
            </span>
          </div>
        )}

        {/* Difficulty Level */}
        {courseData.level && (
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getDifficultyColor(courseData.level)} shadow-sm`}>
              {courseData.level}
            </span>
          </div>
        )}

        {/* Category Tag */}
        {courseData.category && (
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm">
              {courseData.category}
            </span>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={16} className="text-amber-400" fill="currentColor" />
              <span className="text-sm font-bold text-gray-900">
                {formatNumber(courseData.rating)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({formatNumber(courseData.reviews)} reviews)
            </span>
          </div>
          
          {/* Students Count */}
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Icon name="Users" size={14} />
            <span>{formatNumber(courseData.enrolled)}</span>
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 min-h-[3.5rem]">
          {courseData.title || 'Untitled Course'}
        </h3>

        {/* Course Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {courseData.description || 'No description available.'}
        </p>

        {/* Instructor */}
        {instructor.name && (
          <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Image
              src={instructor.avatar}
              alt={instructor.avatarAlt || 'Instructor avatar'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40?text=Instructor';
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{instructor.name}</p>
              <p className="text-xs text-gray-500 truncate">{instructor.title || 'Instructor'}</p>
            </div>
          </div>
        )}

        {/* Course Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center space-x-1 text-center">
            <Icon name="Clock" size={14} className="text-blue-600" />
            <span className="font-medium">{formatDuration(courseData)}</span>
          </div>
          <div className="flex items-center justify-center space-x-1 text-center">
            <Icon name="BookOpen" size={14} className="text-green-600" />
            <span className="font-medium">{formatNumber(courseData.lessons)} lessons</span>
          </div>
          <div className="flex items-center justify-center space-x-1 text-center">
            <Icon name="BarChart3" size={14} className="text-purple-600" />
            <span className="font-medium">{courseData.level || 'All Levels'}</span>
          </div>
        </div>

        {/* Learning Outcomes */}
        {outcomes.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">You'll learn:</p>
            <div className="flex flex-wrap gap-2">
              {outcomes.slice(0, 2).map((outcome, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200"
                >
                  {outcome.length > 30 ? outcome.substring(0, 30) + '...' : outcome}
                </span>
              ))}
              {outcomes.length > 2 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                  +{outcomes.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {/* Original Price (if discounted) */}
            {shouldShowPrice() && courseData.originalPrice && courseData.originalPrice > courseData.price && (
              <span className="text-sm text-gray-500 line-through">
                RS {courseData.originalPrice?.toLocaleString('en-LK')}
              </span>
            )}
            
            {/* Current Price */}
            <span className={`text-xl font-bold ${
              shouldShowPrice() 
                ? 'text-gray-900' 
                : 'text-blue-600'
            }`}>
              {formatPrice(courseData.price, shouldShowPrice())}
            </span>

            {/* Discount Badge */}
            {shouldShowPrice() && courseData.originalPrice && courseData.originalPrice > courseData.price && courseData.price > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md">
                Save RS {(courseData.originalPrice - courseData.price).toLocaleString('en-LK')}
              </span>
            )}
          </div>
          
          {/* CTA Button */}
          <Link 
            to={{
              pathname: '/contact',
              state: {
                courseInfo: {
                  id: courseData.id,
                  title: courseData.title,
                  price: courseData.price,
                  instructor: instructor.name,
                  category: courseData.category,
                  level: courseData.level,
                  showPrice: shouldShowPrice()
                },
                intent: 'enrollment'
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              variant="default" 
              size="sm"
              className={`font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                shouldShowPrice() 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
              }`}
            >
              {shouldShowPrice() ? 'Enroll Now' : 'Get Info'}
            </Button>
          </Link>
        </div>

        {/* Price Hidden Notice */}
        {!shouldShowPrice() && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              <Icon name="Info" size={12} className="inline mr-1" />
              Contact us for pricing information
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;