import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import SignUpForm from "./SignUpForm";

const server = setupServer(
  rest.post("https://demo-api.now.sh/users", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllTimers();
});
afterAll(() => server.close());
test("renders sign up form", () => {
  render(<SignUpForm />);
  expect(screen.getByTestId("firstname")).toBeInTheDocument();
  expect(screen.getByTestId("lastname")).toBeInTheDocument();
  expect(screen.getByTestId("email")).toBeInTheDocument();
  expect(screen.getByTestId("password")).toBeInTheDocument();
  expect(screen.getByTestId("confirmpassword")).toBeInTheDocument();
});

test("validation error message is shown when form is submitted with invalid first name", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("firstname"), "Test!!");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(
    screen.getByText("Should contain only characters or numbers")
  ).toBeInTheDocument();
});

test("validation error message is shown when form is submitted with invalid last name", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("lastname"), "Test!!");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(
    screen.getByText("Should contain only characters or numbers")
  ).toBeInTheDocument();
});

test("validation error message is shown when form is submitted with invalid email", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("email"), "Test!!");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(screen.getByText("Please enter a valid email")).toBeInTheDocument();
});

test("validation error message is shown when form is submitted with invalid password with less than 8 characters", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("password"), "Test!!");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(
    screen.getByText("Please enter password with minimum of 8 characters")
  ).toBeInTheDocument();
});

test("validation error message is shown when form is submitted with invalid password with no uppercase characters", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("password"), "test1233");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(
    screen.getByText(
      "Please enter password containing atlease one lowercase and uppercase characters"
    )
  ).toBeInTheDocument();
});
test("validation error message is shown when form is submitted with invalid password which matches with user first name", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("firstname"), "test");
  userEvent.type(screen.getByTestId("password"), "test1233A");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(
    screen.getByText(
      "Please enter password that does not contain user's first or last name"
    )
  ).toBeInTheDocument();
});

test("validation error message is shown when form is submitted with confirm password which does not match the password", () => {
  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("password"), "test1233B");
  userEvent.type(screen.getByTestId("confirmpassword"), "test1233A");
  userEvent.click(screen.getByTestId("signupbutton"));

  expect(screen.getByText("Passwords does not match")).toBeInTheDocument();
});

test("form is successfull submitted when there is no validation error messages", async () => {
  server.use(
    rest.get("https://demo-api.now.sh/users", (req, res, ctx) => {
      return res(ctx.status(200));
    })
  );
  jest.useFakeTimers();

  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("firstname"), "Test");
  userEvent.type(screen.getByTestId("lastname"), "Test");
  userEvent.type(screen.getByTestId("email"), "Asdf@gmail.com");
  userEvent.type(screen.getByTestId("password"), "test1233B");
  userEvent.type(screen.getByTestId("confirmpassword"), "test1233B");
  userEvent.click(screen.getByTestId("signupbutton"));

  await waitFor(() => screen.getByText("Sign Up Successful"));
  expect(screen.getByText("Sign Up Successful")).toBeInTheDocument();

  jest.advanceTimersByTime(4000);
  await waitFor(() => screen.getByText("Retrieve user details successful"));

  expect(
    screen.getByText("Retrieve user details successful")
  ).toBeInTheDocument();
});

test("form is not successfull submitted when there sign up request fails", async () => {
  server.use(
    rest.post("https://demo-api.now.sh/users", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  jest.useFakeTimers();

  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("firstname"), "Test");
  userEvent.type(screen.getByTestId("lastname"), "Test");
  userEvent.type(screen.getByTestId("email"), "Asdf@gmail.com");
  userEvent.type(screen.getByTestId("password"), "test1233B");
  userEvent.type(screen.getByTestId("confirmpassword"), "test1233B");
  userEvent.click(screen.getByTestId("signupbutton"));

  await waitFor(() => screen.getByText("Sign Up failed"));
  expect(screen.getByText("Sign Up failed")).toBeInTheDocument();
});

test("error message is shown in header when retrieve user details service fails", async () => {
  server.use(
    rest.get("https://demo-api.now.sh/users", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  jest.useFakeTimers();

  render(<SignUpForm />);
  userEvent.type(screen.getByTestId("firstname"), "Test");
  userEvent.type(screen.getByTestId("lastname"), "Test");
  userEvent.type(screen.getByTestId("email"), "Asdf@gmail.com");
  userEvent.type(screen.getByTestId("password"), "test1233B");
  userEvent.type(screen.getByTestId("confirmpassword"), "test1233B");
  userEvent.click(screen.getByTestId("signupbutton"));

  await waitFor(() => screen.getByText("Sign Up Successful"));
  expect(screen.getByText("Sign Up Successful")).toBeInTheDocument();

  jest.advanceTimersByTime(4000);
  await waitFor(() => screen.getByText("Retrieve user details Failed"));

  expect(screen.getByText("Retrieve user details Failed")).toBeInTheDocument();
});
