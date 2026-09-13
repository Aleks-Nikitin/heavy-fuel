"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { OrderStatus } from "@/lib/types";
import { toast } from "react-toastify";
export default function StatusUpdater({ order, mutation, getStatusIcon }: any) {
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  useEffect(() => {
    setSelectedStatus(order.status);
  }, [order.status]);

  const hasChanged = selectedStatus !== order.status;

  const statusOptions: { label: string; value: OrderStatus }[] = [
    { label: "Pending", value: "PENDING" },
    { label: "Processing", value: "PROCESSING" },
    { label: "Shipped", value: "SHIPPED" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate({
          orderId: order.id,
          status: selectedStatus as OrderStatus,
        });
        toast.success(`Order status updated to ${selectedStatus}`);
      }}
    >
      <div className="relative flex items-center gap-2 rounded-md bg-zinc-800 pl-3 pr-8 py-1.5 text-sm font-bold uppercase tracking-wider text-white border border-zinc-700 hover:bg-zinc-700 transition">
        {getStatusIcon(selectedStatus)}

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          disabled={mutation.isPending}
          className="bg-transparent outline-none appearance-none cursor-pointer text-white tracking-wider"
        >
          {statusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-zinc-800 text-white font-sans normal-case tracking-normal"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
      </div>

      {hasChanged && (
        <button
          type="submit"
          disabled={mutation.isPending}
          className="text-sm font-bold uppercase tracking-wider text-[#CCFF00] hover:underline disabled:opacity-50"
        >
          {mutation.isPending ? "..." : "Update"}
        </button>
      )}
    </form>
  );
}
