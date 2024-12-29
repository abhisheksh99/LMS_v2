
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  
  const courseThumbnail =
    course.courseThumbnail || "https://via.placeholder.com/300x150";
  const creatorPhoto =
    course.creator?.photoUrl || "https://via.placeholder.com/32";
  const creatorName = course.creator?.name || "Unknown Creator";
  const courseTitle = course.courseTitle || "Untitled Course";
  const coursePrice = course.coursePrice || "0.00";
  const courseLevel = course.courseLevel || "Beginner";

  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={courseThumbnail}
            alt={courseTitle}
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="px-5 py-4 space-y-3">
          <h1 className="hover:underline font-bold text-lg truncate">
            {courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={creatorPhoto} alt={creatorName} />
                <AvatarFallback>
                  {creatorName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm">{creatorName}</h1>
            </div>
            <Badge
              className={
                "bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
              }
            >
              {courseLevel}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>${coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
