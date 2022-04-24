import React from "react";
import { render, screen } from "@testing-library/react";
import { SupabaseClient } from "@supabase/supabase-js";
import Auth from "./Auth";

test("renders learn react link", () => {
  // TODO: const mock = jest.mocked(SupabaseClient, true);
  const client = new SupabaseClient("https://test.supabase.co", "abc");
  render(<Auth supabaseClient={client} />);
  const linkElement = screen.getByText(/Sign in/i);
  expect(linkElement).toBeInTheDocument();
});
