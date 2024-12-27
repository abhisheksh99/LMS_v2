import React from 'react';
import Course from './Course';

const MyLearning = () => {
    const isLoading = false;
    const myLearning = [1,2];

    const MyLearningSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className="bg-gray-300 dark:bg-gray-700 rounded-lg h-40 animate-pulse"
                ></div>
            ))}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto my-10 px-4 md:px-0">
            <h1 className="font-bold text-2xl">MY LEARNING</h1>
            <div className="my-5">
                {isLoading ? (
                    <MyLearningSkeleton />
                ) : myLearning.length === 0 ? (
                    <p className="text-center text-black-600 text-xl font-medium mt-4">
                        You are not enrolled in any course.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {myLearning.map((course, index) => (
                            <Course key={index} course={course} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLearning;