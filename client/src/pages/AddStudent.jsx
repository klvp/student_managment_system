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
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { config } from "../../config";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useLoggedIn from "@/hooks/useLoggedIn";
import { getCookie } from "@/lib/helper";

const schema = yup.object().shape({
  name: yup.string().min(3).max(100).required(),
  standard: yup
    .number()
    .min(1)
    .max(10)
    .required()
    .typeError("class must be between 1 to 10"),
  section: yup.string().oneOf(["A", "B", "C"]).required(),
  age: yup.number().min(1).max(100).required().positive().integer(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required(),
});

function AddStudent() {
  const sections = [
    {
      label: "A",
      value: "A",
    },
    {
      label: "B",
      value: "B",
    },
    {
      label: "C",
      value: "C",
    },
  ];
  const initialValues = {
    name: "",
    standard: "",
    section: "",
    age: "",
    email: "",
    phone: "",
  };
  const [error, setError] = useState(null);
  const [color, setColor] = useState("pink");
  const { studentId } = useParams();

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  useLoggedIn();
  useEffect(() => {
    if (studentId) {
      fetch(`${config.apiBaseUrl}/students/${studentId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": getCookie("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("🚀 ~ .then ~ data:", data);
          form.reset({ ...data.data, standard: data.data.class });
        })
        .catch((err) => console.error(err));
    }
  }, [studentId]);

  async function onSubmit(values) {
    try {
      console.log(values);
      let response = await fetch(
        `${config.apiBaseUrl}/students${studentId ? `/${studentId}` : ""}`,
        {
          method: studentId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": getCookie("token"),
          },
          body: JSON.stringify(values),
        }
      );
      if (response.ok && studentId) {
        setError(`Student Updted`);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else if (response.status === 500) {
        let errorMessage = await response.json();
        setError(
          `Duplicate ${
            Object.keys(errorMessage?.error?.errorResponse?.keyPattern)[0]
          }`
        );
        setColor("red");
        setTimeout(() => {
          setError(null);
          setColor("green");
        }, 2000);
      } else {
        form.reset(initialValues);
        setError(`Student Added`);
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
    } catch (error) {
      form.reset(initialValues);
      console.error("Form submission error", error);
    }
  }

  return (
    <div className="max-w-[70vw] mx-auto">
      <p className="text-2xl text-center pt-10">
        {studentId ? "Update" : "Add"} Student
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="md:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormDescription>Enter Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" {...field} />
                    </FormControl>
                    <FormDescription>Student Age</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="md:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="number" {...field} />
                    </FormControl>
                    <FormDescription>Enter Class 1 to 10</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Section</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? sections.find(
                                  (section) => section.value === field.value
                                )?.label
                              : "Select section"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search section..." />
                          <CommandList>
                            <CommandEmpty>No section found.</CommandEmpty>
                            <CommandGroup>
                              {sections.map((section) => (
                                <CommandItem
                                  value={section.label}
                                  key={section.value}
                                  onSelect={() => {
                                    form.setValue("section", section.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      section.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {section.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Enter Section</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="md:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="email" {...field} />
                    </FormControl>
                    <FormDescription>Enter Email</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="" type="text" {...field} />
                    </FormControl>
                    <FormDescription>Enter Phone Number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">{studentId ? "Update" : "Submit"}</Button>
        </form>
      </Form>
      {error && <p className={`text-center text-${color}-500`}>{error}</p>}
    </div>
  );
}

export default AddStudent;
