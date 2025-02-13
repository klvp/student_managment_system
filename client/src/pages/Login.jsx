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
import { config } from "../../config";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "@/lib/helper";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(3).max(32).required(),
});

function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });
  const [message, setMessage] = useState("");
  // useEffect(() => {
  //   if (getCookie("token")) {
  //     window.location.href = "/dashboard";
  //   }
  // }, []);

  async function onSubmit(values) {
    try {
      form.reset(initialValues);
      if (getCookie("token")) {
        deleteCookie("token");
      }
      let loginResponse = await fetch(`${config.apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      if (getCookie("token") && loginResponse.ok) {
        window.location.href = "/dashboard";
      } else {
        setMessage("Email or Password is Invalid");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    } catch (error) {
      form.reset(initialValues);
      setMessage(error.message);
      setTimeout(() => {
        setMessage("");
      }, 2000);
      console.error("Form submission error", error);
    }
  }

  return (
    <div className="max-w-[70vw] mx-auto">
      <p className="text-2xl text-center pt-10">Login</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormDescription>Enter Password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {message && <p className="text-red-500 text-center">{message}</p>}
    </div>
  );
}

export default Login;
