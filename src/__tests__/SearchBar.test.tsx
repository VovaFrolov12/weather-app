import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchBar } from "@/components/SearchBar";

describe("SearchBar", () => {
  it("does not submit an empty query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} isSearching={false} />);

    await user.click(screen.getByRole("button", { name: "Найти" }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("submits a non-empty query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} isSearching={false} />);

    await user.type(screen.getByLabelText("Поиск города"), "Москва");
    await user.click(screen.getByRole("button", { name: "Найти" }));

    expect(onSearch).toHaveBeenCalledWith("Москва");
  });
});
