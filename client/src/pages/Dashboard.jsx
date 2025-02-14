import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { getStudents } from "../store/studentSlicer";
import { useCallback, useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { config } from "../../config";
import useLoggedIn from "@/hooks/useLoggedIn";
import { debounce, getCookie } from "@/lib/helper";

function Dashboard() {
  const form = useForm({});
  const { watch } = form;
  const [currentPage, setCurrentPage] = useState(1);

  // function onSubmit(values) {
  //   try {
  //     console.log(values);
  //     dispatch(getStudents(values?.search));
  //     form.reset();
  //   } catch (error) {
  //     console.error("Form submission error", error);
  //   }
  // }
  async function handleDelete(id) {
    try {
      console.log(id);
      const confirmed = window.confirm(
        "Are you sure you want to delete this student?"
      );
      if (!confirmed) {
        return;
      }
      fetch(`${config.apiBaseUrl}/students/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": getCookie("token"),
        },
      })
        .then(() => {
          dispatch(getStudents());
        })
        .catch((error) => {
          console.error("🚀 ~ handleSave ~ error:", error);
        });
    } catch (error) {
      console.error("Form submission error", error);
    }
  }
  const dispatch = useDispatch();
  const { data: students, status } = useSelector((state) => state.students);
  useLoggedIn();
  useEffect(() => {
    dispatch(getStudents());
  }, []);
  const onSubmit = useCallback(
    debounce((values) => {
      try {
        console.log(values);
        dispatch(getStudents(values?.search));
        form.reset();
      } catch (error) {
        console.error("Form submission error", error);
      }
    }, 300),
    []
  );
  const handleClearFilter = useCallback(
    debounce(() => {
      dispatch(getStudents());
      form.reset();
    }, 300),
    []
  );
  if (status === "loading") {
    return <p>Loading..</p>;
  }

  if (status === "error") {
    return <p>Something Went Wrong..</p>;
  }

  // let currentPage = 1;
  const studentsPerPage = 5;
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(students.length / studentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // const handleClearFilter = () => {
  //   dispatch(getStudents());
  //   form.reset();
  // };

  // const searchValue = watch("search");

  return (
    <div className="max-w-[70vw] mx-auto">
      <p className="text-2xl text-center">Student Management System</p>
      <p className="text-16 text-center">
        Number of Students: {students.length}
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filter Students</FormLabel>
                <FormControl>
                  <Input placeholder="yash" type="" {...field} />
                </FormControl>
                <FormDescription>Enter class or name to filter</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center gap-4">
            <Button type="submit">Apply Filter</Button>
            <Button
              type="button"
              onClick={handleClearFilter}
              // disabled={!searchValue}
            >
              Clear Filter
            </Button>
          </div>
        </form>
      </Form>
      {students.length ? (
        <>
          <Table>
            <TableCaption>Student Management System</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>
                    <Link
                      to={`/add/${student._id}`}
                      className="bg-white text-black hover:bg-white"
                    >
                      <Pencil />
                    </Link>
                  </TableCell>
                  <TableCell className="">
                    <Button
                      onClick={() => handleDelete(student._id)}
                      className="bg-white text-black hover:bg-white"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <p className="text-red-500 text-center">
          No Students are Recorded <br /> Add Student
        </p>
      )}
    </div>
  );
}

export default Dashboard;
