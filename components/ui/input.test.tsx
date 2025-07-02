import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders with label", () => {
    render(
      <Input
        label="Email"
        placeholder="Enter email"
        type="email"
        name="email"
      />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("allows typing text", async () => {
    const user = userEvent.setup();
    render(
      <Input
        label="Email"
        placeholder="Enter email"
        type="email"
        name="email"
      />
    );
    const input = screen.getByPlaceholderText("Enter email");
    await user.type(input, "test@example.com");
    expect((input as HTMLInputElement).value).toBe("test@example.com");
  });

  it("displays error message and applies error styles", () => {
    render(
      <Input
        label="Email"
        placeholder="Enter email"
        type="email"
        name="email"
        error={{ type: "", message: "Invalid email" }}
      />
    );
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass("border-red-500");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <Input
        label="Email"
        placeholder="Enter email"
        type="email"
        name="email"
        disabled
      />
    );
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeDisabled();
  });

  it("has proper accessibility attributes", () => {
    render(
      <Input
        label="Email"
        placeholder="Enter email"
        type="email"
        name="email"
      />
    );
    const input = screen.getByLabelText(/email/i);
    expect(input.id).toBe("email");
  });
});
