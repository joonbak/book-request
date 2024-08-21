/* eslint-disable react/prop-types */
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "@/components/ui/use-toast";

import { CopyIcon } from "@/assets/CopyIcon";
import { DeleteIcon } from "@/assets/DeleteIcon";

export default function RequestTable({ books, setBooks, socket }) {
  const { toast } = useToast();
  const [openPopover, setOpenPopover] = useState(null);

  function copyToClipboard(isbn) {
    navigator.clipboard.writeText(isbn);
  }

  function changeStatus(id, newStatus) {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, status: newStatus } : book
      )
    );
    const data = { id, newStatus };
    socket.emit("status_request", data);
    setOpenPopover(null);
  }
  function deleteRequest(id) {
    socket.emit("delete_request", id);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  }

  return (
    <div className="flex rounded-md border w-1/2 lg:w-1/3 mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ISBN</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <div className="flex items-center">
                  {book.isbn}
                  <button
                    onClick={() => {
                      copyToClipboard(book.isbn);
                      toast({ description: "Copied ISBN to clipboard" });
                    }}
                    className="h-4 w-4 ml-2 rounded hover:bg-gray-200"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </TableCell>
              <TableCell>{book.quantity}</TableCell>
              <TableCell>
                <Popover
                  open={openPopover === book.id}
                  onOpenChange={(isOpen) =>
                    setOpenPopover(isOpen ? book.id : null)
                  }
                >
                  <PopoverTrigger>
                    {book.status === "ready" ? (
                      <Badge className="bg-green-500">{book.status}</Badge>
                    ) : book.status === "unavailable" ? (
                      <Badge className="bg-red-500">{book.status}</Badge>
                    ) : (
                      <Badge className="bg-gray-300">{book.status}</Badge>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2">
                    <button
                      onClick={() => changeStatus(book.id, "ready")}
                      className="w-full text-left hover:bg-gray-100 p-2 rounded"
                    >
                      Ready
                    </button>
                    <div className="border-t border-gray-300 my-2"></div>{" "}
                    <button
                      onClick={() => changeStatus(book.id, "unavailable")}
                      className="w-full text-left hover:bg-gray-100 p-2 rounded"
                    >
                      Unavailable
                    </button>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <div className="flex justify-end">
                  <button
                    onClick={() => deleteRequest(book.id)}
                    className="h-4 w-4 ml-2 rounded hover:bg-gray-200"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
