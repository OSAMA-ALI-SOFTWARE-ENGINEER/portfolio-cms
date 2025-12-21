import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../ui/Modal";
import FormRow from "../../ui/FormRow";
import { useUpdateAdminUser } from "../user/useUpdateAdminUser";

const EditUserModal = ({ user, onClose, isOpen }) => {
  const { updateUser, isUpdating } = useUpdateAdminUser();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.isAdmin ? "admin" : (user?.role || "user"), // Handle legacy isAdmin
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.isAdmin ? "admin" : (user.role || "user"),
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    updateUser(
      { id: user.id, data },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormRow lable="Name" error={errors.name?.message}>
          <input
            type="text"
            className="input-bordered input w-full"
            {...register("name", { required: "Name is required" })}
          />
        </FormRow>

        <FormRow lable="Email" error={errors.email?.message}>
          <input
            type="email"
            className="input-bordered input w-full"
            {...register("email", { required: "Email is required" })}
          />
        </FormRow>

        <FormRow lable="Role">
          <select
            className="select-bordered select w-full"
            {...register("role")}
          >
            <option value="user">User</option>
            <option value="editor">Editor (Can add blogs)</option>
            <option value="admin">Admin</option>
          </select>
        </FormRow>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            className="btn-ghost btn"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary btn"
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
