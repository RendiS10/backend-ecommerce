import React from "react";
import LoginForm from "../components/Fragments/LoginForm";

function Login() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-none">
          {/* Left Side - Image */}
          <div className="hidden md:flex flex-1 items-center justify-center p-8">
            <img
              src="https://img.freepik.com/free-photo/shopping-cart-with-smartphone-bags-blue-background-3d-rendering_56104-1547.jpg?w=900&t=st=1690000000~exp=1690000600~hmac=example"
              alt="Shopping Cart"
              className="w-full max-w-md rounded-lg object-cover"
            />
          </div>
          {/* Right Side - Form */}
          <div className="flex-1 flex flex-col justify-center px-8 py-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-[#222]">
              Login Admin
            </h2>
            <p className="text-sm text-[#222] mb-8">
              Hanya Admin Yang Dapat Login !
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
