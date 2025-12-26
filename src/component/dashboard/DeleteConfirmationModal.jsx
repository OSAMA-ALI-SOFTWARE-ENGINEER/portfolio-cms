import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title }) => {
    const [deleteType, setDeleteType] = useState('temporary'); // 'temporary' or 'permanent'

    if (!isOpen) return null;

    const handleCheckboxChange = (type) => {
        setDeleteType(type);
    };

    const handleSubmit = () => {
        onConfirm(deleteType === 'permanent');
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50 backdrop-blur-sm p-4 md:inset-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        type="button"
                        className="absolute right-4 top-4 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                        <svg
                            className="h-3 w-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>

                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h3 className="mb-2 text-center text-xl font-bold text-gray-900 dark:text-white">
                        Delete Blog Post
                    </h3>
                    <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{title}"</span>? Select an action below:
                    </p>

                    {/* Options */}
                    <div className="mb-6 space-y-3">
                        {/* Temporary Delete */}
                        <label
                            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${deleteType === 'temporary'
                                ? 'border-sky-500 bg-sky-50 dark:border-sky-400 dark:bg-sky-900/20'
                                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex h-5 w-5 items-center justify-center rounded border ${deleteType === 'temporary' ? 'border-sky-500 bg-sky-500 text-white' : 'border-gray-400 bg-white'
                                    }`}>
                                    {deleteType === 'temporary' && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Temporary Delete</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Move to Trash (can be restored)</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={deleteType === 'temporary'}
                                onChange={() => handleCheckboxChange('temporary')}
                            />
                        </label>

                        {/* Permanent Delete */}
                        <label
                            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${deleteType === 'permanent'
                                ? 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-900/20'
                                : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex h-5 w-5 items-center justify-center rounded border ${deleteType === 'permanent' ? 'border-red-500 bg-red-500 text-white' : 'border-gray-400 bg-white'
                                    }`}>
                                    {deleteType === 'permanent' && <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <div>
                                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Permanent Delete</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Remove from database forever</span>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={deleteType === 'permanent'}
                                onChange={() => handleCheckboxChange('permanent')}
                            />
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className={`rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${deleteType === 'permanent'
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-500'
                                }`}
                        >
                            {deleteType === 'permanent' ? 'Delete Permanently' : 'Move to Trash'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;
