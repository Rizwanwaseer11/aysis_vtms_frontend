import { Link } from "react-router-dom";

export const Nav = ({ className = "" }) => {
  return (
    <div
      className="bg-blue-600 bg-[url('https://preline.co/assets/svg/examples/abstract-1.svg')] bg-no-repeat bg-cover bg-center p-4 rounded-lg text-center"
    >
    {/* <div
      className={`w-full bg-gray-800 text-black px-4 rounded-lg  py-5 md:px-6 lg:px-8 ${className}`}
    > */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            aria-label="Company"
            title="Company"
            className="inline-flex items-center mr-8"
          >
            <span className="ml-2 text-xl font-bold tracking-wide text-white uppercase">
              Company
            </span>
          </Link>
          <ul className="flex items-center hidden space-x-8 lg:flex">
            <li>
              <Link
                to="/"
                aria-label="Our product"
                title="Our product"
                className="font-medium tracking-wide text-white transition-colors duration-200 hover:text-deep-purple-accent-400"
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                to="/"
                aria-label="Our product"
                title="Our product"
                className="font-medium tracking-wide text-white transition-colors duration-200 hover:text-deep-purple-accent-400"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/"
                aria-label="Product pricing"
                title="Product pricing"
                className="font-medium tracking-wide text-white transition-colors duration-200 hover:text-deep-purple-accent-400"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                to="/"
                aria-label="About us"
                title="About us"
                className="font-medium tracking-wide text-white transition-colors duration-200 hover:text-deep-purple-accent-400"
              >
                About us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
