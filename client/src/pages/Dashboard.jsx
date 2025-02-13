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
import { useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { config } from "../../config";
import useLoggedIn from "@/hooks/useLoggedIn";

function Dashboard() {
  const form = useForm({});

  function onSubmit(values) {
    try {
      console.log(values);
      dispatch(getStudents(values?.search));
      form.reset();
    } catch (error) {
      console.error("Form submission error", error);
    }
  }
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

  if (status === "loading") {
    return <p>Loading..</p>;
  }

  if (status === "error") {
    return <p>Something Went Wrong..</p>;
  }
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
          <div className="flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
      <Table>
        <TableCaption>Student Management System</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length &&
            students?.map((student) => (
              <TableRow key={student._id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.section}</TableCell>
                <TableCell>{student.email}</TableCell>
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
    </div>
  );
}

export default Dashboard;
