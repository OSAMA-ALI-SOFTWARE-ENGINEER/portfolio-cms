import { apiRequest } from './api';

// Public: Get comments for a blog
export const getBlogComments = async (blogId) => {
    // apiRequest handles base URL and JSON parsing
    const data = await apiRequest(`/comments/${blogId}`);
    return data;
};

// Public: Post a comment
export const createComment = async ({ blogId, ...data }) => {
    const response = await apiRequest(`/comments/${blogId}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response;
};

// Admin: Get all comments with filters
export const getAdminComments = async ({ status = 'all', search = '', page = 1 }) => {
    const params = new URLSearchParams({
        status,
        search,
        page: page.toString()
    });

    const data = await apiRequest(`/comments/admin/all?${params.toString()}`);
    return data;
};

// Admin: Update comment status
export const updateCommentStatus = async ({ id, status }) => {
    const data = await apiRequest(`/comments/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    });
    return data; // returns { success: true, message: ... }
};

// Admin: Delete comment permanently
export const deleteComment = async (id) => {
    await apiRequest(`/comments/${id}`, {
        method: 'DELETE'
    });
};
