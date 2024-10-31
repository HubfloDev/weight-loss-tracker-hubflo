import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import { supabase } from '../supabase/client';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    console.log('USER', user);
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select(`
          id, email, role, created_at, first_name, last_name, weight_records (date, weight)
        `); // Fetch weight records along with user info

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        const nonAdminUsers = data
          .filter((_user) => {
            console.log({ _user });
            if (user.role === 'admin') {
              return _user.role !== 'admin';
            }

            return _user.role !== 'admin' && _user.role !== 'doctor';
          }) // Filter out admins
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUsers(nonAdminUsers);
        setFilteredUsers(nonAdminUsers); // Set the initial filtered users
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter((user) => {
      const fullName = `${user.first_name || ''} ${
        user.last_name || ''
      }`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const data = useMemo(() => filteredUsers, [filteredUsers]);

  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: (row) =>
          row.first_name && row.last_name
            ? `${row.first_name} ${row.last_name}`
            : 'N/A' // If either first_name or last_name is missing, display 'N/A'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Started On',
        accessor: 'created_at',
        Cell: ({ value }) => new Date(value).toLocaleDateString() // Format date as 'Started On'
      },
      {
        Header: 'Initial Weight',
        accessor: (row) =>
          row.weight_records.length > 0
            ? row.weight_records[0].weight
            : 'No data' // Display initial weight if available
      },
      {
        Header: 'Last 4 Recorded Weights',
        accessor: (row) =>
          row.weight_records.length > 0
            ? row.weight_records
                .slice(-4)
                .map((record) => record.weight)
                .join(', ') // Display last 4 recorded weights
            : 'No data'
      },
      {
        Header: 'Weight Loss',
        accessor: (row) => {
          if (row.weight_records.length > 1) {
            const initialWeight = row.weight_records[0].weight;
            const lastWeight =
              row.weight_records[row.weight_records.length - 1].weight;
            return Math.abs(initialWeight - lastWeight); // Calculate weight loss
          }
          return 'No data';
        }
      },
      {
        Header: 'Last Recorded',
        accessor: (row) =>
          row.weight_records.length > 0
            ? new Date(
                row.weight_records[row.weight_records.length - 1].date
              ).toLocaleDateString() // Display last recorded date
            : 'No data'
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using rows, we'll use page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 } // Pass our hoisted table state
    },
    usePagination
  );

  const handleRowClick = (user) => {
    navigate(`/home/${user.id}`); // Navigate to the Home component with the user's ID
  };

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto my-8">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Patient Weight Tracker
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Monitor your patients' weight and track their weight loss
              progress.
            </p>
          </div>
          <div className="sm:flex-none">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2 px-4 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen"
            />
          </div>
        </div>
        <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-gray-300 hover:table-hover">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(row.original)}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className={classNames(
                          'border-t border-gray-200 px-3 py-3.5 text-sm text-gray-500'
                        )}>
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination mt-4">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="mr-2 rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customGreenDefault">
            {'<<'}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="mr-2 rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customGreenDefault">
            {'<'}
          </button>
          <span className="text-sm text-gray-700">
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="ml-2 rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customGreenDefault">
            {'>'}
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="ml-2 rounded-md bg-customGreen px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-customGreenDefault">
            {'>>'}
          </button>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-2 rounded-md border-gray-300 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-customGreen">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
