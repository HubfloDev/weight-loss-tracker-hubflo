import React from 'react';
import { format } from 'date-fns'; // For date formatting

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Timeline({ data }) {
  return (
    <div className="flow-root">
      <ul role="list" className="space-y-6">
        {data.map((entry, index) => (
          <li key={index} className="relative flex gap-x-4">
            {/* Vertical line between items */}
            {index !== data.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute left-3 top-0 -bottom-6 w-0.5 bg-gray-300"
              />
            ) : null}

            {/* Gray ring (empty circle) with a dot in the middle */}
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-white">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-300 ring-1 ring-gray-300" />
            </div>

            {/* Content */}
            <div className="flex-auto">
              <div className="flex justify-between gap-x-4">
                <div className="py-0.5 text-sm text-gray-500">
                  Weight on{' '}
                  <span className="font-medium text-gray-900">
                    {format(new Date(entry.date), 'MMMM dd, yyyy')}{' '}
                    {/* Date formatting */}
                  </span>
                </div>
                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                  {entry.weight} lbs
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
