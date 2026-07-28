import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const openNewTaskDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: 'New Task' }));
  return screen.getByRole('dialog');
};

describe('KanbanBoard', () => {
  it('renders the seeded columns', () => {
    render(<App />);
    for (const title of ['Todo', 'In Progress', 'Review', 'Done']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
    }
  });

  it('creates a task and persists it to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    const dialog = await openNewTaskDialog(user);
    await user.type(within(dialog).getByLabelText('Title'), 'Ship the audit');
    await user.click(within(dialog).getByRole('button', { name: 'Create Task' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByText('Ship the audit')).toBeInTheDocument();

    const saved = window.localStorage.getItem('kanban-board-data-v4');
    expect(saved).toContain('Ship the audit');
  });

  // Regression: the reset effect keyed on [task, defaultColumnId] never re-ran
  // when both were unchanged, so cancelled text survived into the next open.
  it('does not carry cancelled text into the next New Task dialog', async () => {
    const user = userEvent.setup();
    render(<App />);

    let dialog = await openNewTaskDialog(user);
    await user.type(within(dialog).getByLabelText('Title'), 'Abandoned draft');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    dialog = await openNewTaskDialog(user);
    expect(within(dialog).getByLabelText('Title')).toHaveValue('');
  });

  it('searches across description and tags, not just the title', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('searchbox', { name: /search tasks/i });

    // "middleware" appears only in a description.
    await user.type(search, 'middleware');
    expect(screen.getByText('API rate limiting')).toBeInTheDocument();
    expect(screen.queryByText('Design token audit')).not.toBeInTheDocument();

    await user.clear(search);
    // "DevOps" appears only as a tag.
    await user.type(search, 'devops');
    expect(screen.getByText('Setup CI/CD pipeline')).toBeInTheDocument();
    expect(screen.queryByText('API rate limiting')).not.toBeInTheDocument();
  });

  it('requires confirmation before deleting and offers an undo', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText('Design token audit'));
    const dialog = screen.getByRole('dialog');

    await user.click(within(dialog).getByRole('button', { name: 'Delete Task' }));
    expect(screen.getByText('Design token audit')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Yes, delete' }));
    expect(screen.queryByText('Design token audit')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Undo' }));
    expect(screen.getByText('Design token audit')).toBeInTheDocument();
  });

  it('closes the dialog on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup();
    render(<App />);

    const trigger = screen.getByRole('button', { name: 'New Task' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('switches to the list view and still shows every task', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'List' }));

    const list = screen.getByRole('list', { name: 'All tasks' });
    expect(within(list).getAllByRole('button')).toHaveLength(9);
    expect(screen.getByText('Design token audit')).toBeInTheDocument();
    // Columns are gone in list view.
    expect(screen.queryByRole('heading', { name: 'Todo' })).not.toBeInTheDocument();
  });

  it('derives the summary stats from the board rather than hardcoding them', () => {
    render(<App />);
    const summary = screen.getByRole('region', { name: 'Board summary' });

    // Seed board: 9 tasks, 2 of them in Done.
    expect(within(summary).getByText('22%')).toBeInTheDocument();
    expect(within(summary).getByText('2 of 9 done')).toBeInTheDocument();
  });

  it('recovers from a corrupt persisted board instead of crashing', () => {
    window.localStorage.setItem('kanban-board-data-v4', '{"columns":"not-an-array"}');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Todo' })).toBeInTheDocument();
  });
});
