import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useNavigate, Link } from "react-router-dom";
import Profile from "../../assets/userProfile.png";
import * as Yup from "yup";
import axios from "axios";
import { API_URL } from "../../Functions/Constants";

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const initialValues = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    college: "",
    college_id: "",
    instagram_id: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      )
      .required("Required"),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
    college: Yup.string().required("Required"),
    phone: Yup.string()
      .required("Required")
      .matches(/^[6-9]\d{9}$/, "Invalid phone number"),
    college_id: Yup.string().required("Photo ID is required"),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    for (const key in values) {
      if (!values[key]) continue;
      if (key == "college_id" && values[key].name) {
        formData.append(key, values[key], values[key].name);
      } else if (key === "instagram_id" && values[key] !== "") {
        formData.append(key, values[key]);
      } else if (key !== "instagram_id") {
        formData.append(key, values[key]);
      }
    }
    try {
      const response = await axios.post(`${API_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      const data = response.data;
      if (response.status === 200) {
        setIsLoading(false);
        localStorage.setItem("token", data?.access_token);
        navigate(`/thanks`);
      } else {
        setIsLoading(false);
        alert("Signup failed! Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error); // Log the entire error object to the console
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Signup failed! Please try again."
      );
    }
  };

  useEffect(() => {
    const checkAndNavigate = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/");
      }
    };
    checkAndNavigate();
  }, [navigate]);
  const handleAutofill = (e) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const password_confirmation = e.target.elements.password_confirmation.value;
    const college = e.target.elements.college.value;
    const college_idFile = e.target.elements.college_id.files[0]; // Get the uploaded file
    const values = {
      name,
      email,
      password,
      password_confirmation,
      college,
      phone: e.target.elements.phone.value,
      college_id: college_idFile,
      instagram_id: e.target.elements.instagram_id.value,
    };
    onSubmit(values);
  };
  return (
    <div className={`${isLoading ? "opacity-40" : "opacity-100"} `}>
      <div className="container-login100 min-h-screen mt-2 ">
        <div className="wrap-login100 ">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, errors }) => (
              <Form
                className="login100-form validate-form"
                onSubmit={handleAutofill}
              >
                <span className="login100-form-logo">
                  <img src={Profile} alt="" />
                </span>
                <span className="login100-form-title">Signup</span>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter username"
                >
                  <Field
                    type="text"
                    name="name"
                    className="input100 text-white placeholder:text-white"
                    placeholder="Username"
                  />
                  <span className="focus-input100" data="&#xf207;"></span>
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter email"
                >
                  <Field
                    type="email"
                    name="email"
                    className="input100 placeholder:text-white"
                    placeholder="Email"
                  />
                  <span className="focus-input100" data="&#xf15a;"></span>
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter password"
                >
                  <Field
                    type="password"
                    name="password"
                    className="input100 placeholder:text-white"
                    placeholder="Password"
                  />
                  <span className="focus-input100" data="&#xf191;"></span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message max-w-60"
                />
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Confirm password"
                >
                  <Field
                    type="password"
                    name="password_confirmation"
                    className="input100 placeholder:text-white"
                    placeholder="Confirm Password"
                  />
                  <span className="focus-input100" data="&#xf191;"></span>
                </div>
                <ErrorMessage
                  name="password_confirmation"
                  component="div"
                  className="error-message"
                />

                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter college"
                >
                  <Field
                    type="text"
                    name="college"
                    className="input100 placeholder:text-white"
                    placeholder="College"
                  />
                  <span className="focus-input100" data="&#xf133;"></span>
                </div>
                <ErrorMessage
                  name="college"
                  component="div"
                  className="error-message"
                />
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter college"
                >
                  <Field
                    type="text"
                    name="phone"
                    className="input100 placeholder:text-white"
                    placeholder="Phone"
                  />
                  <span className="focus-input100" data="&#xf155;"></span>
                </div>
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />

                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter college"
                >
                  <input
                    type="text"
                    name="instagram_id"
                    value={values.instagram_id || ""}
                    placeholder="Instagram ID (optional)"
                    className="input100"
                    onChange={(e) => (values.instagram_id = e.target.value)}
                  />
                  <span className="focus-input100" data="&#xf16d;"></span>
                </div>
                <div className=" max-w-60 text-white mb-4">
                  Do you have public account with 1000+ followers on Instagram?
                  If Yes we have a 🎁 for you.
                </div>
                <div className="validate-input mb-4">
                  <Field
                    name="college_id"
                    type="file"
                    className="input100 placeholder:text-white file-input"
                    accept="image/*"
                    id="college_id"
                  />
                  <label htmlFor="college_id" className="file-label">
                    {values.college_id
                      ? values.college_id.split("\\").pop()
                      : "Upload College ID"}
                  </label>
                </div>
                <ErrorMessage
                  name="college_id"
                  component="div"
                  className="error-message"
                />
                <div className="container-login100-form-btn">
                  <button
                    type="submit"
                    className={`login100-form-btn mt-4 ${
                      Object.keys(errors).length
                        ? "opacity-40 cursor-not-allowed"
                        : "cursor-pointer opacity-100"
                    }`}
                    disabled={!!Object.keys(errors).length}
                  >
                    Signup
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Signup;
