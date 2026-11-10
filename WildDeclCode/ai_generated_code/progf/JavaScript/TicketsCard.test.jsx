import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import OfficersDropdown from "../../components/OfficersDropdown";
import TicketsCard from "../../components/TicketsCard";
import api from "../../api";
import { MemoryRouter } from "react-router-dom";
import { useState } from "react";
import { ACCESS_TOKEN } from "../../constants";
import React from "react";
import { toast } from "sonner";
import { act } from 'react';
vi.mock('sonner', () => ({
	toast: {
		promise: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
	},
}));

vi.mock('../../api', () => ({
	__esModule: true,
	default: {
		get: vi.fn(),
    post:vi.fn(),
	},
}));

describe("TicketsCard - rendering", () => {
  // const mockDepartments = [
  //   {
  //     id: 1,
  //     name: "Department1",
  //     description: "Description1",
  //   },
  //   {
  //     id: 2,
  //     name: "Department2",
  //     description: "Description2",
  //   },
  //   {
  //     id: 3,
  //     name: "Department3",
  //     description: "Description3",
  //   }
  // ];
  beforeEach(() => {
		vi.resetAllMocks();
		localStorage.setItem(ACCESS_TOKEN, 'mock_access_token');
		
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

  it("Tickets Card - render default elements", () => {
    render(
      <TicketsCard
        user={{}}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );
    expect(screen.getByText("Tickets")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tickets-dropdown")).toBeInTheDocument();
    expect(screen.getByText(/rows per page:/i)).toBeInTheDocument();

    expect(screen.getByText("Subject")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();

    screen.getByRole("button", { name: /chat/i });
    expect(screen.getByText("ticket 1")).toBeInTheDocument();
  });

  it("Tickets Card should display extra table headings if the user is an officer", () => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };
    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );

    screen.getByRole("button", { name: /chat/i });
    expect(screen.getByTestId("toggle-status")).toBeInTheDocument();
    expect(screen.getByTestId("toggle-priority")).toBeInTheDocument();
    expect(screen.getByTestId("more-actions-dropdown")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /select an officer/i }))
      .toBeInTheDocument;
    expect(screen.getByRole("button", { name: /redirect/i })).toBeInTheDocument;

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    // Assert that "Change Due Date" button appears
    expect(
      screen.getByRole("button", { name: /change due date/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/suggested departments/i)
    ).not.toBeInTheDocument();
  });

  it("Tickets Card should display extra table headings and buttons if the user is an admin", async () => {
    vi.spyOn(React, "useState").mockReturnValueOnce([
      { 1: { id: 101, name: "IT Support" } },
      vi.fn(),
    ]);

    render(
      <TicketsCard
        user={{ is_staff: true, is_superuser: true }}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    expect(screen.getByTestId("status-history-button")).toBeInTheDocument();
    expect(screen.getByTestId("ticket-path-button")).toBeInTheDocument();

    // Close More Actions dropdown
    fireEvent.click(moreActionsButton);

    // Open AI Suggestion dropdown
    const AISuggestionButton = screen.getByRole("button", {
      name: /ai suggestion/i,
    });
    fireEvent.click(AISuggestionButton);

    expect(screen.getByRole("button", { name: /suggest departments/i }))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: /suggest ticket grouping/i }))
      .toBeInTheDocument();

    // Close AI Suggestion dropdown
    fireEvent.click(AISuggestionButton);
    screen.debug();

    // Suggested department column and Redirect button
    expect(screen.getByText(/suggested departments/i)).toBeInTheDocument();
    expect(screen.getByTestId("suggested-redirect-button")).toBeInTheDocument();
  });

  it("Tickets Card should show 'No suggestion' when there are no suggested departments", () => {
    vi.spyOn(React, "useState").mockReturnValueOnce([{}, vi.fn()]);

    render(
      <TicketsCard
        user={{ is_staff: true, is_superuser: true }}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );

    const ticketRow = screen.getByRole("row", { name: /ticket 1/i });

    const cells = within(ticketRow).getAllByRole("cell");

    const suggestionCell = cells.find((cell) =>
      within(cell).queryByText("No suggestion")
    );

    expect(suggestionCell).toBeInTheDocument();
  });

	it('Correct API should be changed when status toggled', async () => {
		const mockOfficer = {
			user: {
				id: 101,
				username: '@officer1',
			},
			department: 'IT',
		};

    const mockFetchTickets = vi.fn();

    api.get.mockResolvedValue({ data: { message: "Success" } });

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
        fetchTickets={mockFetchTickets}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));

    const toggleStatusButton = screen.getByTestId("toggle-status");
    fireEvent.click(toggleStatusButton);

		await waitFor(() => {
			expect(api.get).toHaveBeenCalledWith(
				'/api/tickets/change-status/1/',
				expect.objectContaining({
					headers: { Authorization: 'Bearer mock_access_token' },
				})
			);
		});
	});

	it('Correct API should be changed when proiority toggled', async () => {
		const mockOfficer = {
			user: {
				id: 101,
				username: '@officer1',
			},
			department: 'IT',
		};

    const mockFetchTickets = vi.fn();

    api.get.mockResolvedValue({ data: { message: "Success" } });

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={[{ id: 1, subject: "ticket 1", priority: "testPriority" }]}
        fetchTickets={mockFetchTickets}
      />
    );

    await waitFor(() => screen.getByText("ticket 1"));

    const togglePriorityButton = screen.getByTestId("toggle-priority");
    fireEvent.click(togglePriorityButton);

		await waitFor(() => {
			expect(api.get).toHaveBeenCalledWith(
				'/api/tickets/change-priority/1/',
				expect.objectContaining({
					headers: { Authorization: 'Bearer mock_access_token' },
				})
			);
		});
	});


describe('TicketsCard - Toggle Change', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		localStorage.setItem(ACCESS_TOKEN, 'mock_access_token');
		api.get.mockImplementation((url) => {
			if (url.startsWith('/api/tickets/change-priority/')) {
				return Promise.resolve({ response: { data: 'Priority changed' } });
			}
			if (url.startsWith('/api/tickets/change-status/')) {
				return Promise.resolve({ response: { data: 'Status changed' } });
			}
			return Promise.reject(new Error('Unknown API call'));
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('toast.promise should works correctly when toggling status', async () => {
		const mockFetchTickets = vi.fn();

		render(
			<TicketsCard
				user={{ is_staff: true }}
				officers={[]}
				tickets={[{ id: 1, subject: 'ticket 1', status: 'testStatus' }]}
				fetchTickets={mockFetchTickets}
			/>
		);

		await waitFor(() => screen.getByText('ticket 1'));

		const toggleStatusButton = screen.getByTestId('toggle-status');
		fireEvent.click(toggleStatusButton);

		await waitFor(() => {
			expect(toast.promise).toHaveBeenCalledWith(
				expect.any(Promise),
				expect.objectContaining({
					loading: 'Changing...',
					success: expect.any(Function),
					error: expect.any(Function),
				})
			);
			expect(mockFetchTickets).not.toHaveBeenCalled();
		});

		// Now, test the behavior of the success function separately
		const toastCallArgs = toast.promise.mock.calls[0]; // Get first call arguments
		const toastOptions = toastCallArgs[1]; // Second argument (options object)

		expect(await toastOptions.success()).toMatch(/changed successfully!/);

		// Test error function with a mock error response
		const mockError = { response: { data: 'Something went wrong' } };
		expect(toastOptions.error(mockError)).toBe(
      'Error changing status: Something went wrong'
    );
    

		// Test error function with a standard error
		const standardError = new Error('Network failure');
		expect(toastOptions.error(standardError)).toBe(
			'Error changing status: Network failure'
		);
	});

	it('toast.promise should works correctly when toggling priority', async () => {
		const mockFetchTickets = vi.fn();

		render(
			<TicketsCard
				user={{ is_staff: true }}
				officers={[]}
				tickets={[{ id: 1, subject: 'ticket 1', priority: 'testPriority' }]}
				fetchTickets={mockFetchTickets}
			/>
		);

		await waitFor(() => screen.getByText('ticket 1'));

		const togglePriorityButton = screen.getByTestId('toggle-priority');
		fireEvent.click(togglePriorityButton);

		await waitFor(() => {
			expect(toast.promise).toHaveBeenCalledWith(
				expect.any(Promise),
				expect.objectContaining({
					loading: 'Changing...',
					success: expect.any(Function),
					error: expect.any(Function),
				})
			);
			expect(mockFetchTickets).not.toHaveBeenCalled();
		});

		// Now, test the behavior of the success function separately
		const toastCallArgs = toast.promise.mock.calls[0]; // Get first call arguments
		const toastOptions = toastCallArgs[1]; // Second argument (options object)

		expect(await toastOptions.success()).toMatch(/changed successfully!/);

		// Test error function with a mock error response
		const mockError = { response: { data: 'Something went wrong' } };
		expect(toastOptions.error(mockError)).toBe(
			'Error changing priority: Something went wrong'
		);

		// Test error function with a standard error
		const standardError = new Error('Network failure');
		expect(toastOptions.error(standardError)).toBe(
			'Error changing priority: Network failure'
		);
	});
});

describe('TicketsCard - Popup', () => {

  beforeEach(() => {
		vi.resetAllMocks();
		localStorage.setItem(ACCESS_TOKEN, 'mock_access_token');
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('Chat popup should be displayed when the chat button is pressed', async () => {
		render(
			<TicketsCard
				user={{}}
				tickets={[{ id: 1, subject: 'ticket 1', status: 'testStatus' }]}
				setSelectedTicket={vi.fn()}
				setTickets={vi.fn()}
			/>
		);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Chat").closest("button"));
    //await waitFor(() => expect(screen.getByText(/chat for ticket/i)).toBeInTheDocument());
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[1]);
    await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
    fireEvent.click(screen.getByText("Chat").closest("button"));
    const buttons2 = screen.getAllByRole("button");
    fireEvent.click(buttons2[0]);
    await waitFor(() => expect(screen.getByText("Chat")).toBeInTheDocument());
  });

  it("Change date popup", async () => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    render(
      <MemoryRouter>
        <TicketsCard
          user={{ is_staff: true }}
          officers={[mockOfficer]}
          tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
          setSelectedTicket={vi.fn()}
          setTickets={vi.fn()}
          selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
        />
      </MemoryRouter>
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    fireEvent.click(screen.getByText(/change due date/i).closest("button"));
    await waitFor(() =>
      expect(screen.getByText(/change date/i)).toBeInTheDocument()
    );
  });

  it("Status history popup", async () => {
    const mockSetSelectedTicket = vi.fn();

    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    render(
      <MemoryRouter>
        <TicketsCard
          user={{ is_staff: true, is_superuser: true }}
          officers={[mockOfficer]}
          tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
          setSelectedTicket={mockSetSelectedTicket}
          setTickets={vi.fn()}
          selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
        />
      </MemoryRouter>
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    fireEvent.click(screen.getByTestId("status-history-button"));
    await waitFor(() =>
      expect(screen.getByText(/old status/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/new status/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/changed by/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/changed at/i)).toBeInTheDocument()
    );
    await waitFor(() => expect(screen.getByText(/notes/i)).toBeInTheDocument());

    const closeButton = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeButton);

    expect(mockSetSelectedTicket).toHaveBeenCalledWith(null);
  });

  it("Ticket path popup", async () => {
    const mockSetSelectedTicket = vi.fn();

    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };

    render(
      <MemoryRouter>
        <TicketsCard
          user={{ is_staff: true, is_superuser: true }}
          officers={[mockOfficer]}
          tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
          setSelectedTicket={mockSetSelectedTicket}
          setTickets={vi.fn()}
          selectedTicket={{ id: 1, subject: "ticket 1", status: "testStatus" }}
        />
      </MemoryRouter>
    );

    // Open the More Actions dropdown
    const moreActionsButton = screen.getByTestId("more-actions-dropdown");
    fireEvent.click(moreActionsButton);

    fireEvent.click(screen.getByTestId("ticket-path-button"));
    await waitFor(() =>
      expect(screen.getByText(/redirected from/i)).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(screen.getByText(/redirected to/i)).toBeInTheDocument()
    );

    const closeButton = screen.getByRole("button", { name: "✕" });
    fireEvent.click(closeButton);

    expect(mockSetSelectedTicket).toHaveBeenCalledWith(null);
  });

	it('Ticket details popup', async () => {
		const mockSetSelectedTicket = vi.fn();

		const mockOfficer = {
			user: {
				id: 101,
				username: '@officer1',
			},
			department: 'IT',
		};

		render(
			<MemoryRouter>
				<TicketsCard
					user={{ is_staff: true, is_superuser: true }}
					officers={[mockOfficer]}
					tickets={[{ id: 1, subject: 'ticket 1', status: 'testStatus' }]}					setSelectedTicket={mockSetSelectedTicket}
					setTickets={vi.fn()}
					selectedTicket={{ id: 1, subject: 'ticket 1', status: 'testStatus' }}
				/>
			</MemoryRouter>
		);

		const cell = screen.getByRole('cell', { name: /ticket 1/i });
		fireEvent.click(cell);

		expect(
			screen.getByRole('heading', { name: /ticket 1/i })
		).toBeInTheDocument();

		const closeButton = screen.getByRole('button', { name: '✕' });
		fireEvent.click(closeButton);

		expect(mockSetSelectedTicket).toHaveBeenCalledWith(null);
	});
});

// Wrapper Penned via basic programming aids
const SubjectAndSameStatusTest = () => {
  const [tickets, setTickets] = useState([
    { id: 1, subject: "ticket 1", status: "test status" },
    { id: 2, subject: "ticket 2", status: "test status" },
  ]);

  return (
    <TicketsCard
      user={{}}
      tickets={tickets}
      setSelectedTicket={vi.fn()}
      setTickets={setTickets}
    />
  );
};
describe('TicketsCard - Sorting', () => {
	it('Tickets are correctly sorted by subject when subject is clicked', async () => {
		render(<SubjectAndSameStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    await waitFor(() => screen.getByText("ticket 2"));

    fireEvent.click(screen.getByText("Subject").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("ticket 1")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("ticket 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Subject").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");

    expect(within(rowsDesc[1]).getByText("ticket 2")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("ticket 1")).toBeInTheDocument();
  });

  it("Sorting is handled correctly when status is clicked and both status's are the same", async () => {
    render(<SubjectAndSameStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("test status")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("test status")).toBeInTheDocument();
  });

  const DifferentStatusTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status a" },
      { id: 2, subject: "ticket 2", status: "test status b" },
    ]);

    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by status when status is clicked", async () => {
    render(<DifferentStatusTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("test status a")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("test status b")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Status").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");
    expect(within(rowsDesc[1]).getByText("test status b")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("test status a")).toBeInTheDocument();
  });

  const DifferentPrioritiesTest = () => {
    const [tickets, setTickets] = useState([
      { id: 1, subject: "ticket 1", status: "test status", priority: "Low" },
      { id: 2, subject: "ticket 2", status: "test status", priority: "High" },
    ]);

    return (
      <TicketsCard
        user={{}}
        tickets={tickets}
        setSelectedTicket={vi.fn()}
        setTickets={setTickets}
      />
    );
  };

  it("Tickets are correctly sorted by priority when priority is clicked", async () => {
    render(<DifferentPrioritiesTest />);

    await waitFor(() => screen.getByText("ticket 1"));
    fireEvent.click(screen.getByText("Priority").closest("button"));
    await waitFor(() => expect(screen.getByText("▲")).toBeInTheDocument());
    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("High")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("Low")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Priority").closest("button"));
    await waitFor(() => expect(screen.getByText("▼")).toBeInTheDocument());
    const rowsDesc = screen.getAllByRole("row");
    expect(within(rowsDesc[1]).getByText("Low")).toBeInTheDocument();
    expect(within(rowsDesc[2]).getByText("High")).toBeInTheDocument();
  });

  it("should correctly handle sorting when some values are null or undefined", async () => {
    const mockTickets = [
      { id: 1, subject: "Ticket A", status: "Open", priority: "High" },
      { id: 2, subject: "Ticket B", status: "Closed", priority: "Low" },
      { id: 3, subject: "Ticket C", status: "Closed", priority: null },
      { id: 4, subject: "Ticket D", status: "Closed", priority: undefined },
    ];

    render(
      <TicketsCard
        user={{}}
        tickets={mockTickets}
        setTickets={vi.fn()}
        fetchTickets={vi.fn()}
        openPopup={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText("Priority").closest("button"));

    const rowsAsc = screen.getAllByRole("row");
    expect(within(rowsAsc[1]).getByText("Not Set")).toBeInTheDocument();
    expect(within(rowsAsc[2]).getByText("Not Set")).toBeInTheDocument();
    expect(within(rowsAsc[3]).getByText("High")).toBeInTheDocument();
    expect(within(rowsAsc[4]).getByText("Low")).toBeInTheDocument();
  });
});

describe("TicketsCard - Filtering", () => {
  let tickets;
  let user;
  let officers;

  beforeEach(() => {
    vi.clearAllMocks();
    user = { is_staff: true };
    officers = [
      { user: { id: 1, username: "@officer1" }, department: "IT" },
      { user: { id: 2, username: "@officer2" }, department: "HR" },
    ];
    tickets = [
      {
        id: 1,
        subject: "Ticket 1",
        priority: "High",
        status: "Open",
        is_overdue: true,
      },
      {
        id: 2,
        subject: "Ticket 2",
        priority: "Medium",
        status: "Closed",
        is_overdue: false,
      },
      {
        id: 3,
        subject: "Ticket 3",
        priority: "Low",
        status: "Open",
        is_overdue: false,
      },
      {
        id: 4,
        subject: "Ticket 4",
        priority: "High",
        status: "In Progress",
        is_overdue: true,
      },
    ];
  });

  it("applies priority filter correctly", async () => {
    render(<TicketsCard user={user} tickets={tickets} officers={officers} />);

    // Open Filter dropdown
    const filterTicketsDropdown = screen.getByTestId("filter-tickets-dropdown");
    fireEvent.click(filterTicketsDropdown);

    // Select "High" priority
    const highPriorityInput = screen.getByDisplayValue("High");

    expect(highPriorityInput).toHaveAttribute("name", "priority");
    expect(highPriorityInput).toHaveAttribute("value", "High");

    fireEvent.click(highPriorityInput);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    // Close dropdown
    fireEvent.click(filterTicketsDropdown);

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });

    // Ensure non-high priority tickets are filtered out
    expect(screen.queryByText("Ticket 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Ticket 3")).not.toBeInTheDocument();
  });

  it("applies status filter correctly", async () => {
    render(<TicketsCard user={user} tickets={tickets} officers={officers} />);

    // Open Filter dropdown
    const filterTicketsDropdown = screen.getByTestId("filter-tickets-dropdown");
    fireEvent.click(filterTicketsDropdown);

    // Select "Open" status
    const openStatusInput = screen.getByDisplayValue("Open");

    expect(openStatusInput).toHaveAttribute("name", "status");
    expect(openStatusInput).toHaveAttribute("value", "Open");

    fireEvent.click(openStatusInput);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    // Close dropdown
    fireEvent.click(filterTicketsDropdown);

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 3")).toBeInTheDocument();
    });

    // Ensure non-"Open" tickets are filtered out
    expect(screen.queryByText("Ticket 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Ticket 4")).not.toBeInTheDocument();
  });

	it('applies overdue filter correctly', async () => {
		render(<TicketsCard user={user} tickets={tickets} officers={officers} />);

		// Open Filter dropdown
		const filterTicketsDropdown = screen.getByTestId('filter-tickets-dropdown');
		fireEvent.click(filterTicketsDropdown);

		// Select "Overdue" status
		const yesOverdueInput = screen.getByDisplayValue(true);
		expect(yesOverdueInput).toHaveAttribute('name', 'isOverdue');
		expect(yesOverdueInput).toHaveAttribute('value', 'true');

		fireEvent.click(yesOverdueInput);

		const applyButton = screen.getByText('Apply');
		fireEvent.click(applyButton);

		// Close dropdown
		fireEvent.click(filterTicketsDropdown);

		await waitFor(() => {
			expect(screen.getByText('Ticket 1')).toBeInTheDocument();
			expect(screen.getByText('Ticket 4')).toBeInTheDocument();
		});

		// Ensure non-overdue tickets are filtered out
		expect(screen.queryByText('Ticket 2')).not.toBeInTheDocument();
		expect(screen.queryByText('Ticket 3')).not.toBeInTheDocument();
	});

  it("clears filters correctly and restores all tickets", async () => {
    render(<TicketsCard user={user} tickets={tickets} officers={officers} />);

    // Open Filter dropdown
    const filterTicketsDropdown = screen.getByTestId("filter-tickets-dropdown");
    fireEvent.click(filterTicketsDropdown);

    // Select "High" priority
    const highPriorityInput = screen.getByDisplayValue("High");

    expect(highPriorityInput).toHaveAttribute("name", "priority");
    expect(highPriorityInput).toHaveAttribute("value", "High");

    fireEvent.click(highPriorityInput);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    // Click "Clear Filters"
    const clearButton = screen.getByTestId("clear-button-inside");
    fireEvent.click(clearButton);

    // Close dropdown
    fireEvent.click(filterTicketsDropdown);

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 2")).toBeInTheDocument();
      expect(screen.getByText("Ticket 3")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });
  });

  it("clear button becomes visible after applying filter", async () => {
    render(<TicketsCard user={user} tickets={tickets} officers={officers} />);

    // Open Filter dropdown
    const filterTicketsDropdown = screen.getByTestId("filter-tickets-dropdown");
    fireEvent.click(filterTicketsDropdown);

    // Select "High" priority
    const highPriorityInput = screen.getByDisplayValue("High");

    expect(highPriorityInput).toHaveAttribute("name", "priority");
    expect(highPriorityInput).toHaveAttribute("value", "High");

    fireEvent.click(highPriorityInput);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);

    // Close dropdown
    fireEvent.click(filterTicketsDropdown);

    expect(screen.getByTestId("clear-button-outside")).toBeInTheDocument();

    const clearButton = screen.getByTestId("clear-button-outside");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText("Ticket 1")).toBeInTheDocument();
      expect(screen.getByText("Ticket 2")).toBeInTheDocument();
      expect(screen.getByText("Ticket 3")).toBeInTheDocument();
      expect(screen.getByText("Ticket 4")).toBeInTheDocument();
    });
  });

  it("handle case where no tickets are present corectly", async () => {
    const setShowingTickets = vi.fn();
    vi.spyOn(React, "useState")
      .mockImplementationOnce(() => [[], setShowingTickets])
      .mockImplementation((initial) => [initial, vi.fn()]);

    render(<TicketsCard user={user} tickets={[]} officers={officers} />);

    // Open Filter dropdown
    const filterTicketsDropdown = screen.getByTestId("filter-tickets-dropdown");
    fireEvent.click(filterTicketsDropdown);

    // Apply a filter
    const highPriorityInput = screen.getByDisplayValue("High");

    expect(highPriorityInput).toHaveAttribute("name", "priority");
    expect(highPriorityInput).toHaveAttribute("value", "High");

    fireEvent.click(highPriorityInput);

    const applyButton = screen.getByText("Apply");
    fireEvent.click(applyButton);
  });
});

it("should call handleSelectOfficer when an officer is selected", () => {
  const ticketId = 1;
  const mockOfficer = { user: { id: 101, username: "@officer1" } };
  const mockHandleSelectOfficer = vi.fn(); // Spy function

  render(
    <OfficersDropdown
      ticketId={ticketId}
      officers={[mockOfficer]}
      admin={null}
      onSelectOfficer={mockHandleSelectOfficer}
    />
  );

  // Open the dropdown
  const dropdownButton = screen.getByText("Select an officer");
  fireEvent.click(dropdownButton);

  // Click the officer option
  const officerOption = screen.getByText("@officer1");
  fireEvent.click(officerOption);

  expect(mockHandleSelectOfficer).toHaveBeenCalledWith(ticketId, mockOfficer);
});

it("should update selectedOfficers state when an officer is selected", async () => {
  const ticketId = 1;
  const mockOfficer = { user: { id: 101, username: "@officer1" } };

  render(
    <TicketsCard
      user={{ is_staff: true }}
      officers={[mockOfficer]}
      tickets={[{ id: ticketId }]}
    />
  );

  // Open the dropdown
  fireEvent.click(screen.getByText("Select an officer"));

  // Select officer
  fireEvent.click(screen.getByText("@officer1"));

  const officersDropdown = screen.getByTestId("officers-dropdown-menu");
  await waitFor(() => {
    expect(within(officersDropdown).getByText("@officer1")).toBeInTheDocument();
  });
});


  

  it("Redirecting tickets causing less ticket pages should update properly", async() => {
    const mockOfficer = {
      user: {
        id: 101,
        username: "@officer1",
      },
      department: "IT",
    };
    const mockTickets = [
    ];
    for (let i = 0; i < 6; i++) {
      mockTickets.push(
        {
        id: i, subject: `ticket ${i}`, status: `status ${i}`,
        }
      );
    }

    const mockRemovedTickets = [...mockTickets];
    mockRemovedTickets.pop()
    api.post.mockResolvedValue({ 
      data: { 
        success: true, 
        ticket: mockRemovedTickets,
      } 
    });

    render(
      <TicketsCard
        user={{ is_staff: true }}
        officers={[mockOfficer]}
        tickets={mockTickets}
      />
    );
    
    expect(screen.getByText("ticket 1")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click((screen.getByText('Last')));
    });
    expect(screen.getByText("ticket 5")).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getAllByRole("button", { name: /select an officer/i })[0]);
  });
    expect(screen.getByText('@officer1')).toBeInTheDocument();
    
    await act(async () => {
      fireEvent.click((screen.getByText('@officer1')));
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /redirect/i }));
    });
    await waitFor(() => {expect(screen.getByText("ticket 5")).toBeInTheDocument();  });

  });

  it("redirect to department as admin", async () => {
    api.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'department 1',
          description: 'description 1',
        },
      ],
    });

    render(
      <TicketsCard
        user={{ is_staff: true, is_superuser: true }}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
      />
    );
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { name: /redirect/i })[0]);
    });
    expect(screen.getByRole("button", { name: /Select a department/i })).toBeInTheDocument();
    await act(async () => {
    fireEvent.click(screen.getAllByRole("button", { name: /Select a department/i })[0]);
  });
    expect(screen.getByText('department 1')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('department 1'));
    });
    await act(async () => {
      fireEvent.click(screen.getAllByRole("button", { name: /redirect/i })[0]);
    });
    expect(screen.getByText('ticket 1')).toBeInTheDocument();
  });

it("Suggestion", async () => {
  localStorage.setItem(ACCESS_TOKEN, 'mock_access_token');

  api.get.mockResolvedValue({
    data: [
      {
        id: 1,
        name: 'department 1',
        description: 'description 1',
      },
    ],
  });

  api.post.mockImplementation((url) => {
    if (url.startsWith('/api/suggested-department/')) {
      return Promise.resolve({ data:  {
        suggested_department: {
            id: 12,
            name: "Finance"
        },
        "confidence_score": 1
    }});
    }
    return Promise.reject(new Error('Unknown API call'));
  });

  render(
    <TicketsCard
      user={{ is_staff: true, is_superuser: true }}
      tickets={[{
        id: 113,
        subject: "Request for Professional Development Support",
        description: "I need financial assistance for a training course.",
        status: "In Progress",
        priority: "High",
        created_at: "2025-03-12T16:26:13.532025Z",
        updated_at: "2025-03-13T01:57:14.977674Z",
        due_date: "2025-03-21T16:26:13.532025Z",
        is_overdue: false,
        assigned_to: "@admin1"
      }]}
    />
  );

  const AISuggestionButton = screen.getByRole("button", {
    name: /ai suggestion/i,
  });
  await act(async () => {
    fireEvent.click(AISuggestionButton);
  });
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: /suggest departments/i }));
  });

  expect(api.post).toHaveBeenCalledWith(
    '/api/suggested-department/',
    {
      ticket_id: 113,
      description: "I need financial assistance for a training course.",
    },
    expect.objectContaining({
      headers: {
        Authorization: `Bearer mock_access_token`,
        'Content-Type': 'application/json',
      },
    })
  );
  await waitFor(() => {
    // expect(screen.getByText("Suggested Departments")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
  });
  expect(screen.getByTestId("suggested-redirect-button")).toBeInTheDocument();
});

it("close chat pop up", () => {
  // Wrapper Penned via basic programming aids
  const Wrapper = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    return (
      <TicketsCard
        user={{}}
        tickets={[{ id: 1, subject: "ticket 1", status: "testStatus" }]}
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
      />
    );
  };

  render(<Wrapper />);

  fireEvent.click(screen.getByRole("button", { name: /chat/i })); 
  fireEvent.click(screen.getByRole("button", { name: /✕/i })); 
  fireEvent.click(screen.getByRole("button", { name: /chat/i })); 
  fireEvent.click(screen.getByRole("button", { name: /✖/i })); 
  
});

});