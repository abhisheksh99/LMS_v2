import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useNavigate } from 'react-router-dom'
import { useGetCreatorCoursesQuery } from '@/store/api/courseApiSlice'

const CourseTable = () => {
    const navigate=useNavigate();
    const {data,isLoading, isError} = useGetCreatorCoursesQuery();
    console.log(data);
    

    if(isLoading){
        return  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    }
   
    if (isError || !data || !data.courses) {
      return <div>No courses found or an error occurred.</div>;
  }
    


  return (
    <div>
      <Button onClick={() => navigate(`create`)}>Create a new course</Button>
      <Table>
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
              <TableCell> <Badge>{course.isPublished ? "Published" : "Draft"}</Badge> </TableCell>
              <TableCell>{course.courseTitle}</TableCell>
              <TableCell className="text-right">
                 <Button size='sm' variant='ghost' onClick={() => navigate(`${course._id}`)}><Edit/></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CourseTable