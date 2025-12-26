import { apiRequest, apiFormRequest } from './api';

// Blog API functions
export async function createBlog(newBlog) {
  const formData = new FormData();

  // Append all blog data to form data
  Object.keys(newBlog).forEach(key => {
    if (newBlog[key] === null || newBlog[key] === undefined) {
      return;
    }
    if (key === 'blogImage') {
      formData.append('blogImage', newBlog[key]);
    } else if (key === 'galleryImages' && newBlog[key] instanceof FileList) {
      Array.from(newBlog[key]).forEach(file => {
        formData.append('galleryImages', file);
      });
    } else {
      formData.append(key, newBlog[key]);
    }
  });

  const response = await apiFormRequest('/blogs', formData);
  return response.data;
}

export async function getBlogs(page = 1, limit = 10, category = '', search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (category) params.append('category', category);
  if (search) params.append('search', search);

  const response = await apiRequest(`/blogs?${params.toString()}`);
  return {
    data: response.data,
    count: response.count,
    total: response.total,
    page: response.page,
    pages: response.pages
  };
}

export async function getBlog(id) {
  const response = await apiRequest(`/blogs/${id}`);
  return response.data;
}

export async function updateBlog(newBlog, id) {
  const formData = new FormData();

  // Append all blog data to form data
  Object.keys(newBlog).forEach(key => {
    if (newBlog[key] === null || newBlog[key] === undefined) {
      return;
    }
    if (key === 'blogImage' && newBlog[key] instanceof File) {
      formData.append('blogImage', newBlog[key]);
    } else if (key === 'galleryImages' && newBlog[key] instanceof FileList) {
      Array.from(newBlog[key]).forEach(file => {
        formData.append('galleryImages', file);
      });
    } else if (key !== 'blogImage' && key !== 'galleryImages') {
      formData.append(key, newBlog[key]);
    }
  });

  const response = await apiFormRequest(`/blogs/${id}`, formData, {
    method: 'PUT',
  });
  return response.data;
}

export async function getAdminBlogs(page = 1, limit = 10, status = 'all', search = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status: status,
  });

  if (search) params.append('search', search);

  const response = await apiRequest(`/blogs/admin?${params.toString()}`);
  return {
    data: response.data,
    count: response.count,
    total: response.total,
    page: response.page,
    pages: response.pages
  };
}

export async function updateBlogStatus(id, status) {
  const response = await apiRequest(`/blogs/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  });
  return response;
}

export async function deleteBlogById(id, force = false) {
  const params = force ? '?force=true' : '';
  const response = await apiRequest(`/blogs/${id}${params}`, {
    method: 'DELETE',
  });
  return response;
}

export async function getBlogCategories() {
  const response = await apiRequest('/blogs/categories/list');
  return response.data;
}

export async function likeBlog(id) {
  const response = await apiRequest(`/blogs/${id}/like`, {
    method: 'POST',
  });
  return response;
}

export async function bulkUpdateBlogs({ blogIds, isPublished }) {
  const response = await apiRequest('/blogs/bulk-update', {
    method: 'PUT',
    body: JSON.stringify({ blogIds, isPublished }),
  });
  return response.data;
}